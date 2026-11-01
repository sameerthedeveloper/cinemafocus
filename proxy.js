import { NextResponse } from "next/server";
import { verifyAccessToken, ACCESS_TOKEN_COOKIE, PORTAL_TOKEN_COOKIE, PORTAL_REFRESH_COOKIE, PORTAL_ROLES } from "@/lib/aws/cognito";
import { seoRouteGate } from "@/lib/seoRoutes";
import { renderMaintenanceHtml } from "@/lib/maintenancePage";
import { CINEMA_FOCUS_GEO } from "@/lib/geoContext";

// Route protection for the admin portal, based on the httpOnly Cognito ID-token cookie.
async function updateSession(request) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const claims = await verifyAccessToken(token);
  const pathname = request.nextUrl.pathname;

  const isProtectedPath = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  if (isProtectedPath && !claims) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // A logged-in non-admin (e.g. dealer role) shouldn't reach the admin portal at all.
  if (isProtectedPath && claims && claims["custom:role"] !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  if (pathname === '/admin/login' && claims) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

// Owner portal (/portal/*): separate cookies from /admin. An expired ID token is refreshed
// transparently from the refresh-token cookie so the owner isn't logged out every hour.
async function portalGate(request) {
  const pathname = request.nextUrl.pathname;
  const isLogin = pathname === '/portal/login';

  let claims = await verifyAccessToken(request.cookies.get(PORTAL_TOKEN_COOKIE)?.value);
  let refreshedToken = null;

  if (!claims && process.env.API_GATEWAY_URL) {
    const refreshToken = request.cookies.get(PORTAL_REFRESH_COOKIE)?.value;
    if (refreshToken) {
      try {
        const res = await fetch(`${process.env.API_GATEWAY_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
          signal: AbortSignal.timeout(4000),
        });
        const data = res.ok ? await res.json() : null;
        const candidate = data?.IdToken ? await verifyAccessToken(data.IdToken) : null;
        if (candidate) { claims = candidate; refreshedToken = data.IdToken; }
      } catch {
        // fall through to the login redirect
      }
    }
  }

  const allowed = !!claims && PORTAL_ROLES.includes(claims['custom:role']);

  if (!isLogin && !allowed) {
    const url = request.nextUrl.clone();
    url.pathname = '/portal/login';
    url.search = '';
    const redirect = NextResponse.redirect(url);
    redirect.cookies.delete(PORTAL_TOKEN_COOKIE);
    return redirect;
  }
  if (isLogin && allowed) {
    const url = request.nextUrl.clone();
    url.pathname = '/portal/dashboard';
    return NextResponse.redirect(url);
  }

  if (refreshedToken) {
    request.cookies.set(PORTAL_TOKEN_COOKIE, refreshedToken); // visible to this request's server components
    const response = NextResponse.next({ request });
    response.cookies.set(PORTAL_TOKEN_COOKIE, refreshedToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60,
    });
    return response;
  }
  return NextResponse.next();
}

// Maintenance settings are read on every public request, so cache them briefly per
// instance (protects the small Lambda concurrency limit) and never let a slow or
// failing AWS call block a page: on any error the site is served normally.
const MAINTENANCE_TTL_MS = 30_000;
let maintenanceCache = { at: 0, value: null };

async function getMaintenanceSettings() {
  const now = Date.now();
  if (now - maintenanceCache.at < MAINTENANCE_TTL_MS) return maintenanceCache.value;

  const base = process.env.API_GATEWAY_URL;
  if (!base) return null;

  const res = await fetch(`${base}/site-settings/maintenance`, { signal: AbortSignal.timeout(3000) });
  // 404 = maintenance never configured -> normal site
  const value = res.ok ? ((await res.json())?.data ?? null) : null;
  if (res.ok || res.status === 404) maintenanceCache = { at: now, value };
  return value;
}

// Live contact details (email, phones, hours) from the footer settings, so the maintenance
// page always shows what the admin has set. Same short cache; any failure falls back to the
// static showroom details.
let contactCache = { at: 0, value: null };

async function getContactSettings() {
  const now = Date.now();
  if (now - contactCache.at < MAINTENANCE_TTL_MS) return contactCache.value;
  const base = process.env.API_GATEWAY_URL;
  if (!base) return null;
  try {
    const res = await fetch(`${base}/site-settings/footer`, { signal: AbortSignal.timeout(2000) });
    const value = res.ok ? ((await res.json())?.data ?? null) : null;
    contactCache = { at: now, value };
    return value;
  } catch {
    return null;
  }
}

export async function proxy(request) {
  // Owner portal has its own session handling and never shows the public maintenance page.
  if (request.nextUrl.pathname === '/portal' || request.nextUrl.pathname.startsWith('/portal/')) {
    return portalGate(request);
  }

  // 1. Run authenticating/session updates first
  const sessionResponse = await updateSession(request);
  
  // If the session response is a redirect or rewrite, return it immediately
  if (sessionResponse.status === 307 || sessionResponse.status === 308 || sessionResponse.status === 302) {
    return sessionResponse;
  }

  const url = new URL(request.url);
  const pathname = url.pathname;

  // 2. Check if this is a public page route (excluding admin portal, api, next internals, and common assets)
  const isPublicRoute = 
    !pathname.startsWith('/admin') && 
    !pathname.startsWith('/api') && 
    !pathname.startsWith('/_next') && 
    pathname !== '/favicon.ico' &&
    pathname !== '/favico.png' &&
    pathname !== '/robots.txt' &&
    pathname !== '/sitemap.xml';

  if (isPublicRoute) {
    try {
      const settings = await getMaintenanceSettings();

      if (settings) {
        const hostname = request.nextUrl.hostname;
        const isLocal = 
          hostname === 'localhost' ||
          hostname === '127.0.0.1' ||
          hostname.startsWith('192.168.');

        const shouldShowMaintenance = settings.enabled && (!isLocal || settings.activeInDev);

        if (shouldShowMaintenance) {
          const title = settings.title || "Refining the Sound.";
          const message = settings.message || "We are currently upgrading our digital showroom to bring you a state-of-the-art visual and acoustic catalog. Please visit us again shortly.";
          
          const contact = (await getContactSettings()) || {};
          const phones = Array.isArray(contact.phones) && contact.phones.length ? contact.phones : [contact.phone];
          const html = renderMaintenanceHtml({
            title,
            message,
            email: contact.email || CINEMA_FOCUS_GEO.email,
            phone: phones.find(Boolean) || CINEMA_FOCUS_GEO.mobile,
            hours: contact.workingHours || '',
            showAdminLink: isLocal,
          });

          return new Response(html, {
            status: 503,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Retry-After': '3600', // Tells search crawlers to retry in 1 hour
            }
          });
        }
      }
    } catch (e) {
      console.error("Proxy maintenance check failed, bypassing:", e);
    }
  }

  // 3. Real 308 / 404 status codes for duplicate, legacy-UUID and unknown content URLs
  if (isPublicRoute) {
    try {
      const gated = await seoRouteGate(request);
      if (gated) return gated;
    } catch (e) {
      console.error("Proxy SEO route gate failed, bypassing:", e);
    }
  }

  return sessionResponse;
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static assets (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

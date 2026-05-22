import { updateSession } from "@/lib/supabase/proxy";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(request) {
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
    pathname !== '/favi.png';

  if (isPublicRoute) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              // Read-only client in proxy, but setAll is required by types
            },
          },
        }
      );

      // Fetch maintenance mode settings
      let { data, error } = await supabase
        .from('site_settings')
        .select('data')
        .eq('id', 'maintenance')
        .single();

      let settings = data?.data;
      if (error && error.code === 'PGRST205') {
        const fallback = await supabase
          .from('site_content')
          .select('data')
          .eq('id', 'maintenance')
          .single();
        settings = fallback.data?.data;
      }

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
          
          // Return a high-fidelity, server-rendered 503 response matching the brand theme
          const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Cinema Focus</title>
  <style>
    :root {
      --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #0a0a0a;
      color: #ffffff;
      font-family: var(--font-sans);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 3rem 1.5rem;
      position: relative;
      overflow: hidden;
      -webkit-user-select: none;
      user-select: none;
    }
    /* Soft background ambient glow */
    .glow {
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(239, 68, 68, 0.05) 0%, rgba(245, 158, 11, 0.03) 50%, rgba(0, 0, 0, 0) 70%);
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
      animation: pulse 8s infinite ease-in-out;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.9); }
      50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
    }
    .header {
      max-width: 56rem;
      width: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }
    .logo-container {
      display: block;
      height: 3.5rem;
      width: 16rem;
      position: relative;
    }
    .logo-img {
      height: 100%;
      width: auto;
      object-fit: contain;
    }
    .tag {
      font-size: 0.75rem;
      color: #a1a1aa;
      border: 1px solid #27272a;
      border-radius: 9999px;
      padding: 0.375rem 1rem;
      background-color: rgba(24, 24, 27, 0.4);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-weight: 500;
    }
    .tag-icon {
      width: 8px;
      height: 8px;
      background-color: #f59e0b;
      border-radius: 50%;
      animation: bounce 1.2s infinite ease-in-out;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    .content {
      max-width: 42rem;
      width: 100%;
      margin: auto auto;
      text-align: center;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding-top: 3rem;
    }
    .title {
      font-size: 2.25rem;
      font-weight: 500;
      letter-spacing: -0.025em;
      line-height: 1.2;
      color: #ffffff;
    }
    @media (min-width: 768px) {
      .title {
        font-size: 3.75rem;
      }
    }
    .message {
      font-size: 0.875rem;
      color: #a1a1aa;
      font-weight: 300;
      line-height: 1.6;
      max-width: 32rem;
      margin: 0 auto;
    }
    @media (min-width: 768px) {
      .message {
        font-size: 1rem;
      }
    }
    .divider {
      height: 1px;
      width: 4rem;
      background-color: #27272a;
      margin: 2rem auto;
    }
    .footer {
      max-width: 56rem;
      width: 100%;
      margin: 0 auto;
      text-align: center;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .contacts {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
      font-size: 0.75rem;
      color: #71717a;
    }
    .contacts a {
      color: #71717a;
      text-decoration: none;
      transition: color 0.2s;
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }
    .contacts a:hover {
      color: #ffffff;
    }
    .bullet {
      color: #27272a;
    }
    .copyright {
      font-size: 0.625rem;
      color: #404040;
    }
    .admin-link {
      margin-top: 0.75rem;
      display: inline-block;
      color: #52525b;
      text-decoration: underline;
      transition: color 0.2s;
    }
    .admin-link:hover {
      color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="glow"></div>
  <div class="header">
    <div class="logo-container">
      <img class="logo-img" src="/images/logo-light.webp" alt="Cinema Focus Logo" />
    </div>
    <span class="tag">
      <span class="tag-icon"></span>
      Website Upgrade
    </span>
  </div>
  
  <div class="content">
    <h1 class="title">${title}</h1>
    <p class="message">${message}</p>
    <div class="divider"></div>
  </div>
  
  <div class="footer">
    <div class="contacts">
      <a href="mailto:support@cinemafocus.in">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        support@cinemafocus.in
      </a>
      <span class="bullet">•</span>
      <a href="tel:+96899999999">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        Contact Advisor
      </a>
    </div>
    <div class="copyright">
      &copy; ${new Date().getFullYear()} Cinema Focus. All rights reserved.
      ${isLocal ? `
      <div>
        <a href="/admin" class="admin-link">Return to Admin Dashboard (Local)</a>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;

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

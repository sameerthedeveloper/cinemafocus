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
    pathname !== '/favico.png' &&
    pathname !== '/robots.txt' &&
    pathname !== '/sitemap.xml';

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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-bg: #050505;
      --color-accent: #dfb15b;
      --color-text-primary: #f5f5f7;
      --color-text-secondary: #a1a1aa;
      --color-border: rgba(223, 177, 91, 0.1);
      --font-display: 'SF Pro Display', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: var(--color-bg);
      color: var(--color-text-primary);
      font-family: var(--font-sans);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 3rem 1.5rem;
      position: relative;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -webkit-user-select: none;
      user-select: none;
    }
    /* Subtle background grid pattern */
    .grid-backdrop {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(223, 177, 91, 0.04) 1px, transparent 1px);
      background-size: 24px 24px;
      pointer-events: none;
      z-index: 1;
    }
    /* Ambient tube-glowing lights */
    .glow-container {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 2;
    }
    .glow-1 {
      position: absolute;
      top: -10%;
      right: -10%;
      width: 55vw;
      height: 55vw;
      min-width: 400px;
      background: radial-gradient(circle, rgba(223, 177, 91, 0.08) 0%, rgba(223, 177, 91, 0.02) 50%, transparent 70%);
      filter: blur(80px);
      border-radius: 50%;
      animation: drift-slow 15s infinite ease-in-out alternate;
    }
    .glow-2 {
      position: absolute;
      bottom: -10%;
      left: -10%;
      width: 60vw;
      height: 60vw;
      min-width: 500px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, rgba(223, 177, 91, 0.01) 60%, transparent 80%);
      filter: blur(100px);
      border-radius: 50%;
      animation: drift-slow-reverse 20s infinite ease-in-out alternate;
    }
    @keyframes drift-slow {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(-5%, 5%) scale(1.1); }
    }
    @keyframes drift-slow-reverse {
      0% { transform: translate(0, 0) scale(1.1); }
      100% { transform: translate(5%, -5%) scale(0.9); }
    }
    /* Animation keyframes */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-down {
      animation: fadeInDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
      z-index: 10;
    }
    .animate-up {
      animation: fadeInUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
      z-index: 10;
    }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.35s; }
    .delay-3 { animation-delay: 0.55s; }
    .delay-4 { animation-delay: 0.75s; }
    
    .header {
      max-width: 62rem;
      width: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }
    .logo-container {
      display: block;
      height: 2.75rem;
      position: relative;
    }
    .logo-img {
      height: 100%;
      width: auto;
      object-fit: contain;
    }
    .status-tag {
      font-size: 0.7rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--color-accent);
      border: 1px solid var(--color-border);
      border-radius: 9999px;
      padding: 0.4rem 1rem;
      background: rgba(223, 177, 91, 0.03);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      background-color: var(--color-accent);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--color-accent);
      animation: pulse-dot 2s infinite ease-in-out;
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 0.4; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    .content-wrapper {
      max-width: 48rem;
      width: 100%;
      margin: auto auto;
      text-align: center;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 1rem;
    }
    .display-title {
      font-family: var(--font-display);
      font-size: 2.5rem;
      font-weight: 500;
      line-height: 1.1;
      color: var(--color-text-primary);
      margin-bottom: 1.25rem;
      letter-spacing: -0.03em;
    }
    @media (min-width: 768px) {
      .display-title {
        font-size: 3.75rem;
      }
    }
    .description {
      font-family: var(--font-sans);
      font-size: 0.95rem;
      font-weight: 300;
      line-height: 1.7;
      color: var(--color-text-secondary);
      max-width: 32rem;
      margin: 0 auto;
      letter-spacing: -0.01em;
    }
    @media (min-width: 768px) {
      .description {
        font-size: 1.05rem;
      }
    }
    .decorative-accent {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin: 2.25rem 0;
    }
    .accent-line {
      height: 1px;
      width: 5rem;
      background: linear-gradient(90deg, transparent, var(--color-border), var(--color-accent), var(--color-border), transparent);
    }
    .contact-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 28rem;
      margin: 0 auto;
    }
    @media (min-width: 640px) {
      .contact-container {
        flex-direction: row;
        justify-content: center;
      }
    }
    .contact-card {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.03);
      background: rgba(255, 255, 255, 0.01);
      color: var(--color-text-secondary);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 400;
      letter-spacing: 0.02em;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .contact-card:hover {
      border-color: rgba(223, 177, 91, 0.3);
      background: rgba(223, 177, 91, 0.03);
      color: var(--color-text-primary);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(223, 177, 91, 0.05);
    }
    .contact-card svg {
      transition: transform 0.4s ease;
      stroke: var(--color-accent);
    }
    .contact-card:hover svg {
      transform: scale(1.1);
    }
    .footer {
      max-width: 62rem;
      width: 100%;
      margin: 0 auto;
      text-align: center;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.02);
      padding-top: 2rem;
    }
    .copyright {
      font-size: 0.7rem;
      letter-spacing: 0.02em;
      color: rgba(255, 255, 255, 0.3);
    }
    .admin-link-wrapper {
      margin-top: 0.5rem;
    }
    .admin-link {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.4);
      text-decoration: none;
      padding: 0.35rem 0.75rem;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.02);
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .admin-link:hover {
      color: var(--color-accent);
      border-color: var(--color-border);
      background: rgba(223, 177, 91, 0.02);
    }
  </style>
</head>
<body>
  <div class="grid-backdrop"></div>
  <div class="glow-container">
    <div class="glow-1"></div>
    <div class="glow-2"></div>
  </div>

  <header class="header animate-down delay-1">
    <div class="logo-container">
      <img class="logo-img" src="/images/logo-light.webp" alt="Cinema Focus Logo" />
    </div>
    <div class="status-tag">
      <span class="status-dot"></span>
      <span class="status-text">Studio Upgrade</span>
    </div>
  </header>
  
  <main class="content-wrapper animate-up delay-2">
    <h1 class="display-title">${title}</h1>
    <p class="description">${message}</p>
    
    <div class="decorative-accent animate-up delay-3">
      <div class="accent-line"></div>
    </div>

    <div class="contact-container animate-up delay-4">
      <a class="contact-card" href="mailto:support@cinemafocus.in">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        support@cinemafocus.in
      </a>
      <a class="contact-card" href="tel:+96899999999">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        Contact Advisor
      </a>
    </div>
  </main>
  
  <footer class="footer animate-up delay-4">
    <div class="copyright">
      &copy; ${new Date().getFullYear()} Cinema Focus. All rights reserved.
    </div>
    ${isLocal ? `
    <div class="admin-link-wrapper">
      <a href="/admin" class="admin-link">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Return to Admin Dashboard (Local)
      </a>
    </div>
    ` : ''}
  </footer>
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

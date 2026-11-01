// Server-rendered 503 page shown while maintenance mode is on. Styled to match the 404 page
// (white, Inter, pill buttons). Returned straight from proxy.js, so it is plain HTML with
// inline CSS: no React, no Tailwind.

const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const telHref = (phone) => `tel:${String(phone).replace(/[^+\d]/g, '')}`;

export function renderMaintenanceHtml({ title, message, email, phone, hours, showAdminLink }) {
  const safeTitle = esc(title);
  const mail = email
    ? `<a class="btn primary" href="mailto:${esc(email)}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        ${esc(email)}
      </a>`
    : '';
  const call = phone ? `<a class="btn" href="${esc(telHref(phone))}">Call ${esc(phone)}</a>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>${safeTitle} | Cinema Focus</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root { --bg:#fff; --fg:#000; --muted:#737373; --secondary:#f5f5f5; --accent:#e5e5e5; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg); color: var(--fg);
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      font-feature-settings: "cv11", "ss01";
      -webkit-font-smoothing: antialiased;
      min-height: 100vh; display: flex; flex-direction: column;
    }
    .wrap { width: 100%; max-width: 80rem; margin: 0 auto; padding: 0 1rem; }
    @media (min-width: 768px) { .wrap { padding: 0 2rem; } }
    /* header.wrap: the .wrap shorthand padding would otherwise cancel the top padding */
    header.wrap { padding-top: 1.5rem; }
    @media (min-width: 768px) { header.wrap { padding-top: 2rem; } }
    header img { display: block; height: 3rem; width: auto; }
    main { flex: 1; display: flex; flex-direction: column; justify-content: center; padding-top: 4rem; padding-bottom: 4rem; }
    .chip {
      display: inline-flex; align-items: center; gap: .5rem; align-self: flex-start;
      background: var(--secondary); border-radius: 9999px; padding: .375rem .875rem;
      font-size: .875rem; font-weight: 500;
    }
    .dot { width: .5rem; height: .5rem; border-radius: 9999px; background: var(--fg); animation: pulse 2s ease-in-out infinite; }
    @keyframes pulse { 0%,100% { opacity: .25; } 50% { opacity: 1; } }
    h1 { margin-top: 1.25rem; font-size: 3rem; line-height: 1.05; font-weight: 500; letter-spacing: -0.03em; text-wrap: balance; }
    @media (min-width: 768px) { h1 { font-size: 4.5rem; } }
    .lead { margin-top: 1.25rem; max-width: 36rem; font-size: 1.125rem; line-height: 1.6; color: var(--muted); }
    @media (min-width: 768px) { .lead { font-size: 1.25rem; } }
    .actions { margin-top: 2.5rem; display: flex; flex-wrap: wrap; gap: .75rem; }
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
      height: 3rem; padding: 0 1.75rem; border-radius: 9999px; border: 0; cursor: pointer;
      font: inherit; font-size: .875rem; font-weight: 500; letter-spacing: -0.01em;
      color: var(--fg); background: var(--secondary); text-decoration: none; transition: background .2s;
    }
    .btn:hover { background: var(--accent); }
    .btn.primary { background: var(--fg); color: #fff; }
    .btn.primary:hover { background: rgba(0,0,0,.9); }
    .btn:focus-visible { outline: 2px solid var(--fg); outline-offset: 2px; }
    .hours { margin-top: 1.5rem; font-size: .875rem; color: var(--muted); white-space: pre-line; }
    .dev { margin-top: 2.5rem; font-size: .875rem; color: var(--muted); text-underline-offset: 4px; }
    footer.wrap { padding-bottom: 2rem; font-size: .875rem; color: var(--muted); }
    @media (prefers-reduced-motion: reduce) { .dot { animation: none; opacity: 1; } }
  </style>
</head>
<body>
  <header class="wrap">
    <img src="/images/logo.png" alt="Cinema Focus">
  </header>

  <main class="wrap">
    <span class="chip"><span class="dot" aria-hidden="true"></span>Down for maintenance</span>
    <h1>${safeTitle}</h1>
    <p class="lead">${esc(message)}</p>

    <div class="actions">
      ${mail}
      ${call}
      <button class="btn" type="button" onclick="location.reload()">Check again</button>
    </div>
    ${hours ? `<p class="hours">Showroom hours: ${esc(hours)}</p>` : ''}
    ${showAdminLink ? `<a class="dev" href="/admin">Admin dashboard (local only)</a>` : ''}
  </main>

  <footer class="wrap">&copy; ${new Date().getFullYear()} Cinema Focus. All rights reserved.</footer>

  <script>
    // Reload into the live site as soon as maintenance mode is switched off.
    setInterval(function () {
      fetch(location.href, { method: 'HEAD', cache: 'no-store' })
        .then(function (r) { if (r.status !== 503) location.reload(); })
        .catch(function () {});
    }, 60000);
  </script>
</body>
</html>`;
}

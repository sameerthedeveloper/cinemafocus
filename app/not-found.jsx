import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Outfit:wght@200;300;400;500;600&display=swap');

        :root {
          --color-bg: #050505;
          --color-accent: #dfb15b;
          --color-text-primary: #f5f5f7;
          --color-text-secondary: #a1a1aa;
          --color-border: rgba(223, 177, 91, 0.1);
          --font-display: 'Cinzel', Georgia, serif;
          --font-sans: 'Outfit', system-ui, -apple-system, sans-serif;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body.not-found-body {
          background-color: var(--color-bg) !important;
          color: var(--color-text-primary) !important;
          font-family: var(--font-sans) !important;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* Centered Boxed Layout wrapper */
        .viewport-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          max-width: 55rem;
          margin: 0 auto;
          padding: 4rem 1.5rem;
          position: relative;
          z-index: 10;
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
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }
        .logo-container {
          display: block;
          height: 2.5rem;
          position: relative;
        }
        .logo-img {
          height: 100%;
          width: auto;
          object-fit: contain;
        }
        .status-tag {
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent);
          border: 1px solid var(--color-border);
          border-radius: 9999px;
          padding: 0.45rem 1.1rem;
          background: rgba(223, 177, 91, 0.03);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
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
          width: 100%;
          text-align: center;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 0;
        }
        .display-title {
          font-family: var(--font-display);
          font-size: 2.75rem;
          font-weight: 500;
          line-height: 1.15;
          color: var(--color-text-primary);
          margin-bottom: 1.25rem;
          letter-spacing: -0.01em;
        }
        @media (min-width: 768px) {
          .display-title {
            font-size: 4rem;
          }
        }
        .description {
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.75;
          color: var(--color-text-secondary);
          max-width: 34rem;
          margin: 0 auto;
          letter-spacing: -0.01em;
        }
        @media (min-width: 768px) {
          .description {
            font-size: 1.1rem;
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
          width: 6rem;
          background: linear-gradient(90deg, transparent, var(--color-border), var(--color-accent), var(--color-border), transparent);
        }
        
        .contact-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: 100%;
          max-width: 32rem;
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .contact-container {
            flex-direction: row;
            justify-content: center;
          }
        }
        
        /* Exact balanced height and alignment, no uppercase transform */
        .contact-card {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          height: 3.25rem;
          padding: 0 1.75rem;
          border-radius: 9999px;
          border: 1px solid rgba(223, 177, 91, 0.25);
          background: rgba(223, 177, 91, 0.01);
          color: var(--color-accent);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
          white-space: nowrap;
        }
        
        .contact-card.primary {
          background-color: var(--color-text-primary);
          color: var(--color-bg);
          border: 1px solid var(--color-text-primary);
          box-shadow: 0 4px 30px rgba(255, 255, 255, 0.05);
        }
        
        .contact-card.primary:hover {
          border-color: var(--color-text-primary);
          background-color: transparent;
          color: var(--color-text-primary);
          box-shadow: 0 8px 30px rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .contact-card.secondary:hover {
          border-color: var(--color-accent);
          background-color: rgba(223, 177, 91, 0.03);
          color: var(--color-text-primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(223, 177, 91, 0.08);
        }
        
        .contact-card svg {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .contact-card:hover svg {
          transform: translateX(3px);
        }
        
        .footer {
          width: 100%;
          text-align: center;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.02);
          padding-top: 2.25rem;
        }
        .copyright {
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.25);
        }
        .admin-link-wrapper {
          margin-top: 0.25rem;
        }
        .admin-link {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.35);
          text-decoration: none;
          padding: 0.45rem 1rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.01);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .admin-link:hover {
          color: var(--color-accent);
          border-color: var(--color-border);
          background: rgba(223, 177, 91, 0.02);
        }
      ` }} />

      <div className="not-found-body min-h-screen bg-[#050505] text-[#f5f5f7]">
        <div className="grid-backdrop"></div>
        <div className="glow-container">
          <div className="glow-1"></div>
          <div className="glow-2"></div>
        </div>

        {/* Cohesive centered viewport wrapper */}
        <div className="viewport-wrapper">
          {/* Header */}
          <header className="header animate-down delay-1">
            <Link href="/" className="logo-container">
              <img className="logo-img" src="/images/logo-light.webp" alt="Cinema Focus Logo" />
            </Link>
            <div className="status-tag">
              <span className="status-dot"></span>
              <span className="status-text">404 Error</span>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="content-wrapper animate-up delay-2">
            <h1 className="display-title">Lost in the Sound.</h1>
            <p className="description">
              The page you are looking for has faded out or does not exist. Let us guide you back to our high-fidelity collection.
            </p>
            
            <div className="decorative-accent animate-up delay-3">
              <div className="accent-line"></div>
            </div>

            <div className="contact-container animate-up delay-4">
              <Link className="contact-card primary" href="/">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
                RETURN TO SHOWROOM
              </Link>
              <a className="contact-card secondary" href="mailto:support@cinemafocus.in">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                support@cinemafocus.in
              </a>
            </div>
          </main>
          
          {/* Footer */}
          <footer className="footer animate-up delay-4">
            <div className="copyright">
              &copy; {currentYear} Cinema Focus. All rights reserved.
            </div>
            <div className="admin-link-wrapper">
              <Link href="/admin/dashboard" className="admin-link">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Admin Dashboard
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

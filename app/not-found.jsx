import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const metadata = { title: 'Page not found', robots: { index: false, follow: true } };

const action =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-medium tracking-tight transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="mx-auto w-full max-w-7xl px-4 pt-6 md:px-8 md:pt-8">
        <Link href="/" aria-label="Cinema Focus home" className="relative block h-12 w-44">
          <Image src="/images/logo.png" alt="Cinema Focus" fill priority sizes="176px" className="object-contain object-left" />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-16 md:px-8">
        <p className="text-sm font-medium text-muted-foreground">Error 404</p>
        <h1 className="mt-3 text-5xl font-medium tracking-tight md:text-7xl">Page not found.</h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground md:text-xl">
          This page has moved or never existed. Head back to the collection, or ask us and we will point you to the right system.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className={`${action} bg-primary text-primary-foreground hover:bg-primary/90`}>
            Back to home
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/products" className={`${action} bg-secondary hover:bg-accent`}>
            Browse products
          </Link>
          <Link href="/contact" className={`${action} bg-secondary hover:bg-accent`}>
            Contact us
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <Link href="/admin/dashboard" className="mt-12 text-sm text-muted-foreground underline-offset-4 hover:underline">
            Admin dashboard (dev only)
          </Link>
        )}
      </main>

      <footer className="mx-auto w-full max-w-7xl px-4 pb-8 text-sm text-muted-foreground md:px-8">
        &copy; {new Date().getFullYear()} Cinema Focus. All rights reserved.
      </footer>
    </div>
  );
}

"use client";

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageTracker from "@/components/PageTracker";

export default function PublicLayout({ children }) {
  return (
    <>
      <ScrollToTop />
      <PageTracker />
      <Header />
      <main className="flex-grow flex flex-col pt-0">
         {children}
      </main>
      <Footer />
    </>
  );
}

"use client";

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function PublicLayout({ children }) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="flex-grow flex flex-col pt-0">
         {children}
      </main>
      <Footer />
    </>
  );
}

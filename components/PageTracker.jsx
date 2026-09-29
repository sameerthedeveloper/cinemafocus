"use client";

import { usePageTracking } from '@/lib/analytics';

/** Renders nothing; records anonymous page views for the owner portal analytics. */
export default function PageTracker() {
  usePageTracking();
  return null;
}

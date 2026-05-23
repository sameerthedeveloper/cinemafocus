"use client";

import React, { useState } from 'react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Monitor, Moon, Sun, Loader2, Image as ImageIcon, AlertTriangle, Zap, HardDrive } from 'lucide-react';
import clsx from 'clsx';

export default function AdminSettingsPage() {
  const { theme, imageOptimizationMode, updateSettings, loading } = useSiteSettings();
  const [updating, setUpdating] = useState(false);

  const handleThemeChange = async (newTheme) => {
    setUpdating(true);
    try {
        await updateSettings({ theme: newTheme });
    } finally {
        setUpdating(false);
    }
  };

  const handleModeChange = async (newMode) => {
    setUpdating(true);
    try {
        await updateSettings({ imageOptimizationMode: newMode });
    } finally {
        setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-muted-foreground flex items-center"><Loader2 className="animate-spin mr-2"/> Loading settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-8 animate-fade-in pb-20 md:pb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">Site Settings</h1>
        <p className="text-muted-foreground text-sm md:text-base">Manage global configuration and appearance.</p>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                <Monitor size={20} className="text-muted-foreground" />
                Appearance
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
                Customize how the website looks to visitors.
            </p>
        </div>
        
        <div className="p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium mb-4">
                    Global Theme
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => handleThemeChange('light')}
                        disabled={updating}
                        className={clsx(
                            "relative flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                            theme === 'light' 
                                ? "border-primary bg-primary/5 ring-1 ring-primary" 
                                : "border-border hover:border-primary/30 hover:bg-secondary/50"
                        )}
                    >
                        <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center shadow-sm">
                            <Sun size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <div className="font-semibold text-foreground">Light Mode</div>
                            <div className="text-xs text-muted-foreground">Clean, crisp, standard experience.</div>
                        </div>
                        {theme === 'light' && (
                            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary" />
                        )}
                    </button>

                    <button
                        onClick={() => handleThemeChange('dark')}
                        disabled={updating}
                        className={clsx(
                            "relative flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                            theme === 'dark' 
                                ? "border-primary bg-zinc-900 ring-1 ring-primary text-white" 
                                : "border-border hover:border-primary/30 hover:bg-zinc-900/5 dark:hover:bg-zinc-800"
                        )}
                    >
                        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-sm">
                            <Moon size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <div className={clsx("font-semibold", theme === 'dark' ? "text-white" : "text-foreground")}>Dark Mode</div>
                            <div className={clsx("text-xs", theme === 'dark' ? "text-zinc-400" : "text-muted-foreground")}>
                                Premium, Apple-style dark aesthetic.
                            </div>
                        </div>
                        {theme === 'dark' && (
                            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary" />
                        )}
                    </button>
                 </div>
            </div>
        </div>
      </div>

      {/* Deliverable 6: Image Optimization Mode Panel */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon size={20} className="text-muted-foreground" />
                Image Optimization
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
                Configure how the website loads and processes images to optimize performance and control hosting costs.
            </p>
        </div>
        
        <div className="p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium mb-4">
                    Optimization Pipeline Strategy
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => handleModeChange('upload')}
                        disabled={updating}
                        className={clsx(
                            "relative flex flex-col justify-between p-5 rounded-xl border-2 text-left transition-all h-full cursor-pointer",
                            imageOptimizationMode === 'upload' || !imageOptimizationMode
                                ? "border-primary bg-primary/5 ring-1 ring-primary" 
                                : "border-border hover:border-primary/30 hover:bg-secondary/50"
                        )}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <HardDrive size={16} className="text-emerald-500" />
                            </div>
                            <div className="font-semibold text-foreground text-sm">Upload-Time</div>
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed mb-4">
                            Pre-optimized WebP served directly via CDN. Eliminates runtime computation costs. Recommended for production.
                        </div>
                        {(imageOptimizationMode === 'upload' || !imageOptimizationMode) && (
                            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary" />
                        )}
                    </button>

                    <button
                        onClick={() => handleModeChange('hybrid')}
                        disabled={updating}
                        className={clsx(
                            "relative flex flex-col justify-between p-5 rounded-xl border-2 text-left transition-all h-full cursor-pointer",
                            imageOptimizationMode === 'hybrid' 
                                ? "border-primary bg-primary/5 ring-1 ring-primary" 
                                : "border-border hover:border-primary/30 hover:bg-secondary/50"
                        )}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <Zap size={16} className="text-amber-500" />
                            </div>
                            <div className="font-semibold text-foreground text-sm">Hybrid Mode</div>
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed mb-4">
                            Optimizes LCP hero slides at runtime on Vercel while serving standard content pre-processed to balance speeds.
                        </div>
                        {imageOptimizationMode === 'hybrid' && (
                            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary" />
                        )}
                    </button>

                    <button
                        onClick={() => handleModeChange('runtime')}
                        disabled={updating}
                        className={clsx(
                            "relative flex flex-col justify-between p-5 rounded-xl border-2 text-left transition-all h-full cursor-pointer",
                            imageOptimizationMode === 'runtime' 
                                ? "border-primary bg-primary/5 ring-1 ring-primary text-white" 
                                : "border-border hover:border-primary/30 hover:bg-secondary/50"
                        )}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                <AlertTriangle size={16} className="text-rose-500" />
                            </div>
                            <div className="font-semibold text-foreground text-sm">Runtime (Vercel)</div>
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed mb-4">
                            Standard Next.js Image optimization enabled everywhere on every request. Increases Vercel usage and costs.
                        </div>
                        {imageOptimizationMode === 'runtime' && (
                            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary" />
                        )}
                    </button>
                </div>
            </div>

            {/* Dynamic Alert Banner */}
            {(imageOptimizationMode === 'runtime' || imageOptimizationMode === 'hybrid') && (
                <div className="flex gap-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 animate-fade-in text-amber-500">
                    <AlertTriangle className="shrink-0 mt-0.5 animate-bounce-slow" size={20} />
                    <div className="text-sm">
                        <span className="font-semibold block mb-0.5">⚠️ Runtime Transformation Cost Warning</span>
                        {imageOptimizationMode === 'runtime' 
                          ? "Every requested image will be processed dynamically on Vercel. This will rapidly increase monthly Vercel Image Transformation counts and may lead to additional hosting costs."
                          : "Hero & above-fold banners will be processed dynamically at runtime. This balances load times for critical sections but will use some monthly Vercel Image Optimization quotas."}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

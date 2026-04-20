import React from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { Monitor, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import Button from '../../components/Button';

const Settings = () => {
  const { theme, updateTheme, loading } = useSiteSettings();
  const [updating, setUpdating] = React.useState(false);

  const handleThemeChange = async (newTheme) => {
    setUpdating(true);
    try {
        await updateTheme(newTheme);
    } finally {
        setUpdating(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Site Settings</h1>
        <p className="text-zinc-500">Manage global configuration and appearance.</p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                <Monitor size={20} className="text-zinc-500" />
                Appearance
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
                Customize how the website looks to visitors.
            </p>
        </div>
        
        <div className="p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-4">
                    Global Theme
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => handleThemeChange('light')}
                        disabled={updating}
                        className={clsx(
                            "relative flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                            theme === 'light' 
                                ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600" 
                                : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                        )}
                    >
                        <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                            <Sun size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <div className="font-semibold text-zinc-900">Light Mode</div>
                            <div className="text-xs text-zinc-500">Clean, crisp, standard experience.</div>
                        </div>
                        {theme === 'light' && (
                            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-blue-600" />
                        )}
                    </button>

                    <button
                        onClick={() => handleThemeChange('dark')}
                        disabled={updating}
                        className={clsx(
                            "relative flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                            theme === 'dark' 
                                ? "border-blue-600 bg-zinc-900 ring-1 ring-blue-600 text-white" 
                                : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-900/5"
                        )}
                    >
                        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-sm">
                            <Moon size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <div className={clsx("font-semibold", theme === 'dark' ? "text-white" : "text-zinc-900")}>Dark Mode</div>
                            <div className={clsx("text-xs", theme === 'dark' ? "text-zinc-400" : "text-zinc-500")}>
                                Premium, Apple-style dark aesthetic.
                            </div>
                        </div>
                        {theme === 'dark' && (
                            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-blue-600" />
                        )}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

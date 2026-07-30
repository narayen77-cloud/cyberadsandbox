import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Layers, Sparkles } from 'lucide-react';
import { setSEO } from '../utils/ga4';
import { useTheme } from '../context/ThemeContext';

export const NotFoundPage: React.FC = () => {
  const { openSearch } = useTheme();

  useEffect(() => {
    setSEO('404 - Page Not Found', 'The requested page could not be found on blog.cyberad.in.');
  }, []);

  return (
    <div className="py-20 text-center space-y-6 max-w-lg mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto shadow-inner">
        <span className="text-3xl font-black">404</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Article or Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The link you followed may be broken or the post has been moved in our Phase 1 updates. Explore our latest articles below.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition-transform hover:scale-105 shadow-md cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <button
          onClick={openSearch}
          className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Search Articles</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X, Activity, BookOpen, User, Mail, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const { theme, toggleTheme, openSearch, toggleGA4Drawer, isGA4DrawerOpen } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/author' },
    { name: 'Contact', path: '/contact' },
    { name: 'Publishing Admin', path: '/admin' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            C
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                cyberad<span className="text-blue-600 dark:text-blue-400">.in</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                BLOG
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline font-mono">
              blog.cyberad.in
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Search Trigger Button */}
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Search articles (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-400 shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* GA4 Active Debug Toggle */}
          <button
            onClick={toggleGA4Drawer}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border cursor-pointer ${
              isGA4DrawerOpen
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
            }`}
            title="Toggle GA4 Event Stream"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>GA4</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg md:hidden text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  toggleGA4Drawer();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium"
              >
                <Activity className="w-4 h-4" />
                <span>GA4 Telemetry Drawer</span>
              </button>

              <span className="text-xs text-slate-400 font-mono">Netlify Ready</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

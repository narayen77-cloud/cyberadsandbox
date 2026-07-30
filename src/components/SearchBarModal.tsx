import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Tag, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { useBlog } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { ga4 } from '../utils/ga4';

export const SearchBarModal: React.FC = () => {
  const { isSearchOpen, closeSearch, posts, categories } = useBlog();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  if (!isSearchOpen) return null;

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const q = query.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesQuery =
      post.title.toLowerCase().includes(q) ||
      post.subtitle?.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
      post.author?.name.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  const handleSelectPost = (slug: string, title: string) => {
    if (query.trim()) {
      ga4.trackEvent('search_execute', { query, results_count: filteredPosts.length, selected_slug: slug });
    }
    closeSearch();
    navigate(`/article/${slug}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={closeSearch} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Top Search Bar Input */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
            <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search CyberAd articles, tags, authors, or AI topics..."
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-500 rounded border border-slate-300 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-800/40 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Filter:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 font-medium ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All ({posts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 font-medium ${
                  selectedCategory === cat.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Results List */}
          <div className="overflow-y-auto p-4 space-y-2 max-h-[50vh]">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handleSelectPost(post.slug, post.title)}
                  className="p-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group flex items-start gap-4 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {post.category}
                      </span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {post.excerpt}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 self-center" />
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-slate-400 stroke-1" />
                <p className="text-sm font-medium">No matching articles found</p>
                <p className="text-xs text-slate-400">
                  Try searching for "React", "AI", "SEO", or "Netlify"
                </p>
              </div>
            )}
          </div>

          {/* Footer Info Bar */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Real-time client search over CyberAd articles
            </span>
            <span>GA4 Event Tracked</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

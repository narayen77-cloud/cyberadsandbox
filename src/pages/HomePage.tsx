import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { BlogCard } from '../components/BlogCard';
import { setSEO } from '../utils/ga4';
import { useBlog } from '../context/ThemeContext';

export const HomePage: React.FC = () => {
  const { openSearch, categories, posts } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    setSEO(
      'Knowledge & Insights Journal',
      'In-depth articles, practical guides, research notes, and commentary across diverse topics.'
    );
  }, []);

  const publishedPosts = posts.filter((p) => p.status === 'published' || p.published !== false);

  const featuredPost = publishedPosts.find((p) => p.featured) || publishedPosts[0];

  const filteredPosts = publishedPosts.filter((post) => {
    if (selectedCategory === 'All') return true;
    return post.category === selectedCategory;
  });

  const displayPosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section - Generic & De-niched */}
      <section className="relative overflow-hidden pt-10 pb-12 rounded-3xl bg-gradient-to-b from-blue-900/10 via-slate-900/5 to-transparent border border-slate-200/60 dark:border-slate-800/80 px-6 sm:px-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Knowledge & Editorial Journal • cyberad.in</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Ideas, Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">Knowledge Sharing</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            In-depth articles, practical guides, research notes, and commentary across diverse topics, subjects, and disciplines.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={openSearch}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105"
            >
              <Search className="w-4 h-4" />
              <span>Explore Articles (⌘K)</span>
            </button>

            <Link
              to="/categories"
              className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-sm border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Browse Categories</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Article Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-6 rounded-full bg-blue-600" />
            Featured Article Spotlight
          </h2>
        </div>

        <BlogCard post={featuredPost} featuredLayout={true} />
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-6 rounded-full bg-indigo-600" />
            Browse Topics
          </h2>
          <Link
            to="/categories"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Categories ({categories.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.slice(0, 5).map((cat) => {
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color || 'from-blue-500 to-indigo-500'} flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-110 transition-transform`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-4 mt-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Explore Topic</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-blue-500" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest Articles Feed */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-6 rounded-full bg-cyan-500" />
            Latest Articles
          </h2>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredPosts.length && (
          <div className="text-center pt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              Load More Articles ({filteredPosts.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

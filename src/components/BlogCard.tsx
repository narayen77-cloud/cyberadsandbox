import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Bookmark, Heart, Eye, ArrowUpRight } from 'lucide-react';
import { BlogPost } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ga4 } from '../utils/ga4';

interface BlogCardProps {
  post: BlogPost;
  featuredLayout?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featuredLayout = false }) => {
  const { bookmarkedIds, toggleBookmark, likedIds, toggleLike } = useTheme();

  const isBookmarked = bookmarkedIds.includes(post.id);
  const isLiked = likedIds.includes(post.id);

  const categoryColorMap: Record<string, string> = {
    'Growth Marketing': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    'AI & Automation': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    'SEO & Analytics': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    'Web Engineering': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    'Content Strategy': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  };

  const badgeStyle = categoryColorMap[post.category] || 'bg-slate-500/10 text-slate-600 border-slate-500/20';

  if (featuredLayout) {
    return (
      <div className="group relative bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-7 relative overflow-hidden aspect-video lg:aspect-auto min-h-[280px]">
          <img
            src={post.coverImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${badgeStyle}`}>
              {post.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-white shadow-xs">
              ★ Featured
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>{post.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>

            <Link
              to={`/article/${post.slug}`}
              onClick={() => ga4.trackEvent('select_article', { title: post.title, category: post.category })}
              className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            >
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {post.title}
              </h2>
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <span className="text-slate-400">By</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{post.author.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleLike(post.id)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isLiked
                    ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                    : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                }`}
                title="Like story"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => toggleBookmark(post.id)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                }`}
                title="Save for later"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <Link
                to={`/article/${post.slug}`}
                onClick={() => ga4.trackEvent('select_article', { title: post.title, category: post.category })}
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors cursor-pointer shadow-xs"
                title="Read full article"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900">
          <img
            src={post.coverImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border backdrop-blur-md ${badgeStyle}`}>
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{post.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>

          <Link
            to={`/article/${post.slug}`}
            onClick={() => ga4.trackEvent('select_article', { title: post.title, category: post.category })}
            className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>By</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{post.author.name}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              onClick={() => toggleLike(post.id)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                isLiked ? 'text-rose-500' : 'hover:text-rose-500'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => toggleBookmark(post.id)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                isBookmarked ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

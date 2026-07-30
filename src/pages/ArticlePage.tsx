import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Eye, Heart, Bookmark, Share2, Twitter, Linkedin, Copy, Check, ArrowLeft, ArrowRight, BookOpen, Sparkles, User, Tag } from 'lucide-react';
import { setSEO, ga4 } from '../utils/ga4';
import { useBlog } from '../context/ThemeContext';
import { BlogCard } from '../components/BlogCard';
import { motion } from 'motion/react';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { bookmarkedIds, toggleBookmark, likedIds, toggleLike, posts, getPostBySlug } = useBlog();

  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const post = (slug ? getPostBySlug(slug) : undefined) || posts[0];
  const isBookmarked = post ? bookmarkedIds.includes(post.id) : false;
  const isLiked = post ? likedIds.includes(post.id) : false;

  const relatedPosts = posts
    .filter((p) => p.id !== post?.id && (p.category === post?.category || true))
    .slice(0, 3);

  useEffect(() => {
    if (post) {
      setSEO(post.seoTitle || post.title, post.seoDescription || post.excerpt, `/article/${post.slug}`);
      ga4.trackEvent('read_article', {
        title: post.title,
        slug: post.slug,
        category: post.category,
        author: post.author.name,
      });
    }
  }, [post, slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    ga4.trackEvent('share_article', { method: 'copy_link', slug: post.slug });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Top Scroll Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation Breadcrumbs & Back button */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            Home
          </Link>
          <span>/</span>
          <Link to={`/category/${post.category.toLowerCase().replace(/ /g, '-')}`} className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            {post.category}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px] font-semibold">
            {post.title}
          </span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Header Info */}
      <header className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {post.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <Eye className="w-3.5 h-3.5" />
            {post.views} Views
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {post.subtitle}
        </p>

        {/* Author Meta Row */}
        <div className="pt-4 border-t border-b border-slate-200 dark:border-slate-800 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
            <span className="text-slate-400">By</span>
            <span className="font-bold text-slate-900 dark:text-white">{post.author.name}</span>
            <span>•</span>
            <span className="text-slate-500 dark:text-slate-400">{post.date}</span>
          </div>

          {/* Social Share Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLike(post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                isLiked
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-300 dark:border-rose-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes + (isLiked ? 1 : 0)}</span>
            </button>

            <button
              onClick={() => toggleBookmark(post.id)}
              className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                isBookmarked
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 border-blue-300 dark:border-blue-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Save for later"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors cursor-pointer relative"
              title="Copy URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md">
        <img
          src={post.coverImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full max-h-[480px] object-cover"
        />
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>CyberAd Featured Cover • {post.category}</span>
          <span>blog.cyberad.in</span>
        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Article Body Content */}
        <main className="lg:col-span-8 space-y-8">
          {/* Key Takeaways Box */}
          <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Key Takeaway & Core Insight</span>
            </div>
            <p className="text-xs text-blue-950 dark:text-blue-100 leading-relaxed font-medium">
              {post.excerpt}
            </p>
          </div>

          {/* Render Body */}
          <article className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed space-y-6 text-sm sm:text-base">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white pt-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={idx} className="text-lg font-bold text-slate-900 dark:text-white pt-2">
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border-l-4 border-blue-600 text-slate-700 dark:text-slate-300 font-medium italic my-4">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              if (paragraph.startsWith('```')) {
                const codeContent = paragraph.replace(/```[a-z]*/g, '').trim();
                return (
                  <div key={idx} className="my-4 rounded-xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                    <pre>{codeContent}</pre>
                  </div>
                );
              }
              return (
                <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </article>

          {/* Tags List */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </main>

        {/* Sticky Table of Contents Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Table of Contents
            </h3>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <li className="hover:text-blue-600 cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Executive Overview</span>
              </li>
              <li className="hover:text-blue-600 cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Architecture & Engineering Setup</span>
              </li>
              <li className="hover:text-blue-600 cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Key Metrics & Growth Playbook</span>
              </li>
              <li className="hover:text-blue-600 cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Phase 1 Netlify Deployment</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Share Article
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                    ga4.trackEvent('share_article', { method: 'twitter', slug: post.slug });
                  }}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                    ga4.trackEvent('share_article', { method: 'linkedin', slug: post.slug });
                  }}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>

      </div>

      {/* Related Articles Section */}
      <section className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-5 rounded-full bg-blue-600" />
          Related Articles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((rel) => (
            <BlogCard key={rel.id} post={rel} />
          ))}
        </div>
      </section>
    </div>
  );
};

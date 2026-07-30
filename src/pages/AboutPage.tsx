import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, CheckCircle2, ShieldCheck, Mail, ArrowRight, Layers, Globe } from 'lucide-react';
import { samplePosts } from '../data/blogData';
import { BlogCard } from '../components/BlogCard';
import { setSEO } from '../utils/ga4';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    setSEO('About the Publication', 'Learn more about the editorial mission, standards, and content philosophy behind our knowledge journal.');
  }, []);

  const featuredPosts = samplePosts.slice(0, 3);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-5 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Editorial Standards & Mission</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            About Our Publication
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Our journal is an independent knowledge repository dedicated to delivering clear, research-driven insights, practical guides, and analytical studies across modern technology, science, strategy, and creative fields.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/categories"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Layers className="w-4 h-4" />
              <span>Explore Categories</span>
            </Link>

            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Contact Editorial Team</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Principles Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-2">
          <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400 mx-auto" />
          <span className="block text-sm font-bold text-slate-900 dark:text-white">Editorial Integrity</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Independent, objective research and analysis.</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-2">
          <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400 mx-auto" />
          <span className="block text-sm font-bold text-slate-900 dark:text-white">In-Depth Guides</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Step-by-step frameworks and detailed breakdowns.</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-2">
          <Globe className="w-7 h-7 text-cyan-600 dark:text-cyan-400 mx-auto" />
          <span className="block text-sm font-bold text-slate-900 dark:text-white">Global Topics</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Cross-disciplinary subjects suitable for any domain.</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center space-y-2">
          <Sparkles className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <span className="block text-sm font-bold text-slate-900 dark:text-white">Regular Updates</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Fresh articles published weekly with clear bylines.</span>
        </div>
      </section>

      {/* Core Philosophy & Standards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Publishing Philosophy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We prioritize depth, readability, and empirical value over superficial trends. Every published article undergoes thorough review for accuracy, clarity, and practical utility.
          </p>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Clear and structured typography for effortless long-form reading</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Minimalist bylines focused on content quality rather than self-promotion</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Fully organized and customizable category hierarchies</span>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Core Knowledge Domains
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Our topics cover a versatile range of academic, technical, and strategic verticals:
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Technology', 'Science & Research', 'Strategy & Growth', 'Design & Architecture', 'Web Engineering', 'Data & Analytics', 'Learning & Pedagogy', 'Methodologies'].map((domain) => (
              <span
                key={domain}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Publications */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Featured Publications
          </h2>
          <Link to="/" className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
};

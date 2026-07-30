import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Github, Linkedin, Twitter, Rss, Globe, Heart } from 'lucide-react';
import { ga4 } from '../utils/ga4';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    ga4.trackEvent('newsletter_subscribe', { email_domain: email.split('@')[1] });
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                C
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                cyberad<span className="text-blue-400">.in</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              In-depth guides, practical insights, and research articles covering technology, science, strategy, and creative fields.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com/cyberad_in"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/larry-c-growth"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/larry-cyberad"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="/rss.xml"
                onClick={(e) => {
                  e.preventDefault();
                  alert('RSS Feed endpoint (Phase 2 integration)');
                }}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors"
                aria-label="RSS Feed"
              >
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-slate-400 hover:text-blue-400 transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/author" className="text-slate-400 hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-blue-400 font-semibold transition-colors flex items-center gap-1">
                  <span>Publishing Admin</span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 text-[10px]">CMS</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Topics
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/category/growth-marketing" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Growth Marketing
                </Link>
              </li>
              <li>
                <Link to="/category/ai-automation" className="text-slate-400 hover:text-blue-400 transition-colors">
                  AI & Automation
                </Link>
              </li>
              <li>
                <Link to="/category/seo-analytics" className="text-slate-400 hover:text-blue-400 transition-colors">
                  SEO & Analytics
                </Link>
              </li>
              <li>
                <Link to="/category/web-engineering" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Web Engineering
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Stay Informed
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-normal">
              Join 10,000+ readers receiving our weekly knowledge digest.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your email..."
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Subscribe Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 CyberAd. All rights reserved.</span>
            <span className="text-slate-700">•</span>
            <span className="font-mono text-slate-400">blog.cyberad.in</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60 font-mono text-[11px]">
              <Globe className="w-3 h-3 text-emerald-400" />
              Netlify Production Ready
            </span>
            <span className="text-slate-600">Phase 1 Skeleton</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

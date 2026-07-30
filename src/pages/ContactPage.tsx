import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, Sparkles, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { setSEO, ga4 } from '../utils/ga4';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Consulting & Growth Strategy',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setSEO('Contact Editorial Team', 'Get in touch with our editorial team for inbound inquiries, feedback, and article pitches.');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    ga4.trackEvent('contact_form_submit', {
      subject: formData.subject,
      email_domain: formData.email.split('@')[1] || '',
    });

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const faqs = [
    {
      q: 'Can Larry C speak at our growth tech conference or podcast?',
      a: 'Yes! Larry regularly speaks on Growth Engineering, AI Ad Creative Automation, and React Web Performance. Send a details note using the contact form.',
    },
    {
      q: 'Do you accept guest author submissions on blog.cyberad.in?',
      a: 'We accept high-quality technical submissions from engineering lead practitioner writers. Pitch your outline with code samples or case study metrics.',
    },
    {
      q: 'How is blog.cyberad.in hosted and maintained in Phase 1?',
      a: 'The blog is built as a fast, responsive React + Vite application deployed on Netlify Edge CDN. Phase 1 focuses on high-performance front-end skeleton and UI interaction.',
    },
    {
      q: 'What is the expected response time?',
      a: 'Larry and the CyberAd team review messages daily and usually respond within 24 business hours.',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Get in Touch • blog.cyberad.in</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Let’s Connect
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Have questions about our Growth Engineering playbooks, guest contributions, or consulting? Drop us a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-md">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Message Sent Successfully!
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out, <strong>{formData.name}</strong>. Our editorial team will review your message and reply via <strong>{formData.email}</strong> within 24 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'Consulting & Growth Strategy', message: '' });
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Send a Direct Message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Consulting & Growth Strategy">Consulting & Growth Strategy</option>
                  <option value="Technical Web Integration">Technical Web Integration (React/Netlify)</option>
                  <option value="Guest Article Proposal">Guest Article Proposal</option>
                  <option value="Partnership & Sponsorship">Partnership & Sponsorship</option>
                  <option value="General Question">General Question</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Your Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your project, query, or proposal..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
              >
                {submitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to CyberAd</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Contact Information & Office Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6 shadow-md">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              CyberAd Contact Hub
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">Direct Email</span>
                  <a href="mailto:larry@cyberad.in" className="text-white font-bold hover:text-blue-400 transition-colors">
                    larry@cyberad.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">Response Time</span>
                  <span className="text-white font-semibold">SLA: Under 24 Business Hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">Domain & Hosting</span>
                  <span className="text-white font-semibold">blog.cyberad.in • Netlify Global Edge</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Accordion */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Frequently Asked Questions
            </h3>

            <div className="space-y-2 text-xs">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-slate-200 dark:border-slate-700/70 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-3 text-left font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                    {isOpen && (
                      <p className="p-3 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

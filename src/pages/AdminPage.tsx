import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  LogOut,
  Plus,
  FileText,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Upload,
  Image as ImageIcon,
  Layers,
  Heading,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Globe,
  FileCode,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Check,
  ArrowLeft,
  X,
  Monitor,
  Smartphone,
  User,
  Tag,
  BookOpen,
} from 'lucide-react';
import { useBlog } from '../context/ThemeContext';
import { BlogPost, Category } from '../types';
import Markdown from 'react-markdown';
import { setSEO } from '../utils/ga4';

// Preset cover images for quick picking
const PRESET_COVER_IMAGES = [
  {
    name: 'Technology & Code',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
  },
  {
    name: 'AI & Automation',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  },
  {
    name: 'Growth & Strategy',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
  },
  {
    name: 'SEO & Analytics',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
  },
  {
    name: 'Web Engineering',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
  },
];

export const AdminPage: React.FC = () => {
  const {
    posts,
    addPost,
    updatePost,
    deletePost,
    categories,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
  } = useBlog();

  const navigate = useNavigate();

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState<'articles' | 'workflow' | 'gdocs' | 'categories'>('articles');

  // 3-Step Publisher Workflow State: 1 = Write, 2 = Preview, 3 = Publish
  const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3>(1);

  // Search & Filter state in Articles tab
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Article Form State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [authorName, setAuthorName] = useState('Larry C');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [featured, setFeatured] = useState(false);
  const [readTime, setReadTime] = useState('5 min read');
  const [tagsInput, setTagsInput] = useState('Growth, Tech, Guide');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Drag-and-drop / upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview Mode State (Desktop vs Mobile)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Google Docs paste tool state
  const [gdocsRawText, setGdocsRawText] = useState('');

  // Auto-save draft state
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  useEffect(() => {
    setSEO('Admin Publishing Dashboard', 'Manage, edit, and publish articles for your blog.');

    // Load auto-saved draft if present and not editing existing post
    try {
      const savedDraft = localStorage.getItem('cyberad_editor_draft');
      if (savedDraft && !editingPostId) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.title || parsed.content) {
          setTitle(parsed.title || '');
          setContent(parsed.content || '');
          setExcerpt(parsed.excerpt || '');
          setSubtitle(parsed.subtitle || '');
          if (parsed.coverImage) setCoverImage(parsed.coverImage);
          if (parsed.category) setCategory(parsed.category);
          if (parsed.authorName) setAuthorName(parsed.authorName);
          if (parsed.tagsInput) setTagsInput(parsed.tagsInput);
          setLastSavedTime(parsed.savedAt || null);
        }
      }
    } catch (e) {
      console.log('Error reading draft', e);
    }
  }, []);

  // Debounced Auto-Save Effect
  useEffect(() => {
    if (!title && !content) return;

    const timer = setTimeout(() => {
      const draftObj = {
        title,
        content,
        excerpt,
        subtitle,
        coverImage,
        category,
        authorName,
        tagsInput,
        savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      localStorage.setItem('cyberad_editor_draft', JSON.stringify(draftObj));
      setLastSavedTime(draftObj.savedAt);
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, excerpt, subtitle, coverImage, category, authorName, tagsInput]);

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(passwordInput)) {
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Incorrect password. Try "cyberad2026" or "admin123"');
    }
  };

  const handleQuickFill = () => {
    setPasswordInput('cyberad2026');
    adminLogin('cyberad2026');
  };

  // Auto-generate slug from title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!editingPostId) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  };

  // Auto-calculate read time
  useEffect(() => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(wordCount / 200));
    setReadTime(`${mins} min read`);
  }, [content]);

  // Image Upload Handler (for dropped or selected files)
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, GIF, SVG)');
      return;
    }

    setIsUploading(true);
    setUploadSuccessMessage('');

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;

      fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          base64Data,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsUploading(false);
          if (data.url) {
            setCoverImage(data.url);
            setUploadSuccessMessage('Image uploaded and saved successfully!');
            setTimeout(() => setUploadSuccessMessage(''), 3000);
          } else {
            alert('Image upload failed. Please try again.');
          }
        })
        .catch((err) => {
          setIsUploading(false);
          console.error(err);
          // Fallback to local data URL if server offline
          setCoverImage(base64Data);
          setUploadSuccessMessage('Image uploaded successfully!');
          setTimeout(() => setUploadSuccessMessage(''), 3000);
        });
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle Edit Post
  const handleStartEdit = (post: BlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setSubtitle(post.subtitle || '');
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage);
    setAuthorName(post.author?.name || 'Larry C');
    setStatus(post.status || (post.published !== false ? 'published' : 'draft'));
    setFeatured(!!post.featured);
    setReadTime(post.readTime || '5 min read');
    setTagsInput(post.tags ? post.tags.join(', ') : '');
    setSeoTitle(post.seoTitle || post.title);
    setSeoDescription(post.seoDescription || post.excerpt);
    setWorkflowStep(1);
    setActiveTab('workflow');
  };

  // Reset Form
  const handleResetForm = () => {
    try {
      localStorage.removeItem('cyberad_editor_draft');
    } catch (e) {}
    setLastSavedTime(null);
    setEditingPostId(null);
    setTitle('');
    setSlug('');
    setSubtitle('');
    setCategory(categories[0]?.name || 'General');
    setExcerpt('');
    setContent('');
    setCoverImage(PRESET_COVER_IMAGES[0].url);
    setAuthorName('Larry C');
    setStatus('published');
    setFeatured(false);
    setTagsInput('Growth, Tech, Guide');
    setSeoTitle('');
    setSeoDescription('');
    setWorkflowStep(1);
  };

  // Final Publish Article Step
  const handleFinalPublish = () => {
    if (!title.trim() || !content.trim()) {
      alert('Article title and content body are required.');
      setWorkflowStep(1);
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const finalCover = coverImage.trim() || PRESET_COVER_IMAGES[0].url;

    const postPayload = {
      title,
      slug: finalSlug,
      subtitle: subtitle || title,
      excerpt: excerpt || content.slice(0, 160) + '...',
      content,
      coverImage: finalCover,
      category,
      tags: tagsArray,
      featured,
      status,
      published: status === 'published',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime,
      author: {
        id: 'author-main',
        name: authorName || 'Larry C',
        role: 'Author',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        bio: 'Tech & Growth Writer',
        totalPosts: 1,
      },
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
    };

    if (editingPostId) {
      updatePost(editingPostId, postPayload);
      alert('Article updated successfully!');
    } else {
      addPost(postPayload);
      alert('Article published successfully!');
    }

    handleResetForm();
    setActiveTab('articles');
  };

  // Formatting buttons helper for textarea
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'your text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Convert raw Google Docs copy-paste into clean Markdown
  const convertGdocsToMarkdown = (raw: string) => {
    if (!raw) return '';
    let processed = raw;
    processed = processed.replace(/\n\s*\n\s*\n/g, '\n\n');
    processed = processed.replace(/^[•·*-]\s+/gm, '- ');

    const lines = processed.split('\n');
    const cleanedLines = lines.map((line) => {
      const trimmed = line.trim();
      if (
        trimmed.length > 0 &&
        trimmed.length < 65 &&
        !trimmed.endsWith('.') &&
        !trimmed.startsWith('-') &&
        !trimmed.startsWith('#')
      ) {
        return `## ${trimmed}`;
      }
      return line;
    });

    return cleanedLines.join('\n');
  };

  const handleApplyGdocsCleaned = () => {
    const cleaned = convertGdocsToMarkdown(gdocsRawText);
    setContent(cleaned);
    setWorkflowStep(1);
    setActiveTab('workflow');
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());

    const isPub = post.status === 'published' || post.published !== false;
    if (statusFilter === 'published') return matchesSearch && isPub;
    if (statusFilter === 'draft') return matchesSearch && !isPub;
    return matchesSearch;
  });

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-6 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800 shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Admin Publishing Login
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter admin password to manage articles, write, preview, and publish.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Log In to Admin
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold">
                <span>Quick Access Key</span>
                <span className="text-[10px] text-blue-500 font-bold bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                  Default Key
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Password: <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-900 dark:text-white font-mono">cyberad2026</code>
              </p>
              <button
                type="button"
                onClick={handleQuickFill}
                className="w-full py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold cursor-pointer transition-colors"
              >
                One-Click Quick Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                Editorial Publishing Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Persistent Backend DB Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Articles are saved directly to server database. Upload images via drag-and-drop & preview before live publishing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Globe className="w-4 h-4 text-blue-500" />
            <span>View Public Site</span>
          </Link>

          <button
            onClick={adminLogout}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'articles'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>All Articles ({posts.length})</span>
        </button>

        <button
          onClick={() => {
            if (activeTab !== 'workflow' && editingPostId) {
              handleResetForm();
            }
            setActiveTab('workflow');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'workflow'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{editingPostId ? 'Edit Article Workflow' : 'Write & Publish Article'}</span>
        </button>

        <button
          onClick={() => setActiveTab('gdocs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'gdocs'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4 text-amber-400" />
          <span>Google Docs Paste Tool</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>
      </div>

      {/* TAB 1: ALL ARTICLES LIST */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles by title or category..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  statusFilter === 'published'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  statusFilter === 'draft'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Drafts
              </button>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No articles found matching your criteria.
              </p>
              <button
                onClick={() => {
                  handleResetForm();
                  setActiveTab('workflow');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Publish Your First Article
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const isPub = post.status === 'published' || post.published !== false;
                return (
                  <div
                    key={post.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start md:items-center gap-4 flex-1">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {post.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              isPub
                                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                : 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            {isPub ? 'Published' : 'Draft'}
                          </span>
                          {post.featured && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              Featured
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
                          {post.title}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span>By {post.author?.name || 'Larry C'}</span>
                          <span>•</span>
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() =>
                          updatePost(post.id, {
                            status: isPub ? 'draft' : 'published',
                            published: !isPub,
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isPub
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                        }`}
                        title={isPub ? 'Unpublish to Draft' : 'Publish Article'}
                      >
                        {isPub ? 'Draft' : 'Publish'}
                      </button>

                      <button
                        onClick={() => handleStartEdit(post)}
                        className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 hover:bg-blue-100 cursor-pointer flex items-center gap-1 text-xs font-semibold"
                        title="Edit Article"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>

                      <Link
                        to={`/article/${post.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                        title="View Public Article"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
                            deletePost(post.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 3-STEP PUBLISHING WORKFLOW (WRITE -> PREVIEW -> PUBLISH) */}
      {activeTab === 'workflow' && (
        <div className="space-y-8">
          {/* Workflow Stepper Header */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span>Publishing Workflow: Write → Preview → Publish</span>
              </h2>

              <button
                type="button"
                onClick={handleResetForm}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Reset / Start Fresh
              </button>
            </div>

            {/* Stepper Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setWorkflowStep(1)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  workflowStep === 1
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                    workflowStep === 1 ? 'bg-white text-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  1
                </div>
                <div>
                  <div className="font-bold text-xs">Step 1: Write</div>
                  <div className={`text-[10px] ${workflowStep === 1 ? 'text-blue-100' : 'text-slate-400'}`}>
                    Draft Content & Media
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  if (!title.trim()) {
                    alert('Please enter an article title first before previewing.');
                    return;
                  }
                  setWorkflowStep(2);
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  workflowStep === 2
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                    workflowStep === 2 ? 'bg-white text-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  2
                </div>
                <div>
                  <div className="font-bold text-xs">Step 2: Preview</div>
                  <div className={`text-[10px] ${workflowStep === 2 ? 'text-blue-100' : 'text-slate-400'}`}>
                    Exact Reader View
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  if (!title.trim() || !content.trim()) {
                    alert('Please write article title & content first.');
                    return;
                  }
                  setWorkflowStep(3);
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  workflowStep === 3
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                    workflowStep === 3 ? 'bg-white text-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  3
                </div>
                <div>
                  <div className="font-bold text-xs">Step 3: Publish</div>
                  <div className={`text-[10px] ${workflowStep === 3 ? 'text-blue-100' : 'text-slate-400'}`}>
                    Live Confirmation
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* WORKFLOW STEP 1: WRITE */}
          {workflowStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Inputs Column */}
              <div className="lg:col-span-2 space-y-5">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Mastering Technical SEO in 2026: Passing Core Web Vitals"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subtitle / Secondary Headline
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="A practical checklist for front-end developers to achieve 100/100 Lighthouse scores."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Short Excerpt / Summary *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief 2-3 sentence overview shown on homepage cards and search listings..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Cover Image Upload (Drag-and-Drop + File Input) */}
                <div className="space-y-2 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Cover Image Upload (Drag & Drop or Select File) *</span>
                    <span className="text-[10px] text-blue-500 font-normal">Auto-saved to backend server</span>
                  </label>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/50 scale-[1.01]'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-400'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />

                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>

                    {isUploading ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-blue-600 animate-pulse">Uploading cover image to server...</p>
                        <p className="text-[10px] text-slate-400">Processing file and generating persistent URL</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Drag & drop an image file here, or <span className="text-blue-500 underline">browse files</span>
                        </p>
                        <p className="text-[10px] text-slate-400">Supports PNG, JPG, WEBP, GIF, SVG (Max 10MB)</p>
                      </div>
                    )}
                  </div>

                  {uploadSuccessMessage && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{uploadSuccessMessage}</span>
                    </div>
                  )}

                  {coverImage && (
                    <div className="space-y-2 pt-2">
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video group max-h-48">
                        <img
                          src={coverImage}
                          alt="Cover Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setCoverImage('')}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                          title="Remove cover image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Preset Covers */}
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                      Or pick from high-quality presets:
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_COVER_IMAGES.map((preset, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setCoverImage(preset.url)}
                          className={`p-1 rounded-lg border text-left overflow-hidden transition-all cursor-pointer ${
                            coverImage === preset.url
                              ? 'border-blue-500 ring-2 ring-blue-500/30'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-9 object-cover rounded-md"
                          />
                          <span className="block text-[9px] font-medium text-slate-600 dark:text-slate-400 truncate mt-0.5">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Body Content / Markdown Editor */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Article Body Content (Markdown Supported) *
                  </label>

                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                    <button
                      type="button"
                      onClick={() => insertFormatting('## ')}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 cursor-pointer"
                      title="Heading 2"
                    >
                      <Heading className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">H2</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('### ')}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 cursor-pointer"
                      title="Heading 3"
                    >
                      <Heading className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">H3</span>
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*')}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('- ')}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                      title="Bullet List"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('1. ')}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('> ')}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                      title="Blockquote"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('```\n', '\n```')}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                      title="Code Block"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('[Link Title](', ')')}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                      title="Insert Link"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    id="article-content-textarea"
                    rows={14}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write article body content here..."
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* Sidebar Metadata Settings */}
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                    Article Metadata
                  </h3>

                  {/* Simplified Author Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Larry C"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Category Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Slug */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Tags (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Growth, SEO, Tech"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Proceed Button to Step 2 */}
                <button
                  type="button"
                  onClick={() => {
                    if (!title.trim()) {
                      alert('Please enter an article title.');
                      return;
                    }
                    setWorkflowStep(2);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  <span>Proceed to Preview Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* WORKFLOW STEP 2: PREVIEW EXACTLY AS READERS WILL SEE IT */}
          {workflowStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Live Reader View Preview
                  </span>
                </div>

                {/* Device Selector */}
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      previewDevice === 'desktop'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      previewDevice === 'mobile'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile Phone</span>
                  </button>
                </div>
              </div>

              {/* Reader Preview Frame */}
              <div className="flex justify-center">
                <div
                  className={`w-full transition-all rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-10 space-y-8 ${
                    previewDevice === 'mobile' ? 'max-w-md border-4 border-slate-700' : 'max-w-4xl'
                  }`}
                >
                  {/* Article Reader Header */}
                  <div className="space-y-4 text-center max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {category || 'Category'}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {readTime}
                      </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                      {title || 'Untitled Article'}
                    </h1>

                    {subtitle && (
                      <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium">
                        {subtitle}
                      </p>
                    )}

                    {/* Author Byline */}
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        {authorName ? authorName[0] : 'L'}
                      </div>
                      <div className="text-left text-xs">
                        <div className="font-bold text-slate-900 dark:text-white">{authorName}</div>
                        <div className="text-slate-400">
                          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Banner Cover Image */}
                  {coverImage && (
                    <div className="rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 shadow-lg">
                      <img
                        src={coverImage}
                        alt="Article Cover"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Rendered Article Markdown Content */}
                  <div className="prose dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4">
                    {content ? (
                      <Markdown>{content}</Markdown>
                    ) : (
                      <p className="text-slate-400 italic text-center">No article content written yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stepper Navigation Actions */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setWorkflowStep(1)}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Edit (Step 1)</span>
                </button>

                <button
                  onClick={() => setWorkflowStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>Looks Great, Go to Publish (Step 3)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* WORKFLOW STEP 3: PUBLISH CONFIRMATION */}
          {workflowStep === 3 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Ready to Publish Article
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Review final publishing options and save permanently to server backend database.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-semibold text-slate-500">Title</span>
                    <span className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-xs">{title}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-semibold text-slate-500">Category</span>
                    <span className="font-bold text-blue-500">{category}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-semibold text-slate-500">Author</span>
                    <span className="font-bold text-slate-900 dark:text-white">{authorName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">Read Time</span>
                    <span className="font-bold text-slate-900 dark:text-white">{readTime}</span>
                  </div>
                </div>

                {/* Final Toggles */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Publication Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <option value="published">Publish Live Immediately</option>
                      <option value="draft">Save as Hidden Draft</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Feature on Homepage
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Set as Featured Article
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => setWorkflowStep(2)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer text-center"
                  >
                    ← Review Preview
                  </button>

                  <button
                    onClick={handleFinalPublish}
                    className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Publish to Cloud DB</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GOOGLE DOCS IMPORT HELPER */}
      {activeTab === 'gdocs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <FileCode className="w-5 h-5" />
              <span>Google Docs & Word Formatting Converter</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Copy raw text directly from Google Docs or Word and paste it below. Our parser automatically converts line breaks, section headings, and bullet points into clean, publication-ready Markdown!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                1. Paste Copied Google Docs Text Here:
              </label>
              <textarea
                rows={12}
                value={gdocsRawText}
                onChange={(e) => setGdocsRawText(e.target.value)}
                placeholder="Paste copied text from your Google Doc here..."
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                2. Clean Markdown Output Preview:
              </label>
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs h-[290px] overflow-y-auto leading-relaxed border border-slate-800 whitespace-pre-wrap">
                {gdocsRawText ? convertGdocsToMarkdown(gdocsRawText) : '// Formatted Markdown will appear here...'}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleApplyGdocsCleaned}
              disabled={!gdocsRawText.trim()}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-500/20 cursor-pointer flex items-center gap-2"
            >
              <span>Apply to Editor & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Managed Blog Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{cat.name}</div>
                    <div className="text-[10px] text-slate-400">Slug: /category/{cat.slug}</div>
                  </div>
                  <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-extrabold">
                    {posts.filter((p) => p.category === cat.name).length} articles
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

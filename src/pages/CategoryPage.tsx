import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { setSEO } from '../utils/ga4';
import { useBlog } from '../context/ThemeContext';
import { BlogCard } from '../components/BlogCard';
import { Sparkles, ArrowLeft, Tag, Layers, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { Category } from '../types';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { categories, addCategory, updateCategory, deleteCategory, posts } = useBlog();
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Category Editor Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const currentCategory = categories.find((c) => c.slug === categorySlug);

  useEffect(() => {
    if (currentCategory) {
      setSEO(
        `${currentCategory.name} Articles`,
        currentCategory.description,
        `/category/${currentCategory.slug}`
      );
    } else {
      setSEO('All Content Categories', 'Explore all topic categories on our publication.');
    }
  }, [currentCategory, categorySlug]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (catId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(catId);
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catName,
        slug: slug,
        description: catDesc,
      });
    } else {
      addCategory({
        name: catName,
        slug: slug,
        description: catDesc || 'User created topic category.',
        iconName: 'Sparkles',
        color: 'from-blue-500 to-indigo-500',
      });
    }

    setIsModalOpen(false);
  };

  if (!categorySlug) {
    return (
      <div className="space-y-10 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
              <Layers className="w-3.5 h-3.5" />
              <span>Editable Topic Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              All Content Categories
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Browse, customize, and manage topic verticals to fit any school subject, research field, or editorial topic.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md self-start sm:self-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Category</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500/80 hover:shadow-xl transition-all group flex flex-col justify-between relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color || 'from-blue-500 to-indigo-500'} flex items-center justify-center text-white shadow-md`}>
                    <Sparkles className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleOpenEditModal(cat, e)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteCategory(cat.id, e)}
                      className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <Link to={`/category/${cat.slug}`} className="block">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h2>
                </Link>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <Link to={`/category/${cat.slug}`} className="hover:underline flex items-center gap-1">
                  <span>View Articles</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Category Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Mathematics, Literature, Physics, Strategy"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="Brief summary of what articles in this topic cover..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Category</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  const categoryPosts = posts.filter((post) => {
    if (!currentCategory) return true;
    return post.category.toLowerCase() === currentCategory.name.toLowerCase();
  });

  const allTags = Array.from(new Set(categoryPosts.flatMap((p) => p.tags)));

  const displayPosts = categoryPosts.filter((post) => {
    if (selectedTag === 'All') return true;
    return post.tags.includes(selectedTag);
  });

  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-900/10 via-slate-900/5 to-transparent border border-slate-200 dark:border-slate-800 space-y-4">
        <Link to="/categories" className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Categories</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {currentCategory ? currentCategory.name : categorySlug}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              {currentCategory ? currentCategory.description : 'Articles in this topic category.'}
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shrink-0">
            <span className="block text-2xl font-black text-blue-600 dark:text-blue-400">
              {categoryPosts.length}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Published Posts
            </span>
          </div>
        </div>

        {/* Tags filter chips */}
        {allTags.length > 0 && (
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Filter Tag:
            </span>
            <button
              onClick={() => setSelectedTag('All')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer shrink-0 ${
                selectedTag === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Showing {displayPosts.length} {displayPosts.length === 1 ? 'Article' : 'Articles'}
        </h2>

        {displayPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 space-y-3 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold">No articles found matching #{selectedTag}</p>
            <button
              onClick={() => setSelectedTag('All')}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Reset Tag Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

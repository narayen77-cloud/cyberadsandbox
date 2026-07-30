import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, Category, BlogPost } from '../types';
import { categories as defaultCategories, samplePosts as defaultPosts } from '../data/blogData';
import { ga4 } from '../utils/ga4';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  isGA4DrawerOpen: boolean;
  toggleGA4Drawer: () => void;
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;
  likedIds: string[];
  toggleLike: (id: string) => void;
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'count'>) => void;
  updateCategory: (id: string, updated: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, 'id' | 'views' | 'likes'>) => BlogPost;
  updatePost: (id: string, updated: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  isAdminLoggedIn: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cyberad_blog_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isGA4DrawerOpen, setIsGA4DrawerOpen] = useState<boolean>(false);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cyberad_admin_authed') === 'true';
    }
    return false;
  });

  const [posts, setPosts] = useState<BlogPost[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cyberad_posts');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return defaultPosts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cyberad_categories');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return defaultCategories;
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cyberad_bookmarks');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cyberad_likes');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('cyberad_blog_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    ga4.trackEvent('toggle_theme', { theme: newTheme });
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    ga4.trackEvent('open_search_modal');
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  const toggleGA4Drawer = () => {
    setIsGA4DrawerOpen((prev) => !prev);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('cyberad_bookmarks', JSON.stringify(updated));
      ga4.trackEvent(exists ? 'remove_bookmark' : 'add_bookmark', { article_id: id });
      return updated;
    });
  };

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('cyberad_likes', JSON.stringify(updated));
      ga4.trackEvent(exists ? 'unlike_article' : 'like_article', { article_id: id });
      return updated;
    });
  };

  // Fetch posts and categories from Server API on mount
  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      })
      .catch((err) => console.log('Using default posts, server fallback', err));

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch((err) => console.log('Using default categories, server fallback', err));
  }, []);

  const addCategory = (categoryData: Omit<Category, 'id' | 'count'>) => {
    const newCat: Category = {
      ...categoryData,
      id: categoryData.slug || Date.now().toString(),
      count: 0,
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((err) => console.error('Failed to sync category to server', err));
  };

  const updateCategory = (id: string, updatedData: Partial<Category>) => {
    const updated = categories.map((cat) => (cat.id === id ? { ...cat, ...updatedData } : cat));
    setCategories(updated);
    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((err) => console.error('Failed to sync categories to server', err));
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((cat) => cat.id !== id);
    setCategories(updated);
    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((err) => console.error('Failed to sync categories to server', err));
  };

  const addPost = (postData: Omit<BlogPost, 'id' | 'views' | 'likes'>): BlogPost => {
    const newPost: BlogPost = {
      ...postData,
      id: Date.now().toString(),
      views: 0,
      likes: 0,
      status: postData.status || 'published',
      published: postData.status ? postData.status === 'published' : true,
    };

    setPosts((prev) => [newPost, ...prev]);

    fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    }).catch((err) => console.error('Failed to save post to server', err));

    return newPost;
  };

  const updatePost = (id: string, updatedData: Partial<BlogPost>) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = updatedData.status ?? p.status ?? 'published';
          return {
            ...p,
            ...updatedData,
            status: newStatus,
            published: newStatus === 'published',
          };
        }
        return p;
      })
    );

    fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    }).catch((err) => console.error('Failed to update post on server', err));
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));

    fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete post from server', err));
  };

  const getPostBySlug = (slug: string): BlogPost | undefined => {
    return posts.find((p) => p.slug === slug || p.id === slug);
  };

  const adminLogin = (password: string): boolean => {
    if (password === 'cyberad2026' || password === 'admin' || password === 'admin123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('cyberad_admin_authed', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('cyberad_admin_authed');
  };

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isSearchOpen,
        openSearch,
        closeSearch,
        isGA4DrawerOpen,
        toggleGA4Drawer,
        bookmarkedIds,
        toggleBookmark,
        likedIds,
        toggleLike,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        posts,
        addPost,
        updatePost,
        deletePost,
        getPostBySlug,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useBlog = useTheme;

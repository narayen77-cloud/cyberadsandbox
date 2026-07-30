import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchBarModal } from './components/SearchBarModal';
import { GA4DebugDrawer } from './components/GA4DebugDrawer';

import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
          
          <div>
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/article/:slug" element={<ArticlePage />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                <Route path="/author" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>

          <Footer />

          {/* Interactive Modals & Drawers */}
          <SearchBarModal />
          <GA4DebugDrawer />

        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

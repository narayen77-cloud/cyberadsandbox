import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { samplePosts, categories as defaultCategories } from './src/data/blogData.js';

const currentDir = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

// Increase JSON body limit for base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data & upload directories exist
const dataDir = path.join(currentDir, 'data');
const uploadsDir = path.join(currentDir, 'public', 'uploads');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Data files paths
const postsFilePath = path.join(dataDir, 'posts.json');
const categoriesFilePath = path.join(dataDir, 'categories.json');

// Initialize posts.json if not existing
if (!fs.existsSync(postsFilePath)) {
  fs.writeFileSync(postsFilePath, JSON.stringify(samplePosts, null, 2), 'utf-8');
}

// Initialize categories.json if not existing
if (!fs.existsSync(categoriesFilePath)) {
  fs.writeFileSync(categoriesFilePath, JSON.stringify(defaultCategories, null, 2), 'utf-8');
}

// Helper functions for reading/writing JSON files
const getPosts = () => {
  try {
    const raw = fs.readFileSync(postsFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return samplePosts;
  }
};

const savePosts = (posts: any[]) => {
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf-8');
};

const getCategories = () => {
  try {
    const raw = fs.readFileSync(categoriesFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultCategories;
  }
};

const saveCategories = (categories: any[]) => {
  fs.writeFileSync(categoriesFilePath, JSON.stringify(categories, null, 2), 'utf-8');
};

// Serve uploaded image files publicly
app.use('/uploads', express.static(uploadsDir));

// ================= API ROUTES =================

// GET all posts
app.get('/api/posts', (req, res) => {
  const posts = getPosts();
  res.json(posts);
});

// CREATE a new post
app.post('/api/posts', (req, res) => {
  const newPostData = req.body;
  const posts = getPosts();

  const newPost = {
    ...newPostData,
    id: newPostData.id || Date.now().toString(),
    views: newPostData.views || 0,
    likes: newPostData.likes || 0,
    status: newPostData.status || 'published',
    published: newPostData.status ? newPostData.status === 'published' : true,
  };

  const updatedPosts = [newPost, ...posts];
  savePosts(updatedPosts);

  res.status(201).json(newPost);
});

// UPDATE an existing post
app.put('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const posts = getPosts();

  let updatedPost = null;
  const updatedPosts = posts.map((p: any) => {
    if (p.id === id || p.slug === id) {
      const newStatus = updateData.status ?? p.status ?? 'published';
      updatedPost = {
        ...p,
        ...updateData,
        status: newStatus,
        published: newStatus === 'published',
      };
      return updatedPost;
    }
    return p;
  });

  if (!updatedPost) {
    return res.status(404).json({ error: 'Post not found' });
  }

  savePosts(updatedPosts);
  res.json(updatedPost);
});

// DELETE a post
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const posts = getPosts();
  const filtered = posts.filter((p: any) => p.id !== id && p.slug !== id);

  savePosts(filtered);
  res.json({ success: true, id });
});

// GET categories
app.get('/api/categories', (req, res) => {
  const categories = getCategories();
  res.json(categories);
});

// UPDATE categories list
app.post('/api/categories', (req, res) => {
  const categoriesData = req.body;
  saveCategories(categoriesData);
  res.json(categoriesData);
});

// POST /api/upload - Handle image file uploads
app.post('/api/upload', (req, res) => {
  try {
    const { fileName, base64Data } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Extract base64 content type and buffer
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 string' });
    }

    const ext = matches[1].split('/')[1] || 'png';
    const buffer = Buffer.from(matches[2], 'base64');

    const cleanName = (fileName || 'cover')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');
    const uniqueFileName = `${Date.now()}_${cleanName}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    res.json({ success: true, url: publicUrl, fileName: uniqueFileName });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// GET /sitemap.xml - Dynamically generated XML sitemap for SEO
app.get('/sitemap.xml', (req, res) => {
  const posts = getPosts();
  const categories = getCategories();
  const baseUrl = 'https://blog.cyberad.in';

  const publishedPosts = posts.filter((p: any) => p.status === 'published' || p.published !== false);

  const urls = [
    `<url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${baseUrl}/admin</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>`,
    ...categories.map(
      (cat: any) =>
        `<url><loc>${baseUrl}/category/${encodeURIComponent(cat.slug || cat.name.toLowerCase())}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    ),
    ...publishedPosts.map(
      (post: any) =>
        `<url><loc>${baseUrl}/article/${encodeURIComponent(post.slug)}</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
  ${urls.join('\n  ')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// GET /robots.txt
app.get('/robots.txt', (req, res) => {
  const robotstxt = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://blog.cyberad.in/sitemap.xml`;
  res.header('Content-Type', 'text/plain');
  res.send(robotstxt);
});

// GET healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// ================= VITE / STATIC SERVING =================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(currentDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CyberAd Blog Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

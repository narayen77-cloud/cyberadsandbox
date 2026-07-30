import { Author, Category, BlogPost } from '../types';

const heroImg = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200';
const aiImg = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200';

export const larryAuthor: Author = {
  id: 'larry-c',
  name: 'Larry C',
  role: 'Founder & Head of Growth Architecture @ CyberAd',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  bio: 'Larry C is a Growth Technologist and Full-Stack Web Architect with 12+ years of experience building high-conversion ad engines, SEO pipelines, and scalable web platforms. He leads strategy at blog.cyberad.in.',
  twitter: 'https://x.com/cyberad_in',
  linkedin: 'https://linkedin.com/in/larry-c-growth',
  github: 'https://github.com/larry-cyberad',
  email: 'larry@cyberad.in',
  totalPosts: 14,
};

export const guestAuthor: Author = {
  id: 'sarah-j',
  name: 'Sarah Jenkins',
  role: 'Lead AI Engineer @ CyberAd Labs',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  bio: 'Specializing in LLM fine-tuning, RAG architectures, and AI-driven automated marketing agents.',
  twitter: 'https://x.com/sarah_ai',
  linkedin: 'https://linkedin.com/in/sarahjenkins-ai',
  totalPosts: 6,
};

export const categories: Category[] = [
  {
    id: 'growth-marketing',
    name: 'Growth Marketing',
    slug: 'growth-marketing',
    description: 'Data-driven customer acquisition strategies, funnel optimization, and attribution modeling.',
    iconName: 'TrendingUp',
    color: 'from-blue-500 to-cyan-500',
    count: 8,
  },
  {
    id: 'ai-automation',
    name: 'AI & Automation',
    slug: 'ai-automation',
    description: 'Leveraging AI, autonomous agents, and LLMs to automate ad creative and marketing workflows.',
    iconName: 'Zap',
    color: 'from-purple-500 to-indigo-500',
    count: 6,
  },
  {
    id: 'seo-analytics',
    name: 'SEO & Analytics',
    slug: 'seo-analytics',
    description: 'Technical SEO audits, Core Web Vitals, GA4 custom tracking, and organic ranking algorithms.',
    iconName: 'Search',
    color: 'from-emerald-500 to-teal-500',
    count: 5,
  },
  {
    id: 'web-engineering',
    name: 'Web Engineering',
    slug: 'web-engineering',
    description: 'Building blazing-fast React, Vite, Next.js, and serverless applications for maximum performance.',
    iconName: 'Code2',
    color: 'from-orange-500 to-amber-500',
    count: 7,
  },
  {
    id: 'content-strategy',
    name: 'Content Strategy',
    slug: 'content-strategy',
    description: 'Programmatic content engines, editorial authority, and brand storytelling that scales.',
    iconName: 'FileText',
    color: 'from-pink-500 to-rose-500',
    count: 4,
  },
];

export const samplePosts: BlogPost[] = [
  {
    id: '1',
    slug: 'next-gen-growth-engineering-2026',
    title: 'The 2026 Growth Stack: Combining AI Agents with Netlify Edge & React',
    subtitle: 'How modern digital agencies achieve 10x ROI by replacing static marketing funnels with dynamic AI-personalized web applications.',
    excerpt: 'Explore how combining React 19, serverless edge functions on Netlify, and real-time AI agents is redefining customer acquisition for cyberad.in.',
    coverImage: heroImg,
    author: larryAuthor,
    date: 'July 24, 2026',
    readTime: '6 min read',
    category: 'Growth Marketing',
    tags: ['Growth', 'React', 'Netlify', 'AI Agents', 'Architecture'],
    featured: true,
    views: 3420,
    likes: 248,
    seoTitle: 'The 2026 Growth Stack: AI Agents + Netlify Edge | CyberAd Blog',
    seoDescription: 'Discover how Larry C and CyberAd build ultra-fast React applications deployed on Netlify to drive enterprise digital growth.',
    content: `
### Why Traditional Marketing Funnels Are Dying

In 2026, the era of static landing pages with fixed hero headers and standard form popups is officially behind us. Modern consumers expect hyper-personalized, instant experiences that respond to their specific intent in under 100 milliseconds.

At **CyberAd**, our engineering philosophy centers around **Growth Engineering**—the intersection of high-performance frontend code, edge compute, and predictive AI analytics.

> "Growth is no longer a marketing department function; it is an engineering discipline embedded directly into your source code." — *Larry C*

---

### Key Pillars of the 2026 Architecture

1. **Edge Personalization**: Serving tailored variants using Netlify Edge Functions without layout shift (CLS = 0).
2. **Sub-Second Render Speeds**: Utilizing React 19 and Vite for instant hydration and asset caching.
3. **Automated Analytics (GA4)**: Granular event-driven tracking mapping every user interaction to attribution channels.

#### 1. Netlify Edge Function Example
\`\`\`typescript
export default async (request: Request, context: Context) => {
  const country = context.geo?.country?.code || 'US';
  const userSegment = request.headers.get('x-user-intent') || 'default';
  
  return context.next({
    headers: {
      'x-cyberad-segment': userSegment,
      'x-country-code': country,
    }
  });
};
\`\`\`

---

### Key Takeaways for CMOs & Tech Leads

* **Speed directly impacts CAC**: Every 100ms improvement in page load speed increases conversion rates by up to 8.4%.
* **Modular Skeleton Setup**: Building modular front-end skeletons on platforms like Netlify allows rapid continuous deployment without breaking legacy pipelines.
* **GA4 Custom Dimensions**: Instrument custom user engagement events early in Phase 1 to capture rich user journey signals.
`,
  },
  {
    id: '2',
    slug: 'autonomous-ai-ad-automation',
    title: 'Building Autonomous AI Ad Creative Generators with LLMs',
    subtitle: 'Step-by-step framework for using generative AI to produce 500+ ad variations and auto-tune campaign performance.',
    excerpt: 'Learn how CyberAd Labs automated ad creative generation using multi-modal LLM APIs and dynamic SVG template generation.',
    coverImage: aiImg,
    author: guestAuthor,
    date: 'July 18, 2026',
    readTime: '8 min read',
    category: 'AI & Automation',
    tags: ['AI', 'Generative AI', 'Ad Tech', 'Automation', 'Python'],
    featured: true,
    views: 2890,
    likes: 194,
    seoTitle: 'Autonomous AI Ad Creative Generators | CyberAd Blog',
    seoDescription: 'In-depth engineering guide on automating multi-platform ad visual and text variants using modern LLM APIs.',
    content: `
### The Bottleneck in Scale

When scaling paid digital ad campaigns across Meta, Google Ads, and TikTok, creative fatigue sets in rapidly—often within 72 hours of campaign launch. Human design teams simply cannot keep up with the demand for hundreds of unique aspect ratio variants, copy angles, and hook combinations.

---

### Solution: Multi-Modal Agent Pipeline

By orchestrating **Generative AI models** (like Gemini 2.5 Flash and Imagen 3), our internal tools generate ad copy, visual backgrounds, and localized CTAs dynamically.

#### Pipeline Architecture Overview

1. **Hook Discovery Engine**: Analyzes top-performing niche landing pages and generates 25 distinct psychological triggers.
2. **Asset Synthesis**: Generates crisp, brand-compliant background images with exact aspect ratios (16:9, 1:1, 9:16).
3. **Automated QA & Compliance**: Verifies text contrast ratios (WCAG AA) and checks ad policy guidelines before publishing.

> "Automation doesn't replace human creativity; it eliminates repetitive production tasks so designers can focus on core strategy."

---

### Results at CyberAd

Using this pipeline across our Q2 campaigns, we achieved:
- **68% reduction** in design production hours.
- **3.2x higher ad variant testing volume**.
- **22% lower CPA** due to continuous ad freshness.
`,
  },
  {
    id: '3',
    slug: 'mastering-technical-seo-core-web-vitals',
    title: 'Mastering Technical SEO in 2026: Passing Core Web Vitals Effortlessly',
    subtitle: 'A practical checklist for front-end developers to achieve 100/100 Lighthouse scores on React and Vite apps.',
    excerpt: 'Detailed breakdown of LCP, INP, and CLS optimizations for high-traffic content portals and modern blogs.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    author: larryAuthor,
    date: 'July 11, 2026',
    readTime: '5 min read',
    category: 'SEO & Analytics',
    tags: ['SEO', 'Performance', 'Core Web Vitals', 'INP', 'Lighthouse'],
    featured: false,
    views: 1980,
    likes: 142,
    seoTitle: 'Mastering Technical SEO & Core Web Vitals | CyberAd Blog',
    seoDescription: 'Achieve perfect 100/100 Lighthouse scores with Larry C’s complete performance optimization guide.',
    content: `
### Interaction to Next Paint (INP) is King

Since Google replaced FID with INP, interactive response speed is the single most critical UX metric for SEO ranking in competitive niches.

#### Common Bottlenecks in Modern Single-Page Apps
* Unnecessary re-renders caused by unmemoized context providers.
* Heavy main thread blocking during JavaScript bundle parsing.
* Large unoptimized image assets loaded above the fold.

---

### The CyberAd Performance Checklist

1. **Image Optimizations**:
   - Always set explicitly defined \`width\` and \`height\` attributes or aspect ratio containers to prevent CLS.
   - Use native \`loading="lazy"\` for images below the fold, and \`fetchpriority="high"\` for hero images.
   - Serve modern WebP / AVIF formats with fallback srcsets.

2. **Font Loading Strategy**:
   - Preload primary web fonts using \`<link rel="preload" as="font" crossorigin>\`.
   - Use \`font-display: swap\` to avoid invisible text flashing.

3. **Analytics Script Deferral**:
   - Load GA4 scripts asynchronously or run telemetry through edge proxies to prevent main-thread locks.
`,
  },
  {
    id: '4',
    slug: 'why-netlify-is-ideal-for-react-blogs',
    title: 'Why Netlify + Vite is the Ultimate Architecture for Modern Tech Blogs',
    subtitle: 'Comparing static site generation, edge rendering, and traditional CMS hosts for blog.cyberad.in.',
    excerpt: 'Explore why we selected Netlify, Vite, and React for Phase 1 of blog.cyberad.in, prioritizing ultra-fast TTFB and seamless global CDN distribution.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
    author: larryAuthor,
    date: 'July 04, 2026',
    readTime: '7 min read',
    category: 'Web Engineering',
    tags: ['Netlify', 'Vite', 'React', 'Hosting', 'Frontend'],
    featured: false,
    views: 2150,
    likes: 176,
    seoTitle: 'Why Netlify + Vite is Ideal for React Blogs | CyberAd Blog',
    seoDescription: 'Learn why blog.cyberad.in leverages Netlify hosting and Vite React setup for ultra-fast performance.',
    content: `
### The Infrastructure Decision

When designing **blog.cyberad.in**, we wanted an infrastructure that is:
- **Zero-maintenance**: No databases to patch, no server instances to monitor in Phase 1.
- **Global Edge Speed**: Instant sub-50ms responses globally via Netlify High-Performance Edge.
- **Developer Delight**: Git-push continuous integration with atomic deployments and preview URLs.

---

### Deployment Workflow Overview

1. **Developer commits code to GitHub repository**.
2. **Netlify auto-triggers build command** (\`npm run build\`).
3. **Static assets compiled by Vite** are distributed across 200+ global CDN points instantly.
4. **Custom domain DNS** (\`blog.cyberad.in\`) routes securely with free auto-renewing SSL certificates.

---

### Preparing for Future Phases

While Phase 1 is a clean front-end skeleton with mock data, our modular component setup allows seamless integration in future phases with:
- **Headless CMS** (Sanity or Strapi).
- **Admin Dashboard** for inline article publishing.
- **Serverless API Routes** for newsletter subscriptions and AI draft generation.
`,
  },
  {
    id: '5',
    slug: 'programmatic-content-engines',
    title: 'Scaling Content Strategy with Programmatic SEO & Editorial Workflows',
    subtitle: 'How to maintain editorial quality while publishing structured, data-driven content collections.',
    excerpt: 'Discover how CyberAd structures programmatic content models without sacrificing brand authority or human editorial standards.',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
    author: larryAuthor,
    date: 'June 28, 2026',
    readTime: '6 min read',
    category: 'Content Strategy',
    tags: ['Content Strategy', 'SEO', 'Editorial', 'Copywriting'],
    featured: false,
    views: 1640,
    likes: 112,
    seoTitle: 'Scaling Content Strategy with Programmatic SEO | CyberAd Blog',
    seoDescription: 'A practical framework for programmatic content strategy and brand voice consistency by Larry C.',
    content: `
### Quality Over Quantity in the AI Era

With AI content tools ubiquitous, search engines and readers are flooded with generic, low-effort articles. To win in 2026, content strategy must combine:
- **Original Research & First-Party Data**
- **Structured Schema Markup**
- **Distinct Authorial Voice (Larry C & CyberAd Specialists)**

---

### The 3-Tier Content Hierarchy

1. **Cornerstone Guides**: In-depth, 3,000+ word technical manifestos that earn natural backlinks.
2. **Category Playbooks**: Practical 1,000-word tactical articles with code snippets and real campaign metrics.
3. **Micro-Insights**: Quick 3-minute reads breaking down trending marketing shifts or AI model updates.
`,
  },
  {
    id: '6',
    slug: 'conversion-rate-optimization-cro-micro-interactions',
    title: 'CRO Micro-Interactions That Increased Lead Capture by 42%',
    subtitle: 'Small visual tweaks, micro-animations, and subtle feedback states that drive user conversion.',
    excerpt: 'Detailed UX study on micro-interactions, dark/light contrast choices, and responsive feedback forms.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    author: guestAuthor,
    date: 'June 21, 2026',
    readTime: '4 min read',
    category: 'Growth Marketing',
    tags: ['CRO', 'UX Design', 'Micro-Interactions', 'Conversion'],
    featured: false,
    views: 2410,
    likes: 188,
    seoTitle: 'CRO Micro-Interactions That Boost Lead Capture | CyberAd Blog',
    seoDescription: 'Discover simple UX micro-interactions that boost conversion rates on digital marketing blogs.',
    content: `
### The Power of Subtle Feedback

Micro-interactions are the silent workhorses of high-converting web applications. They acknowledge user input, reduce cognitive friction, and guide intent seamlessly.

#### High-Impact Micro-Interactions We Tested
- **Instant Search Dialogs (\`⌘K\`)**: Reducing search friction keeps readers engaged longer (Dwell time +38%).
- **Copy Code Button Toast**: Providing clear visual checkmark feedback when code blocks are copied.
- **Progressive Toast Notifications**: Submitting contact or newsletter forms with satisfying spring animations.
`,
  },
];

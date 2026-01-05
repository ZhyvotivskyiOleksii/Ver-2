'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { WebImpulsHeader } from '@/components/layout/web-impuls-header';
import { Footer } from '@/components/layout/footer';
import { ArrowRight, Calendar, Clock, Search, TrendingUp, Sparkles, Heart, Share2, Bookmark, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';

// Blog data
const getBlogPosts = (t: any) => [
  {
    id: 1,
    slug: 'why-business-needs-website',
    title: t.blogPost1Title,
    excerpt: t.blogPost1Excerpt,
    image: '/blog/1.svg',
    category: t.categoryBusiness,
    categoryKey: 'Business',
    date: '2025-01-15',
    readTime: `5 ${t.blogMinRead}`,
    featured: true,
    stats: { likes: 248, shares: 56, views: 1420 },
  },
  {
    id: 2,
    slug: 'responsive-design-importance',
    title: t.blogPost2Title,
    excerpt: t.blogPost2Excerpt,
    image: '/blog/2.svg',
    category: t.categoryDesign,
    categoryKey: 'Design',
    date: '2025-01-10',
    readTime: `4 ${t.blogMinRead}`,
    featured: false,
    stats: { likes: 186, shares: 41, views: 980 },
  },
  {
    id: 3,
    slug: 'seo-marketing-strategy',
    title: t.blogPost3Title,
    excerpt: t.blogPost3Excerpt,
    image: '/blog/3.svg',
    category: t.categorySEO,
    categoryKey: 'SEO',
    date: '2025-01-05',
    readTime: `7 ${t.blogMinRead}`,
    featured: false,
    stats: { likes: 312, shares: 89, views: 2150 },
  },
  {
    id: 4,
    slug: 'web-performance-optimization',
    title: t.blogPost4Title,
    excerpt: t.blogPost4Excerpt,
    image: '/blog/4.svg',
    category: t.categoryDevelopment,
    categoryKey: 'Development',
    date: '2024-12-28',
    readTime: `8 ${t.blogMinRead}`,
    featured: false,
    stats: { likes: 156, shares: 34, views: 760 },
  },
  {
    id: 5,
    slug: 'ecommerce-trends-2025',
    title: t.blogPost5Title,
    excerpt: t.blogPost5Excerpt,
    image: '/blog/5.svg',
    category: t.categoryEcommerce,
    categoryKey: 'E-commerce',
    date: '2024-12-20',
    readTime: `6 ${t.blogMinRead}`,
    featured: false,
    stats: { likes: 203, shares: 52, views: 1180 },
  },
  {
    id: 6,
    slug: 'ui-ux-best-practices',
    title: t.blogPost6Title,
    excerpt: t.blogPost6Excerpt,
    image: '/blog/6.svg',
    category: t.categoryDesign,
    categoryKey: 'Design',
    date: '2024-12-15',
    readTime: `5 ${t.blogMinRead}`,
    featured: false,
    stats: { likes: 178, shares: 38, views: 890 },
  },
];

const getCategories = (t: any) => [
  { key: 'All', label: t.categoryAll },
  { key: 'Business', label: t.categoryBusiness },
  { key: 'Design', label: t.categoryDesign },
  { key: 'SEO', label: t.categorySEO },
  { key: 'Development', label: t.categoryDevelopment },
  { key: 'E-commerce', label: t.categoryEcommerce },
];

export default function BlogListClient() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const params = useParams();
  const locale = params.locale as string;
  const t = (translations as any)[locale] || translations.ua;

  const blogPosts = useMemo(() => getBlogPosts(t), [t]);
  const categories = useMemo(() => getCategories(t), [t]);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.categoryKey === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => blogPosts.find(post => post.featured), [blogPosts]);
  const regularPosts = useMemo(() => filteredPosts.filter(post => !post.featured), [filteredPosts]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <WebImpulsHeader />
      
      <main className="flex-1 pt-[var(--header-height)]">
        {/* Hero Section */}
        <section className="relative pt-12 pb-8 md:pt-16 md:pb-10 overflow-hidden">

          <div className="container relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Title */}
              <div className="text-center md:text-left">
                <div
                  className="page-eyebrow mb-6 transition-all duration-300 hover:bg-primary/15"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>{t.blogTitle || 'Blog Web Impuls'}</span>
                </div>

                <h1 className="page-hero-title mb-6 md:text-left">
                  <span className="text-foreground">{t.blogHeading || 'Знання та'} </span>
                  <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                    {t.blogHeadingGradient || 'Експертиза'}
                  </span>
                </h1>

                <p className="page-hero-subtitle mb-8 md:text-left">
                  {t.blogDescription || 'Корисні статті про веб-розробку, дизайн, SEO та digital-маркетинг'}
                </p>

                {/* Search */}
                <div className="relative max-w-md mx-auto md:mx-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Input
                    type="text"
                    placeholder={t.blogSearchPlaceholder || 'Пошук статей...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 rounded-2xl 
                      bg-white/10 dark:bg-white/[0.05]
                      border border-white/15 dark:border-white/[0.1]
                      text-foreground placeholder:text-muted-foreground
                      transition-all duration-300
                      hover:bg-white/15 dark:hover:bg-white/[0.08]
                      focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Right - Floating Cards Illustration */}
              <div className="hidden md:flex justify-center items-center overflow-hidden">
                <div className="relative w-full max-w-md h-[260px]">
                  {/* Card 1 - Purple */}
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [-3, -5, -3],
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-4 left-0 w-48 h-32 rounded-2xl p-4
                      bg-gradient-to-br from-violet-500 to-purple-600
                      border border-white/20"
                  >
                    <div className="w-8 h-1.5 bg-white/40 rounded-full mb-2" />
                    <div className="w-full h-2 bg-white/60 rounded-full mb-2" />
                    <div className="w-3/4 h-2 bg-white/30 rounded-full" />
                  </motion.div>
                  
                  {/* Card 2 - Glass */}
                  <motion.div 
                    animate={{ 
                      y: [0, 8, 0],
                      rotate: [2, 4, 2],
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    className="absolute top-14 left-20 w-56 h-36 rounded-2xl p-5
                      bg-white/10 dark:bg-white/[0.08]
                      border border-white/20 dark:border-white/[0.15]"
                  >
                    <div className="w-full h-3 bg-primary/30 rounded-full mb-3" />
                    <div className="w-5/6 h-3 bg-primary/20 rounded-full mb-3" />
                    <div className="w-full h-2 bg-muted-foreground/20 rounded-full mb-2" />
                    <div className="w-full h-2 bg-muted-foreground/20 rounded-full" />
                  </motion.div>
                  
                  {/* Card 3 - Orange */}
                  <motion.div 
                    animate={{ 
                      y: [0, -6, 0],
                      rotate: [3, 1, 3],
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="absolute bottom-8 right-0 w-52 h-32 rounded-2xl p-4
                      bg-gradient-to-br from-orange-400 to-rose-500
                      border border-white/20"
                  >
                    <div className="w-10 h-2 bg-white/40 rounded-full mb-2" />
                    <div className="w-full h-2.5 bg-white/60 rounded-full mb-2" />
                    <div className="w-4/5 h-2.5 bg-white/30 rounded-full" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories - Swipeable Pills */}
        <section className="py-4 sticky top-[var(--header-height)] z-40 bg-background">
          <div className="container">
            <div
              className="flex items-center justify-start md:justify-start gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-0"
              style={{ scrollPaddingInline: '1rem' }}
            >
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap
                      transition-all duration-300 flex-shrink-0 snap-start shadow-sm
                      ${selectedCategory === category.key
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : `bg-muted text-muted-foreground border border-border/80
                           dark:bg-white/10 dark:text-white/80 dark:border-white/15
                           hover:bg-muted/80 hover:text-foreground
                           hover:text-foreground`
                      }`}
                  >
                    {category.label}
                  </button>
                ))}
            </div>
          </div>
        </section>

        {/* Featured Post - Glass Card */}
        {featuredPost && selectedCategory === 'All' && !searchQuery && (
          <section className="pt-8 pb-12">
            <div className="container">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">{t.blogRecommended || 'Рекомендоване'}</h2>
              </div>
              
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-3xl overflow-hidden
                  bg-white dark:bg-[#1e2026]
                  border border-slate-200 dark:border-white/[0.08]
                  shadow-xl shadow-slate-200/50 dark:shadow-none
                  transition-all duration-300"
              >
                <Link href={`/${locale}/blog/${featuredPost.slug}`} className="block md:grid md:grid-cols-2 gap-0">
                  {/* Image with fog fade INTO card content */}
                  <div className="relative h-64 md:h-[400px] overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
                      style={{ backgroundImage: `url(${featuredPost.image})` }}
                    />
                    {/* Stronger fog fade to right - into card content area */}
                    <div className="hidden md:block absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to right, transparent 20%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.8) 75%, rgb(255,255,255) 100%)'
                      }}
                    />
                    {/* Fog fade for mobile - bottom */}
                    <div className="md:hidden absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.9) 75%, rgb(255,255,255) 100%)'
                      }}
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/25">
                        {t.blogRecommended || 'Featured'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <span className="px-3 py-1.5 bg-primary/10 text-primary font-medium">
                        {featuredPost.category}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date.split('-').reverse().join('.')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 transition-colors duration-300 group-hover:text-primary">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 text-lg line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-6">
                      <button className="flex items-center gap-2 text-muted-foreground transition-colors duration-300 hover:text-rose-500">
                        <Heart className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
                        <span className="text-sm font-medium">{featuredPost.stats.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground transition-colors duration-300 hover:text-green-500">
                        <Share2 className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
                        <span className="text-sm font-medium">{featuredPost.stats.shares}</span>
                      </button>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye className="w-5 h-5" />
                        <span className="text-sm font-medium">{featuredPost.stats.views}</span>
                      </div>
                      <button className="ml-auto text-muted-foreground transition-colors duration-300 hover:text-primary">
                        <Bookmark className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-primary font-semibold transition-all duration-300 group-hover:gap-4">
                      {t.blogReadArticle || 'Читати статтю'}
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            </div>
          </section>
        )}

        {/* Blog Grid - Glass Cards */}
        <section className="pt-8 pb-16">
          <div className="container">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-2 text-center sm:text-left">
              <h2 className="text-2xl font-bold">
                {selectedCategory === 'All' ? (t.blogAllPosts || 'Всі статті') : selectedCategory}
              </h2>
              <span className="text-muted-foreground">
                {regularPosts.length} {regularPosts.length === 1 ? (t.blogArticle || 'стаття') : (t.blogArticles || 'статей')}
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group relative rounded-3xl overflow-hidden
                    bg-white dark:bg-[#1e2026]
                    border border-slate-200 dark:border-white/[0.08]
                    shadow-lg shadow-slate-200/50 dark:shadow-none
                    transition-all duration-300
                    hover:shadow-xl hover:shadow-slate-300/50 dark:hover:shadow-none
                    hover:-translate-y-1"
                >
                  <Link href={`/${locale}/blog/${post.slug}`} className="block cursor-pointer">
                    {/* Image with fog fade INTO card */}
                    <div className="relative h-56 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{ backgroundImage: `url(${post.image})` }}
                      />
                      {/* Fog fading into card background - dark theme */}
                      <div 
                        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                        style={{
                          background: 'linear-gradient(to bottom, transparent 0%, rgba(30,32,38,0.5) 40%, rgba(30,32,38,0.85) 70%, rgba(30,32,38,1) 100%)'
                        }}
                      />
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1.5 rounded-xl 
                          bg-black/30
                          border border-white/20
                          text-xs font-medium text-white
                          transition-all duration-300
                          group-hover:bg-primary group-hover:border-primary">
                          {post.category}
                        </span>
                      </div>

                      {/* Read more overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 z-10">
                        <span className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium flex items-center gap-2 shadow-xl">
                          {t.blogRead || 'Читати'} <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {post.date.split('-').reverse().join('.')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-primary">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 pt-4 border-t border-white/10 dark:border-white/[0.06]">
                        <button className="flex items-center gap-1.5 text-muted-foreground transition-colors duration-300 hover:text-rose-500">
                          <Heart className="w-4 h-4 transition-transform duration-300 hover:scale-110" />
                          <span className="text-xs font-medium">{post.stats.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-muted-foreground transition-colors duration-300 hover:text-green-500">
                          <Share2 className="w-4 h-4 transition-transform duration-300 hover:scale-110" />
                          <span className="text-xs font-medium">{post.stats.shares}</span>
                        </button>
                        <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs font-medium">{post.stats.views}</span>
                        </div>
                        <button className="text-muted-foreground transition-colors duration-300 hover:text-primary">
                          <Bookmark className="w-4 h-4 transition-transform duration-300 hover:scale-110" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {regularPosts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-2xl 
                  bg-white/10 dark:bg-white/[0.05]
                  border border-white/15 dark:border-white/[0.1]
                  flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.blogNotFound || 'Статей не знайдено'}</h3>
                <p className="text-muted-foreground">
                  {t.blogNotFoundDesc || 'Спробуйте змінити фільтри або пошуковий запит'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA - Glass */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="relative p-12 md:p-16 rounded-3xl overflow-hidden text-center
                bg-white/10 dark:bg-white/[0.04]
                border border-white/15 dark:border-white/[0.08]"
            >
              {/* Glow */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full pointer-events-none"
                style={{ 
                  background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                  filter: 'blur(60px)',
                }}
              />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t.blogSubscribeTitle || 'Підписуйтесь на оновлення'}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  {t.blogSubscribeDesc || 'Отримуйте найсвіжіші статті та інсайти'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder={t.blogEmailPlaceholder || 'Ваш email'}
                    className="h-14 rounded-2xl flex-1
                      bg-white/10 dark:bg-white/[0.05]
                      border border-white/15 dark:border-white/[0.1]
                      transition-all duration-300
                      focus:border-primary/50"
                  />
                  <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 transition-all duration-300">
                    {t.blogSubscribeButton || 'Підписатись'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WebImpulsHeader } from '@/components/layout/web-impuls-header';
import { Footer } from '@/components/layout/footer';
import { OrderModal } from '@/components/order-modal';
import { 
  Sparkles,
  Rocket,
  Building2,
  ShoppingCart,
  Code2,
  RefreshCw,
  Headphones,
  ArrowRight,
  Check,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { ServicesIllustration } from '@/components/floating-illustrations';

// Tech icons config - same as pricing
const techConfig: Record<string, { icon: JSX.Element; color: string; bg: string }> = {
  'Next.js': {
    icon: <svg viewBox="0 0 180 180" className="w-3.5 h-3.5"><mask id="n" height="180" maskUnits="userSpaceOnUse" width="180" x="0" y="0"><circle cx="90" cy="90" fill="#fff" r="90"/></mask><g mask="url(#n)"><circle cx="90" cy="90" fill="#000" r="90"/><path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z" fill="url(#nb)"/><path d="M115 54h12v72h-12z" fill="url(#nc)"/></g><defs><linearGradient id="nb" gradientUnits="userSpaceOnUse" x1="109" x2="144.5" y1="116.5" y2="160.5"><stop stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient><linearGradient id="nc" gradientUnits="userSpaceOnUse" x1="121" x2="120.799" y1="54" y2="106.875"><stop stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient></defs></svg>,
    color: '',
    bg: 'bg-black/5 dark:bg-white/10',
  },
  'Next.js 15': {
    icon: <svg viewBox="0 0 180 180" className="w-3.5 h-3.5"><mask id="n15" height="180" maskUnits="userSpaceOnUse" width="180" x="0" y="0"><circle cx="90" cy="90" fill="#fff" r="90"/></mask><g mask="url(#n15)"><circle cx="90" cy="90" fill="#000" r="90"/><path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z" fill="url(#n15b)"/><path d="M115 54h12v72h-12z" fill="url(#n15c)"/></g><defs><linearGradient id="n15b" gradientUnits="userSpaceOnUse" x1="109" x2="144.5" y1="116.5" y2="160.5"><stop stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient><linearGradient id="n15c" gradientUnits="userSpaceOnUse" x1="121" x2="120.799" y1="54" y2="106.875"><stop stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient></defs></svg>,
    color: '',
    bg: 'bg-black/5 dark:bg-white/10',
  },
  'Next.js Commerce': {
    icon: <svg viewBox="0 0 180 180" className="w-3.5 h-3.5"><mask id="nc2" height="180" maskUnits="userSpaceOnUse" width="180" x="0" y="0"><circle cx="90" cy="90" fill="#fff" r="90"/></mask><g mask="url(#nc2)"><circle cx="90" cy="90" fill="#000" r="90"/><path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z" fill="url(#nc2b)"/><path d="M115 54h12v72h-12z" fill="url(#nc2c)"/></g><defs><linearGradient id="nc2b" gradientUnits="userSpaceOnUse" x1="109" x2="144.5" y1="116.5" y2="160.5"><stop stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient><linearGradient id="nc2c" gradientUnits="userSpaceOnUse" x1="121" x2="120.799" y1="54" y2="106.875"><stop stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient></defs></svg>,
    color: '',
    bg: 'bg-black/5 dark:bg-white/10',
  },
  'React': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#61DAFB"><path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 1.5c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3Zm0 4c-4.418 0-8-1.79-8-4s3.582-4 8-4 8 1.79 8 4-3.582 4-8 4Z"/></svg>,
    color: 'text-[#61DAFB]',
    bg: 'bg-[#61DAFB]/10',
  },
  'React 19': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#61DAFB"><path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/></svg>,
    color: 'text-[#61DAFB]',
    bg: 'bg-[#61DAFB]/10',
  },
  'Tailwind': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#06B6D4"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>,
    color: 'text-[#06B6D4]',
    bg: 'bg-[#06B6D4]/10',
  },
  'Tailwind CSS': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#06B6D4"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>,
    color: 'text-[#06B6D4]',
    bg: 'bg-[#06B6D4]/10',
  },
  'Prisma': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#2D3748"><path d="M21.807 18.285L13.553.756a1.324 1.324 0 0 0-1.129-.754 1.31 1.31 0 0 0-1.206.626l-8.952 14.5a1.356 1.356 0 0 0 .016 1.455l4.376 6.778a1.408 1.408 0 0 0 1.58.581l12.703-3.757c.389-.115.707-.39.873-.755s.164-.783-.007-1.145zm-1.848.752L8.235 22.27a.296.296 0 0 1-.371-.127l-4.29-6.651c-.06-.093-.063-.206-.009-.3L12.26 1.666a.299.299 0 0 1 .265-.152c.107.006.203.065.256.159l8.217 17.447a.296.296 0 0 1-.039.317z"/></svg>,
    color: 'text-[#2D3748] dark:text-white',
    bg: 'bg-[#2D3748]/10 dark:bg-white/10',
  },
  'Prisma ORM': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#2D3748"><path d="M21.807 18.285L13.553.756a1.324 1.324 0 0 0-1.129-.754 1.31 1.31 0 0 0-1.206.626l-8.952 14.5a1.356 1.356 0 0 0 .016 1.455l4.376 6.778a1.408 1.408 0 0 0 1.58.581l12.703-3.757c.389-.115.707-.39.873-.755s.164-.783-.007-1.145zm-1.848.752L8.235 22.27a.296.296 0 0 1-.371-.127l-4.29-6.651c-.06-.093-.063-.206-.009-.3L12.26 1.666a.299.299 0 0 1 .265-.152c.107.006.203.065.256.159l8.217 17.447a.296.296 0 0 1-.039.317z"/></svg>,
    color: 'text-[#2D3748] dark:text-white',
    bg: 'bg-[#2D3748]/10 dark:bg-white/10',
  },
  'PostgreSQL': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#336791"><path d="M17.128 0a10.134 10.134 0 0 0-2.755.403l-.063.02A10.922 10.922 0 0 0 12.6.258C11.422.238 10.41.524 9.594 1 8.79.721 7.122.24 5.364.336 4.14.403 2.804.775 1.814 1.82.827 2.865.305 4.482.415 6.682c.03.607.203 1.597.49 2.879s.69 2.783 1.193 4.152c.503 1.37 1.054 2.6 1.915 3.436.43.419 1.022.771 1.72.742.49-.02.933-.235 1.315-.552.186.245.385.352.566.451.228.125.45.21.68.266.413.103 1.12.241 1.948.1.282-.048.579-.136.88-.27.012.33.024.653.037.98.04 1.036.067 1.993.378 2.832.05.137.187.843.727 1.466.54.624 1.598 1.013 2.803.755.85-.182 1.931-.51 2.649-1.532.71-1.01 1.03-2.459 1.093-4.809.016-.127.035-.235.055-.336l.169.015h.02c.907.041 1.891-.088 2.713-.47.728-.337 1.279-.678 1.68-1.283.1-.15.21-.331.24-.643s-.149-.728-.381-.975c-.123-.131-.279-.202-.378-.252a2.092 2.092 0 0 0-.26-.104l-.005-.001c.4-.5.79-1.049 1.078-1.628.345-.694.573-1.439.573-2.21a3.86 3.86 0 0 0-.033-.593c-.347-2.143-1.425-3.37-2.562-4.106-.57-.369-1.157-.614-1.701-.778A6.937 6.937 0 0 0 17.128 0z"/></svg>,
    color: 'text-[#336791]',
    bg: 'bg-[#336791]/10',
  },
  'Stripe': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#635BFF"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>,
    color: 'text-[#635BFF]',
    bg: 'bg-[#635BFF]/10',
  },
  'Supabase': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#3ECF8E"><path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642l-.06-7.51z"/></svg>,
    color: 'text-[#3ECF8E]',
    bg: 'bg-[#3ECF8E]/10',
  },
  'TypeScript': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#3178C6"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>,
    color: 'text-[#3178C6]',
    bg: 'bg-[#3178C6]/10',
  },
  'Framer Motion': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#0055FF"><path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/></svg>,
    color: 'text-[#0055FF]',
    bg: 'bg-[#0055FF]/10',
  },
  'tRPC': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#2596BE"><path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12Zm-10.47-6.79-6.095 3.52L12 12.25l4.565-3.52-3.035-3.52ZM6.17 9.62l-.063 6.998L10.707 13l-4.536-3.38Zm11.848.06L13.48 13l4.6 3.38-.063-6.7Zm-5.934 4.298-4.6 3.462 4.6 2.66 4.6-2.66-4.6-3.462Z"/></svg>,
    color: 'text-[#2596BE]',
    bg: 'bg-[#2596BE]/10',
  },
  'Redis': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#DC382D"><path d="M10.5 2.661l-2.666.547L5.082 1.8l2.143.281 3.275.58zm2.998.658l5.092 2.108-2.234.86-5.252-2.108 2.394-.86zm-1.093 3.153l5.461 2.29v7.556l-5.461-2.413V6.472zm1.063 9.844l5.461 2.29v-7.556l-5.461-2.413v7.679z"/></svg>,
    color: 'text-[#DC382D]',
    bg: 'bg-[#DC382D]/10',
  },
  'Figma': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#F24E1E"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.049-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019 3.019-1.355 3.019-3.019-1.354-3.019-3.019-3.019z"/></svg>,
    color: 'text-[#F24E1E]',
    bg: 'bg-[#F24E1E]/10',
  },
  'Lighthouse': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#F44B21"><path d="M12 0l4.054 6.054L24 12l-7.946 5.946L12 24l-4.054-6.054L0 12l7.946-5.946L12 0z"/></svg>,
    color: 'text-[#F44B21]',
    bg: 'bg-[#F44B21]/10',
  },
  'Vercel Analytics': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>,
    color: 'text-slate-800 dark:text-white',
    bg: 'bg-slate-100 dark:bg-white/10',
  },
  'Sentry': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#362D59"><path d="M13.91 2.505c-.873-1.448-2.972-1.448-3.845 0L6.382 8.592a8.74 8.74 0 0 1 1.985.596l3.06-5.092c.202-.321.623-.321.825 0l3.46 5.756a8.33 8.33 0 0 1 2.026-.596zm6.168 16.2a2.186 2.186 0 0 1-1.901 1.09h-3.41a6.14 6.14 0 0 0-6.13-5.887h-.205c.066.656.066 1.318 0 1.975h.206a4.16 4.16 0 0 1 4.147 3.912H7.798a.213.213 0 0 1-.181-.098.188.188 0 0 1 0-.197l1.669-2.778a6.68 6.68 0 0 0-1.969-.596l-1.256 2.09c-.873 1.448.189 3.267 1.882 3.267h10.234c1.701 0 2.755-1.82 1.882-3.267l-5.386-8.96a6.91 6.91 0 0 0-2.026.595l5.427 9.036a.188.188 0 0 1 0 .197.21.21 0 0 1-.166.098l-.009.003z"/></svg>,
    color: 'text-[#362D59]',
    bg: 'bg-[#362D59]/10',
  },
  'Uptime Robot': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#3BD671"><circle cx="12" cy="12" r="10"/></svg>,
    color: 'text-[#3BD671]',
    bg: 'bg-[#3BD671]/10',
  },
  'Google Analytics': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#E37400"><path d="M22.84 2.9982v17.9987c.0086 1.6473-1.3197 2.9897-2.967 2.9983a2.9808 2.9808 0 0 1-.4689-.0383c-1.3418-.217-2.3474-1.3669-2.3474-2.7268V2.9709C17.0552 1.3264 18.3805.002 20.025 0a2.9777 2.9777 0 0 1 2.8165 2.9982zM6.032 14.9932H5.983c-1.6445.002-2.9777 1.3352-2.9797 2.9797v.0231c-.002 1.6473 1.3305 2.9846 2.9778 2.9866.022 0 .044-.0001.066-.0004a2.9689 2.9689 0 0 0 2.9624-2.9624v-.0471c.002-1.6445-1.33-2.9778-2.9745-2.9798l-.003.0003zm5.9958-5.9971h-.049c-1.6446.002-2.9779 1.3354-2.9799 2.98v8.0213c.002 1.6446 1.3353 2.9779 2.98 2.9799h.0489c1.6446-.002 2.9779-1.3353 2.98-2.98v-8.021c-.002-1.6447-1.3354-2.9779-2.98-2.9799v-.0003z"/></svg>,
    color: 'text-[#E37400]',
    bg: 'bg-[#E37400]/10',
  },
  'Shadcn/ui': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M22.219 11.784 11.784 22.219a1.045 1.045 0 0 0 1.476 1.476L23.695 13.26a1.045 1.045 0 0 0-1.476-1.476zM20.132.305.305 20.132a1.045 1.045 0 0 0 1.476 1.476L21.608 1.781A1.045 1.045 0 0 0 20.132.305z"/></svg>,
    color: 'text-slate-800 dark:text-white',
    bg: 'bg-slate-100 dark:bg-white/10',
  },
  'Clerk Auth': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#6C47FF"><path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 15c-3.033 0-5.7-1.55-7.26-3.9.036-2.406 4.84-3.726 7.26-3.726 2.406 0 7.224 1.32 7.26 3.726C17.7 17.95 15.033 19.5 12 19.5z"/></svg>,
    color: 'text-[#6C47FF]',
    bg: 'bg-[#6C47FF]/10',
  },
  'Zustand': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#443E38"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm-2 5v4H8v2h2v4h4v-4h2v-2h-2V7h-4z"/></svg>,
    color: 'text-[#443E38] dark:text-amber-400',
    bg: 'bg-[#443E38]/10 dark:bg-amber-400/10',
  },
  'React Query': {
    icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#FF4154"><path d="M6.116 14.884c1.627 2.617 3.648 4.738 5.655 6.166a12.484 12.484 0 0 0 2.243 1.312c.788.346 1.633.567 2.446.567.778 0 1.532-.204 2.156-.68.655-.5 1.089-1.27 1.313-2.268.209-.932.246-2.04.134-3.264a19.52 19.52 0 0 0-.454-2.717 12.478 12.478 0 0 0 1.861-1.689c.572-.668.99-1.418 1.2-2.197.202-.75.212-1.55-.045-2.278-.267-.758-.773-1.392-1.442-1.899-.625-.474-1.384-.848-2.24-1.139a19.528 19.528 0 0 0-2.68-.696 12.51 12.51 0 0 0-.79-2.38c-.328-.73-.775-1.395-1.353-1.894-.558-.483-1.248-.793-2.02-.839a3.213 3.213 0 0 0-2.23.68c-.674.538-1.183 1.304-1.562 2.236a19.432 19.432 0 0 0-.888 2.616 12.503 12.503 0 0 0-2.508.571c-.788.264-1.49.621-2.068 1.089-.608.49-1.075 1.107-1.305 1.853-.24.779-.202 1.586.05 2.333.234.7.623 1.389 1.145 2.028.487.596 1.079 1.159 1.757 1.689z"/></svg>,
    color: 'text-[#FF4154]',
    bg: 'bg-[#FF4154]/10',
  },
};

function TechBadge({ name }: { name: string }) {
  const config = techConfig[name] || { 
    icon: null, 
    color: 'text-slate-600 dark:text-white/70', 
    bg: 'bg-slate-100 dark:bg-white/10' 
  };
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium',
      'border border-slate-200/50 dark:border-white/5',
      config.bg
    )}>
      {config.icon && <span className={config.color}>{config.icon}</span>}
      <span className="text-slate-700 dark:text-white/90">{name}</span>
    </span>
  );
}

const services = [
  {
    id: 'landing',
    icon: Rocket,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139, 92, 246, 0.3)',
    accent: 'text-violet-400',
    titleKey: 'serviceLandingTitle',
    subtitleKey: 'serviceLandingSubtitle',
    priceKey: 'serviceLandingPrice',
    timelineKey: 'serviceLandingTimeline',
    tech: ['Next.js 15', 'React 19', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
    features: [
      'serviceLandingFeature1',
      'serviceLandingFeature2',
      'serviceLandingFeature3',
      'serviceLandingFeature4',
      'serviceLandingFeature5',
      'serviceLandingFeature6',
    ],
  },
  {
    id: 'corporate',
    icon: Building2,
    gradient: 'from-[#6d28d9] to-[#8b5cf6]',
    glow: 'rgba(109, 40, 217, 0.3)',
    accent: 'text-[#8b5cf6]',
    titleKey: 'serviceCorporateTitle',
    subtitleKey: 'serviceCorporateSubtitle',
    priceKey: 'serviceCorporatePrice',
    timelineKey: 'serviceCorporateTimeline',
    tech: ['Next.js 15', 'Prisma ORM', 'PostgreSQL', 'Shadcn/ui', 'Clerk Auth'],
    features: [
      'serviceCorporateFeature1',
      'serviceCorporateFeature2',
      'serviceCorporateFeature3',
      'serviceCorporateFeature4',
      'serviceCorporateFeature5',
      'serviceCorporateFeature6',
    ],
    popular: true,
  },
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    gradient: 'from-[#a855f7] to-[#ec4899]',
    glow: 'rgba(236, 72, 153, 0.3)',
    accent: 'text-[#ec4899]',
    titleKey: 'serviceECommerceTitle',
    subtitleKey: 'serviceECommerceSubtitle',
    priceKey: 'serviceECommercePrice',
    timelineKey: 'serviceECommerceTimeline',
    tech: ['Next.js Commerce', 'Stripe', 'Supabase', 'Zustand', 'React Query'],
    features: [
      'serviceECommerceFeature1',
      'serviceECommerceFeature2',
      'serviceECommerceFeature3',
      'serviceECommerceFeature4',
      'serviceECommerceFeature5',
      'serviceECommerceFeature6',
    ],
  },
  {
    id: 'webapp',
    icon: Code2,
    gradient: 'from-[#7c3aed] to-[#c084fc]',
    glow: 'rgba(124, 58, 237, 0.25)',
    accent: 'text-[#c084fc]',
    titleKey: 'serviceWebAppTitle',
    subtitleKey: 'serviceWebAppSubtitle',
    priceKey: 'serviceWebAppPrice',
    timelineKey: 'serviceWebAppTimeline',
    tech: ['Next.js 15', 'tRPC', 'Prisma ORM', 'PostgreSQL', 'Redis'],
    features: [
      'serviceWebAppFeature1',
      'serviceWebAppFeature2',
      'serviceWebAppFeature3',
      'serviceWebAppFeature4',
      'serviceWebAppFeature5',
      'serviceWebAppFeature6',
    ],
  },
  {
    id: 'redesign',
    icon: RefreshCw,
    gradient: 'from-[#d946ef] to-[#f973c2]',
    glow: 'rgba(217, 70, 239, 0.25)',
    accent: 'text-[#f973c2]',
    titleKey: 'serviceRedesignTitle',
    subtitleKey: 'serviceRedesignSubtitle',
    priceKey: 'serviceRedesignPrice',
    timelineKey: 'serviceRedesignTimeline',
    tech: ['Figma', 'Tailwind CSS', 'Framer Motion', 'Lighthouse'],
    features: [
      'serviceRedesignFeature1',
      'serviceRedesignFeature2',
      'serviceRedesignFeature3',
      'serviceRedesignFeature4',
      'serviceRedesignFeature5',
      'serviceRedesignFeature6',
    ],
  },
  {
    id: 'support',
    icon: Headphones,
    gradient: 'from-[#7c3aed] to-[#a855f7]',
    glow: 'rgba(168, 85, 247, 0.25)',
    accent: 'text-[#a855f7]',
    titleKey: 'serviceSupportTitle',
    subtitleKey: 'serviceSupportSubtitle',
    priceKey: 'serviceSupportPrice',
    timelineKey: 'serviceSupportTimeline',
    tech: ['Vercel Analytics', 'Sentry', 'Uptime Robot', 'Google Analytics'],
    features: [
      'serviceSupportFeature1',
      'serviceSupportFeature2',
      'serviceSupportFeature3',
      'serviceSupportFeature4',
      'serviceSupportFeature5',
      'serviceSupportFeature6',
    ],
  },
];

export default function ServicesPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = (translations as any)[locale] || translations.ua;
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const openOrderModal = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <WebImpulsHeader />
      
      <main className="flex-1 pt-[var(--header-height)]">
        {/* Hero Section */}
        <section className="relative pt-4 pb-16 md:py-24">
          {/* Subtle gradient orbs - background only */}
          <div className="absolute inset-x-0 top-0 h-[200%] overflow-hidden pointer-events-none">
            <div 
              className="absolute top-[5%] left-[10%] w-[800px] h-[800px] rounded-full opacity-50 dark:opacity-15 blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute top-[30%] right-[5%] w-[700px] h-[700px] rounded-full opacity-45 dark:opacity-15 blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute top-[60%] left-[20%] w-[600px] h-[600px] rounded-full opacity-35 dark:opacity-10 blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, transparent 70%)' }}
            />
          </div>

          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left - Text content (first on mobile) */}
              <div className="text-center lg:text-left order-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="page-eyebrow mb-6"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>{t.services || 'Послуги'}</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="page-hero-title mb-6 uppercase"
                >
                  <span className="text-foreground">{t.servicesHeroTitle1 || 'Що ми'} </span>
                  <span className="bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent">
                    {t.servicesHeroTitle2 || 'створюємо'}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="page-hero-subtitle"
                >
                  {t.servicesHeroDesc || 'Детальний опис кожної послуги з переліком того, що входить у вартість'}
                </motion.p>
              </div>

              {/* Right - Illustration (second on mobile) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="order-2 h-48 md:h-auto"
              >
                <ServicesIllustration />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Grid - Detailed Cards */}
        <section className="py-8 md:py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
              {services.map((service, index) => {
                const Icon = service.icon;
                
                return (
                  <motion.article
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className="group relative"
                  >
                    {/* Glow on hover */}
                    <div 
                      className="absolute -inset-2 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                      style={{ background: service.glow }}
                    />
                    
                    {/* Card */}
                    <div className={cn(
                      'relative h-full rounded-2xl overflow-hidden',
                      'bg-white dark:bg-[#18191f]',
                      'border border-slate-200/80 dark:border-white/[0.06]',
                      'shadow-md hover:shadow-xl',
                      'transition-all duration-500 hover:-translate-y-1',
                      service.popular && 'border-primary/40 dark:border-primary/30'
                    )}>
                      
                      {/* Header with icon on right */}
                      <div className="relative p-4 pb-3">
                        {/* Popular badge */}
                        {service.popular && (
                          <div className="absolute top-3 left-4">
                            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-violet-500 text-white text-[10px] font-bold">
                              ⭐ {t.mostPopular || 'Популярне'}
                            </span>
                          </div>
                        )}
                        
                        <div className={cn('flex items-start justify-between gap-3', service.popular && 'pt-6')}>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg md:text-xl font-bold text-foreground mb-0.5 truncate">{t[service.titleKey]}</h3>
                            <p className="text-sm text-muted-foreground truncate">{t[service.subtitleKey]}</p>
                          </div>
                          <div className={cn(
                            'w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0',
                            'bg-gradient-to-br shadow-md',
                            service.gradient
                          )}
                            style={{ boxShadow: `0 4px 12px ${service.glow}` }}
                          >
                            <Icon className="w-5 h-5 md:w-6 md:h-6" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Price & Timeline row */}
                      <div className="px-4 py-3 bg-slate-50/50 dark:bg-white/[0.02] border-y border-slate-100 dark:border-white/[0.04]">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">{t.price || 'Вартість'}</p>
                            <p className={cn('text-lg md:text-xl font-black bg-gradient-to-r bg-clip-text text-transparent', service.gradient)}>
                              {t[service.priceKey]}
                            </p>
                          </div>
                          <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {t.timeline || 'Термін'}
                            </p>
                            <p className="text-base md:text-lg font-bold text-foreground">
                              {t[service.timelineKey]}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4 space-y-3">
                        {/* What's included */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                            {t.whatsIncluded || 'Що входить:'}
                          </p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1.5">
                            {service.features.map((featureKey, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check
                                  className={cn(
                                    'w-4 h-4 flex-shrink-0 mt-0.5',
                                    service.accent || 'text-[#c084fc]'
                                  )}
                                />
                                <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">{t[featureKey]}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Technologies */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                            {t.technologies || 'Технології:'}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {service.tech.map((tech) => (
                              <TechBadge key={tech} name={tech} />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Buttons */}
                      <div className="p-4 pt-0 flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => openOrderModal(service.id)}
                          className={cn(
                            'flex-1 h-9 rounded-full font-semibold text-sm',
                            `bg-gradient-to-r ${service.gradient} text-white hover:opacity-90 shadow-md`
                          )}
                          style={{ boxShadow: `0 4px 12px ${service.glow}` }}
                        >
                          {t.orderButton || 'Замовити'}
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 h-9 rounded-full font-semibold text-sm border hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-all"
                        >
                          <Link href={`/${locale}/services/${service.id}`}>
                            {t.readMore || 'Детальніше'}
                            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* SEO Text Block */}
        <section className="py-16 md:py-24">
          <div className="container">
            <article className="max-w-6xl mx-auto">
              <h2 className="page-section-heading text-center mb-10">
                {t.servicesSeoTitle}
              </h2>
              
              {/* Two column layout */}
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 text-base md:text-lg leading-relaxed text-muted-foreground">
                {/* Left column */}
                <div className="space-y-6">
                  <p>{t.servicesSeoText1}</p>
                  <p>{t.servicesSeoText2}</p>
                  
                  <div className="pt-4">
                    <h3 className="text-xl font-bold text-foreground mb-3">{t.servicesSeoHeading1}</h3>
                    <p>{t.servicesSeoText3}</p>
                  </div>
                </div>
                
                {/* Right column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{t.servicesSeoHeading2}</h3>
                    <p>{t.servicesSeoText4}</p>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-xl font-bold text-foreground mb-3">{t.servicesSeoHeading3}</h3>
                    <p>{t.servicesSeoText5}</p>
                  </div>
                </div>
              </div>
              
              {/* CTA block - full width */}
              <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 text-center">
                <p className="text-foreground font-medium">
                  💡 {t.servicesSeoConclusion}
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="relative p-10 md:p-16 rounded-3xl overflow-hidden text-center
                bg-gradient-to-br from-primary/10 via-violet-500/10 to-cyan-500/10
                border border-primary/20"
            >
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t.servicesCtaTitle || 'Не знаєте яку послугу обрати?'}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {t.servicesCtaDesc || 'Розкажіть про ваш проект і ми допоможемо підібрати оптимальне рішення'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="h-14 px-8 rounded-full text-lg bg-gradient-to-r from-primary to-violet-600">
                    <Link href={`/${locale}/contact`}>
                      {t.getConsultation || 'Отримати консультацію'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg border-2 hover:bg-primary hover:border-primary hover:text-white">
                    <Link href={`/${locale}/pricing`}>
                      {t.viewPricing || 'Переглянути ціни'}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        defaultService={selectedService}
        sourcePage="services"
      />
    </div>
  );
}

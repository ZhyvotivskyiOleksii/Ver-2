'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { WebImpulsHeader } from '@/components/layout/web-impuls-header';
import { Footer } from '@/components/layout/footer';
import { OrderModal } from '@/components/order-modal';
import { PanelShowcaseSection } from '@/components/sections/panel-showcase-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import {
  Rocket, Building2, ShoppingCart, RefreshCw, ArrowRight, Check, Clock, Zap,
  Shield, Smartphone, Search, BarChart3, Palette, Code2, TestTube, Star,
  ChevronRight, ChevronDown, Globe, Users, CreditCard, Package,
  TrendingUp, Target, Headphones, Settings, MessageSquare, CheckCircle2,
  Lightbulb, DollarSign, MousePointer, PieChart, Award,
} from 'lucide-react';

const serviceConfigs: Record<string, { icon: any; gradient: string; glow: string; accent: string }> = {
  landing: { icon: Rocket, gradient: 'from-violet-500 to-purple-600', glow: 'rgba(139, 92, 246, 0.5)', accent: '#8b5cf6' },
  corporate: { icon: Building2, gradient: 'from-blue-500 to-cyan-600', glow: 'rgba(6, 182, 212, 0.5)', accent: '#06b6d4' },
  ecommerce: { icon: ShoppingCart, gradient: 'from-[#7c3aed] to-[#a855f7]', glow: 'rgba(124, 58, 237, 0.45)', accent: '#a855f7' },
  redesign: { icon: RefreshCw, gradient: 'from-indigo-500 to-blue-600', glow: 'rgba(99, 102, 241, 0.5)', accent: '#6366f1' },
  webapp: { icon: Globe, gradient: 'from-emerald-500 to-teal-600', glow: 'rgba(16, 185, 129, 0.5)', accent: '#10b981' },
  support: { icon: Headphones, gradient: 'from-amber-500 to-orange-600', glow: 'rgba(245, 158, 11, 0.5)', accent: '#f59e0b' },
};

function FloatingElement({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -15, 0], rotateX: [0, 5, 0], rotateY: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function ServicePage() {
  const params = useParams();
  const locale = params.locale as string;
  const slug = params.slug as string;
  const t = (translations as any)[locale] || translations.ua;
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const benefitsRef = useRef(null);
  const processRef = useRef(null);
  const faqRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { once: true });
  const isAboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const isBenefitsInView = useInView(benefitsRef, { once: true, margin: "-100px" });
  const isProcessInView = useInView(processRef, { once: true, margin: "-100px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-100px" });

  if (!serviceConfigs[slug]) notFound();

  const config = serviceConfigs[slug];
  const Icon = config.icon;

  const getContent = () => {
    const base = {
      landing: {
        title: t.serviceLandingTitle || 'Landing Page',
        subtitle: t.serviceLandingSubtitle || 'Ефективна сторінка для конверсій',
        price: t.serviceLandingPrice || '$600 - $1,300',
        timeline: t.serviceLandingTimeline || '1-2 тижні',
        heroDesc: t.spLandingHeroDesc || 'Landing page — це односторінковий сайт для продажу товару, збору заявок або презентації послуги.',
        
        // What is it
        whatIsTitle: t.spLandingWhatIs || 'Що таке Landing Page?',
        whatIsText: t.spLandingWhatIsText || 'Landing page (лендінг) — це односторінковий сайт, створений з однією конкретною метою: перетворити відвідувача на клієнта. На відміну від звичайного сайту, лендінг не має зайвих елементів — кожен блок, кожне слово працює на одну ціль: отримати заявку, продаж або реєстрацію.',
        whatIsText2: t.spLandingWhatIsText2 || 'Це ідеальний інструмент для запуску нового продукту, рекламної кампанії, збору контактів або продажу конкретної послуги. Лендінг працює 24/7, не втомлюється і завжди говорить правильні речі правильним людям.',
        
        // Why need
        whyNeedTitle: t.spLandingWhyNeed || 'Навіщо потрібен лендінг?',
        whyNeedItems: [
          { icon: TrendingUp, title: t.spLandingWhy1 || 'Висока конверсія', desc: t.spLandingWhy1D || 'Лендінг конвертує 5-15% відвідувачів у клієнтів. Звичайний сайт — лише 1-3%. Це означає в 5 разів більше заявок з тим самим рекламним бюджетом.' },
          { icon: Target, title: t.spLandingWhy2 || 'Фокус на одній дії', desc: t.spLandingWhy2D || 'Немає відволікаючих елементів. Відвідувач або залишає заявку, або йде. Простий вибір = більше конверсій.' },
          { icon: DollarSign, title: t.spLandingWhy3 || 'Економія на рекламі', desc: t.spLandingWhy3D || 'Ви платите за клік в рекламі. Якщо лендінг конвертує краще — кожен клік приносить більше грошей. ROI зростає в рази.' },
          { icon: Zap, title: t.spLandingWhy4 || 'Швидкий запуск', desc: t.spLandingWhy4D || 'Лендінг можна запустити за 1-2 тижні. Це швидше ніж повноцінний сайт, і ви швидше почнете отримувати клієнтів.' },
        ],
        
        // For whom
        forWhomTitle: t.spLandingForWhom || 'Кому підходить лендінг?',
        forWhomItems: [
          t.spLandingForWhom1 || 'Стартапам для запуску нового продукту',
          t.spLandingForWhom2 || 'Бізнесу для реклами конкретної послуги',
          t.spLandingForWhom3 || 'Для збору заявок та контактів',
          t.spLandingForWhom4 || 'Для проведення акцій та розпродажів',
          t.spLandingForWhom5 || 'Для реєстрації на події та вебінари',
          t.spLandingForWhom6 || 'Для тестування нових ідей та ринків',
        ],
        
        // What you get
        whatYouGetTitle: t.spLandingWhatYouGet || 'Що ви отримаєте?',
        whatYouGetItems: [
          { icon: Palette, text: t.spLandingGet1 || 'Унікальний дизайн під ваш бренд' },
          { icon: Smartphone, text: t.spLandingGet2 || 'Адаптивність для всіх пристроїв' },
          { icon: Zap, text: t.spLandingGet3 || 'Швидкість завантаження < 1 сек' },
          { icon: Search, text: t.spLandingGet4 || 'SEO-оптимізація для Google' },
          { icon: BarChart3, text: t.spLandingGet5 || 'Інтеграція Google Analytics' },
          { icon: MessageSquare, text: t.spLandingGet6 || 'Форми зворотного зв\'язку' },
          { icon: Shield, text: t.spLandingGet7 || 'SSL-сертифікат (HTTPS)' },
          { icon: Headphones, text: t.spLandingGet8 || '30 днів підтримки' },
        ],
        
        process: [
          { icon: MessageSquare, title: t.processStep1Title || 'Брифінг', color: 'from-blue-500 to-cyan-500' },
          { icon: Palette, title: t.processStep2Title || 'Дизайн', color: 'from-violet-500 to-purple-500' },
          { icon: Code2, title: t.processStep3Title || 'Розробка', color: 'from-emerald-500 to-green-500' },
          { icon: TestTube, title: t.processStep4Title || 'Тестування', color: 'from-orange-500 to-amber-500' },
          { icon: Rocket, title: t.processStep5Title || 'Запуск', color: 'from-rose-500 to-pink-500' },
        ],
        faq: [
          { q: t.spLandingFaq1Q || 'Скільки часу займає розробка?', a: t.spLandingFaq1A || '7-14 днів від затвердження дизайну.' },
          { q: t.spLandingFaq2Q || 'Чи можу я редагувати текст?', a: t.spLandingFaq2A || 'За додаткову оплату підключаємо CMS.' },
          { q: t.spLandingFaq3Q || 'Чи буде швидко завантажуватись?', a: t.spLandingFaq3A || 'Гарантуємо PageSpeed 90+.' },
        ],
        stats: [
          { value: '150+', label: t.projectsCompleted || 'проектів' },
          { value: '0.5s', label: t.loadTime || 'завантаження' },
          { value: '95+', label: t.pagespeed || 'PageSpeed' },
        ],
      },
      corporate: {
        title: t.serviceCorporateTitle || 'Корпоративний сайт',
        subtitle: t.serviceCorporateSubtitle || 'Представництво бізнесу',
        price: t.serviceCorporatePrice || '$2,300 - $4,800',
        timeline: t.serviceCorporateTimeline || '3-4 тижні',
        heroDesc: t.spCorporateHeroDesc || 'Корпоративний сайт — повноцінне представництво компанії з послугами, портфоліо та блогом.',
        whatIsTitle: t.spCorporateWhatIs || 'Що таке корпоративний сайт?',
        whatIsText: t.spCorporateWhatIsText || 'Корпоративний сайт — це повноцінне представництво вашої компанії в інтернеті. Багатосторінковий ресурс з детальною інформацією про ваші послуги, команду, досягнення та контакти. Це ваша цифрова візитівка, яка працює 24/7.',
        whatIsText2: t.spCorporateWhatIsText2 || 'На відміну від лендінгу, корпоративний сайт показує повну картину вашого бізнесу. Клієнти можуть детально ознайомитись з вашими послугами, переглянути портфоліо, почитати відгуки та прийняти зважене рішення.',
        whyNeedTitle: t.spCorporateWhyNeed || 'Навіщо потрібен корпоративний сайт?',
        whyNeedItems: [
          { icon: Award, title: t.spCorporateWhy1 || 'Довіра та репутація', desc: t.spCorporateWhy1D || '81% клієнтів перевіряють компанію онлайн перед покупкою. Професійний сайт підвищує довіру та закриває сумніви.' },
          { icon: Globe, title: t.spCorporateWhy2 || 'Доступність 24/7', desc: t.spCorporateWhy2D || 'Ваш сайт працює навіть коли ви спите. Клієнти з різних часових поясів можуть знайти інформацію в будь-який час.' },
          { icon: Search, title: t.spCorporateWhy3 || 'SEO та органічний трафік', desc: t.spCorporateWhy3D || 'Багатосторінковий сайт краще індексується Google. Ви отримуєте безкоштовний трафік з пошуку.' },
          { icon: Users, title: t.spCorporateWhy4 || 'Масштабування бізнесу', desc: t.spCorporateWhy4D || 'Сайт легко розширюється: новий блог, каталог, особисті кабінети — все під ваші потреби.' },
        ],
        forWhomTitle: t.spCorporateForWhom || 'Кому підходить?',
        forWhomItems: [
          t.spCorporateForWhom1 || 'Компаніям з декількома послугами',
          t.spCorporateForWhom2 || 'Бізнесу, що працює з B2B клієнтами',
          t.spCorporateForWhom3 || 'Компаніям з командою та офісом',
          t.spCorporateForWhom4 || 'Для міжнародного бізнесу',
          t.spCorporateForWhom5 || 'Агентствам та студіям',
          t.spCorporateForWhom6 || 'Виробникам та дистриб\'юторам',
        ],
        whatYouGetTitle: t.spCorporateWhatYouGet || 'Що ви отримаєте?',
        whatYouGetItems: [
          { icon: Globe, text: t.spCorporateGet1 || 'До 15 сторінок з унікальним дизайном' },
          { icon: Settings, text: t.spCorporateGet2 || 'CMS панель для редагування' },
          { icon: MessageSquare, text: t.spCorporateGet3 || 'Блог з категоріями' },
          { icon: Users, text: t.spCorporateGet4 || 'Мультимовність (до 4 мов)' },
          { icon: Shield, text: t.spCorporateGet5 || 'SSL та захист від атак' },
          { icon: Search, text: t.spCorporateGet6 || 'SEO-оптимізація' },
          { icon: Smartphone, text: t.spCorporateGet7 || 'Адаптивний дизайн' },
          { icon: Headphones, text: t.spCorporateGet8 || '60 днів підтримки' },
        ],
        process: [
          { icon: MessageSquare, title: t.processStep1Title || 'Брифінг', color: 'from-blue-500 to-cyan-500' },
          { icon: Palette, title: t.processStep2Title || 'Дизайн', color: 'from-violet-500 to-purple-500' },
          { icon: Code2, title: t.processStep3Title || 'Розробка', color: 'from-emerald-500 to-green-500' },
          { icon: TestTube, title: t.processStep4Title || 'Тестування', color: 'from-orange-500 to-amber-500' },
          { icon: Rocket, title: t.processStep5Title || 'Запуск', color: 'from-rose-500 to-pink-500' },
        ],
        faq: [
          { q: t.spCorporateFaq1Q || 'Скільки сторінок входить?', a: t.spCorporateFaq1A || 'До 15 сторінок.' },
          { q: t.spCorporateFaq2Q || 'Чи зможу додавати статті?', a: t.spCorporateFaq2A || 'Так, через CMS.' },
          { q: t.spCorporateFaq3Q || 'Яка гарантія?', a: t.spCorporateFaq3A || '60 днів підтримки.' },
        ],
        stats: [
          { value: '15+', label: t.pages || 'сторінок' },
          { value: '4', label: t.languages || 'мови' },
          { value: '60', label: t.supportDays || 'днів' },
        ],
      },
      ecommerce: {
        title: t.serviceECommerceTitle || 'Інтернет-магазин',
        subtitle: t.serviceECommerceSubtitle || 'Онлайн-продажі 24/7',
        price: t.serviceECommercePrice || '$3,800 - $7,800',
        timeline: t.serviceECommerceTimeline || '4-8 тижнів',
        heroDesc: t.spEcommerceHeroDesc || 'Інтернет-магазин — ваш віртуальний торговий центр.',
        whatIsTitle: t.spEcommerceWhatIs || 'Що таке інтернет-магазин?',
        whatIsText: t.spEcommerceWhatIsText || 'Інтернет-магазин — це повноцінна платформа для онлайн-продажів. Ваші клієнти можуть переглядати товари, порівнювати ціни, додавати в кошик та оплачувати замовлення без участі продавця. Все автоматизовано.',
        whatIsText2: t.spEcommerceWhatIsText2 || 'Сучасний e-commerce — це не просто каталог з кнопкою "купити". Це інтеграція з платіжними системами, службами доставки, CRM, аналітика продажів та автоматичні email-розсилки.',
        whyNeedTitle: t.spEcommerceWhyNeed || 'Навіщо потрібен інтернет-магазин?',
        whyNeedItems: [
          { icon: Clock, title: t.spEcommerceWhy1 || 'Продажі 24/7', desc: t.spEcommerceWhy1D || 'Ваш магазин працює без вихідних і перерв. Клієнти купують навіть вночі та у свята.' },
          { icon: Globe, title: t.spEcommerceWhy2 || 'Географія без меж', desc: t.spEcommerceWhy2D || 'Продавайте по всій країні або всьому світу. Немає обмежень фізичного магазину.' },
          { icon: PieChart, title: t.spEcommerceWhy3 || 'Аналітика продажів', desc: t.spEcommerceWhy3D || 'Знайте точно що купують, хто купує і чому. Приймайте рішення на основі даних.' },
          { icon: TrendingUp, title: t.spEcommerceWhy4 || 'Масштабування', desc: t.spEcommerceWhy4D || 'Додавайте товари без обмежень. Ростіть без найму нових продавців.' },
        ],
        forWhomTitle: t.spEcommerceForWhom || 'Кому підходить?',
        forWhomItems: [
          t.spEcommerceForWhom1 || 'Роздрібним продавцям',
          t.spEcommerceForWhom2 || 'Виробникам товарів',
          t.spEcommerceForWhom3 || 'Дропшипінг бізнесу',
          t.spEcommerceForWhom4 || 'Оптовим компаніям',
          t.spEcommerceForWhom5 || 'Магазинам одягу та аксесуарів',
          t.spEcommerceForWhom6 || 'Продавцям цифрових товарів',
        ],
        whatYouGetTitle: t.spEcommerceWhatYouGet || 'Що ви отримаєте?',
        whatYouGetItems: [
          { icon: Package, text: t.spEcommerceGet1 || 'Каталог з фільтрами та пошуком' },
          { icon: ShoppingCart, text: t.spEcommerceGet2 || 'Кошик та checkout' },
          { icon: CreditCard, text: t.spEcommerceGet3 || 'Онлайн-оплата (Stripe, PayPal)' },
          { icon: Users, text: t.spEcommerceGet4 || 'Особистий кабінет покупця' },
          { icon: BarChart3, text: t.spEcommerceGet5 || 'Аналітика та звіти' },
          { icon: Settings, text: t.spEcommerceGet6 || 'Адмін-панель для товарів' },
          { icon: MessageSquare, text: t.spEcommerceGet7 || 'Email-сповіщення' },
          { icon: Headphones, text: t.spEcommerceGet8 || '90 днів підтримки' },
        ],
        process: [
          { icon: MessageSquare, title: t.processStep1Title || 'Брифінг', color: 'from-blue-500 to-cyan-500' },
          { icon: Palette, title: t.processStep2Title || 'Дизайн', color: 'from-violet-500 to-purple-500' },
          { icon: Code2, title: t.processStep3Title || 'Розробка', color: 'from-emerald-500 to-green-500' },
          { icon: TestTube, title: t.processStep4Title || 'Тестування', color: 'from-orange-500 to-amber-500' },
          { icon: Rocket, title: t.processStep5Title || 'Запуск', color: 'from-rose-500 to-pink-500' },
        ],
        faq: [
          { q: t.spEcommerceFaq1Q || 'Скільки товарів можна?', a: t.spEcommerceFaq1A || 'Необмежено.' },
          { q: t.spEcommerceFaq2Q || 'Які платіжні системи?', a: t.spEcommerceFaq2A || 'Stripe, PayPal та інші.' },
          { q: t.spEcommerceFaq3Q || 'Хто наповнює товари?', a: t.spEcommerceFaq3A || 'Ви через адмін-панель.' },
        ],
        stats: [
          { value: '∞', label: t.products || 'товарів' },
          { value: '24/7', label: t.sales || 'продажі' },
          { value: '90', label: t.supportDays || 'днів' },
        ],
      },
      redesign: {
        title: t.serviceRedesignTitle || 'Редизайн',
        subtitle: t.serviceRedesignSubtitle || 'Оновлення сайту',
        price: t.serviceRedesignPrice || '$1,300 - $3,800',
        timeline: t.serviceRedesignTimeline || '2-3 тижні',
        heroDesc: t.spRedesignHeroDesc || 'Редизайн — сучасний дизайн, оптимізована швидкість та нові функції.',
        whatIsTitle: t.spRedesignWhatIs || 'Що таке редизайн?',
        whatIsText: t.spRedesignWhatIsText || 'Редизайн — це повне оновлення вашого сайту: новий сучасний дизайн, оптимізована швидкість, покращений UX та нові функції. При цьому ми зберігаємо ваш контент та позиції в Google.',
        whatIsText2: t.spRedesignWhatIsText2 || 'Це не просто "перефарбування". Ми переносимо ваш сайт на сучасний технологічний стек, що забезпечує швидкість, безпеку та можливість легкого розширення в майбутньому.',
        whyNeedTitle: t.spRedesignWhyNeed || 'Навіщо потрібен редизайн?',
        whyNeedItems: [
          { icon: TrendingUp, title: t.spRedesignWhy1 || 'Застарілий вигляд', desc: t.spRedesignWhy1D || 'Сайту більше 3 років? Він виглядає застарілим і відлякує клієнтів. Перше враження вирішує все.' },
          { icon: Zap, title: t.spRedesignWhy2 || 'Повільне завантаження', desc: t.spRedesignWhy2D || 'Повільний сайт втрачає клієнтів і позиції в Google. 53% користувачів йдуть, якщо сайт завантажується більше 3 секунд.' },
          { icon: Smartphone, title: t.spRedesignWhy3 || 'Погана мобільна версія', desc: t.spRedesignWhy3D || '60% трафіку — з мобільних. Якщо сайт незручний на телефоні — ви втрачаєте більшість клієнтів.' },
          { icon: MousePointer, title: t.spRedesignWhy4 || 'Низька конверсія', desc: t.spRedesignWhy4D || 'Застарілий UX = менше заявок. Сучасний дизайн та структура збільшують конверсію на 50-200%.' },
        ],
        forWhomTitle: t.spRedesignForWhom || 'Кому підходить?',
        forWhomItems: [
          t.spRedesignForWhom1 || 'Сайтам старше 3 років',
          t.spRedesignForWhom2 || 'При низькій конверсії',
          t.spRedesignForWhom3 || 'При ребрендингу компанії',
          t.spRedesignForWhom4 || 'При повільному завантаженні',
          t.spRedesignForWhom5 || 'При поганій мобільній версії',
          t.spRedesignForWhom6 || 'При потребі нового функціоналу',
        ],
        whatYouGetTitle: t.spRedesignWhatYouGet || 'Що ви отримаєте?',
        whatYouGetItems: [
          { icon: Palette, text: t.spRedesignGet1 || 'Новий сучасний дизайн' },
          { icon: Zap, text: t.spRedesignGet2 || 'Швидкість PageSpeed 90+' },
          { icon: Smartphone, text: t.spRedesignGet3 || 'Ідеальна мобільна версія' },
          { icon: Search, text: t.spRedesignGet4 || 'SEO-міграція (редіректи)' },
          { icon: Target, text: t.spRedesignGet5 || 'Покращений UX для конверсій' },
          { icon: Code2, text: t.spRedesignGet6 || 'Сучасний технологічний стек' },
          { icon: Shield, text: t.spRedesignGet7 || 'Безпека та надійність' },
          { icon: Headphones, text: t.spRedesignGet8 || '30 днів підтримки' },
        ],
        process: [
          { icon: Search, title: t.processStep1Title || 'Аудит', color: 'from-blue-500 to-cyan-500' },
          { icon: Palette, title: t.processStep2Title || 'Дизайн', color: 'from-violet-500 to-purple-500' },
          { icon: Code2, title: t.processStep3Title || 'Розробка', color: 'from-emerald-500 to-green-500' },
          { icon: TestTube, title: t.processStep4Title || 'Тестування', color: 'from-orange-500 to-amber-500' },
          { icon: Rocket, title: t.processStep5Title || 'Запуск', color: 'from-rose-500 to-pink-500' },
        ],
        faq: [
          { q: t.spRedesignFaq1Q || 'Збережуться позиції в Google?', a: t.spRedesignFaq1A || 'Так, налаштовуємо редіректи.' },
          { q: t.spRedesignFaq2Q || 'Скільки буде недоступний сайт?', a: t.spRedesignFaq2A || 'Нуль. Розробляємо паралельно.' },
          { q: t.spRedesignFaq3Q || 'Можна зберегти функціонал?', a: t.spRedesignFaq3A || 'Так, переносимо все.' },
        ],
        stats: [
          { value: '+200%', label: t.speedIncrease || 'швидкість' },
          { value: '+150%', label: t.conversionIncrease || 'конверсія' },
          { value: '0', label: t.downtime || 'простою' },
        ],
      },
      webapp: {
        title: t.serviceWebAppTitle || 'Web-додаток',
        subtitle: t.serviceWebAppSubtitle || 'SaaS / PWA рішення',
        price: t.serviceWebAppPrice || '$7,800 - $14,800',
        timeline: t.serviceWebAppTimeline || '45-60 днів',
        heroDesc: t.spWebAppHeroDesc || 'Web-додаток — це повноцінна програма в браузері з власною логікою, базою даних та особистими кабінетами.',
        whatIsTitle: t.spWebAppWhatIs || 'Що таке web-додаток?',
        whatIsText: t.spWebAppWhatIsText || 'Web-додаток (SaaS/PWA) — це складна програма, яка працює прямо в браузері. На відміну від звичайного сайту, тут є авторизація, особисті кабінети, складна логіка, інтеграції з іншими сервісами та робота в реальному часі.',
        whatIsText2: t.spWebAppWhatIsText2 || 'Це може бути CRM-система, панель управління бізнесом, освітня платформа, сервіс бронювання або будь-який інший продукт, який вирішує конкретну проблему ваших клієнтів.',
        whyNeedTitle: t.spWebAppWhyNeed || 'Навіщо потрібен web-додаток?',
        whyNeedItems: [
          { icon: TrendingUp, title: t.spWebAppWhy1 || 'Масштабований бізнес', desc: t.spWebAppWhy1D || 'SaaS-модель дозволяє продавати підписки тисячам клієнтів. Ваш дохід зростає, а витрати залишаються фіксованими.' },
          { icon: Globe, title: t.spWebAppWhy2 || 'Доступність всюди', desc: t.spWebAppWhy2D || 'Ваші клієнти можуть працювати з будь-якого пристрою: комп\'ютер, планшет, телефон. Без встановлення додатків.' },
          { icon: Zap, title: t.spWebAppWhy3 || 'Автоматизація процесів', desc: t.spWebAppWhy3D || 'Замість ручної роботи — автоматичні розрахунки, звіти, сповіщення. Економте час і гроші.' },
          { icon: Shield, title: t.spWebAppWhy4 || 'Контроль та аналітика', desc: t.spWebAppWhy4D || 'Відстежуйте всі процеси в реальному часі. Приймайте рішення на основі даних, а не інтуїції.' },
        ],
        forWhomTitle: t.spWebAppForWhom || 'Кому підходить?',
        forWhomItems: [
          t.spWebAppForWhom1 || 'Стартапам з унікальною ідеєю',
          t.spWebAppForWhom2 || 'Бізнесу для внутрішньої автоматизації',
          t.spWebAppForWhom3 || 'Для створення SaaS-продукту',
          t.spWebAppForWhom4 || 'Освітнім платформам',
          t.spWebAppForWhom5 || 'Сервісам бронювання',
          t.spWebAppForWhom6 || 'CRM та ERP системам',
        ],
        whatYouGetTitle: t.spWebAppWhatYouGet || 'Що ви отримаєте?',
        whatYouGetItems: [
          { icon: Shield, text: t.spWebAppGet1 || 'Система авторизації (реєстрація, логін, ролі)' },
          { icon: BarChart3, text: t.spWebAppGet2 || 'Дашборд з аналітикою' },
          { icon: Settings, text: t.spWebAppGet3 || 'API для інтеграцій' },
          { icon: Zap, text: t.spWebAppGet4 || 'Оновлення в реальному часі' },
          { icon: Package, text: t.spWebAppGet5 || 'Хмарне сховище файлів' },
          { icon: MessageSquare, text: t.spWebAppGet6 || 'Push-сповіщення' },
          { icon: Smartphone, text: t.spWebAppGet7 || 'PWA для мобільних' },
          { icon: Headphones, text: t.spWebAppGet8 || '90 днів підтримки' },
        ],
        process: [
          { icon: Lightbulb, title: t.processStep1Title || 'Аналіз', color: 'from-blue-500 to-cyan-500' },
          { icon: Palette, title: t.processStep2Title || 'Дизайн', color: 'from-violet-500 to-purple-500' },
          { icon: Code2, title: t.processStep3Title || 'Розробка', color: 'from-emerald-500 to-green-500' },
          { icon: TestTube, title: t.processStep4Title || 'Тестування', color: 'from-orange-500 to-amber-500' },
          { icon: Rocket, title: t.processStep5Title || 'Запуск', color: 'from-rose-500 to-pink-500' },
        ],
        faq: [
          { q: t.spWebAppFaq1Q || 'Скільки часу займає розробка?', a: t.spWebAppFaq1A || '45-60 днів для MVP.' },
          { q: t.spWebAppFaq2Q || 'Чи можна розширювати функціонал?', a: t.spWebAppFaq2A || 'Так, архітектура дозволяє.' },
          { q: t.spWebAppFaq3Q || 'Де буде хоститись?', a: t.spWebAppFaq3A || 'Vercel, AWS або ваш сервер.' },
        ],
        stats: [
          { value: '∞', label: t.users || 'користувачів' },
          { value: 'PWA', label: t.mobileApp || 'мобільний' },
          { value: '90', label: t.supportDays || 'днів' },
        ],
      },
      support: {
        title: t.serviceSupportTitle || 'Підтримка сайту',
        subtitle: t.serviceSupportSubtitle || 'Технічне обслуговування',
        price: t.serviceSupportPrice || '$300 - $800/міс',
        timeline: t.serviceSupportTimeline || 'Відповідь до 24 год',
        heroDesc: t.spSupportHeroDesc || 'Технічна підтримка — моніторинг, оновлення, резервні копії та швидке виправлення проблем.',
        whatIsTitle: t.spSupportWhatIs || 'Що таке підтримка сайту?',
        whatIsText: t.spSupportWhatIsText || 'Підтримка сайту — це комплексне технічне обслуговування вашого онлайн-ресурсу. Ми слідкуємо за працездатністю, оновлюємо безпеку, робимо резервні копії та швидко виправляємо будь-які проблеми.',
        whatIsText2: t.spSupportWhatIsText2 || 'Сайт — це не "зробив і забув". Він потребує регулярного догляду: оновлення бібліотек, моніторинг швидкості, захист від атак. Без цього сайт швидко застаріє або зламається.',
        whyNeedTitle: t.spSupportWhyNeed || 'Навіщо потрібна підтримка?',
        whyNeedItems: [
          { icon: Shield, title: t.spSupportWhy1 || 'Безпека', desc: t.spSupportWhy1D || '90% зламаних сайтів — через застарілі бібліотеки. Регулярні оновлення захищають від хакерів.' },
          { icon: Clock, title: t.spSupportWhy2 || 'Безперервна робота', desc: t.spSupportWhy2D || 'Моніторинг 24/7 виявляє проблеми раніше, ніж їх помітять клієнти. Час простою = втрачені гроші.' },
          { icon: TrendingUp, title: t.spSupportWhy3 || 'Швидкість сайту', desc: t.spSupportWhy3D || 'Постійна оптимізація зберігає високу швидкість. Google карає повільні сайти.' },
          { icon: Headphones, title: t.spSupportWhy4 || 'Спокій для вас', desc: t.spSupportWhy4D || 'Не потрібно розумітися в технічних деталях. Ми вирішуємо всі проблеми за вас.' },
        ],
        forWhomTitle: t.spSupportForWhom || 'Кому підходить?',
        forWhomItems: [
          t.spSupportForWhom1 || 'Бізнесам без IT-відділу',
          t.spSupportForWhom2 || 'Інтернет-магазинам',
          t.spSupportForWhom3 || 'Корпоративним сайтам',
          t.spSupportForWhom4 || 'SaaS-продуктам',
          t.spSupportForWhom5 || 'Стартапам',
          t.spSupportForWhom6 || 'Агентствам та студіям',
        ],
        whatYouGetTitle: t.spSupportWhatYouGet || 'Що входить?',
        whatYouGetItems: [
          { icon: BarChart3, text: t.spSupportGet1 || 'Моніторинг 24/7' },
          { icon: RefreshCw, text: t.spSupportGet2 || 'Оновлення бібліотек' },
          { icon: Package, text: t.spSupportGet3 || 'Резервні копії щодня' },
          { icon: Zap, text: t.spSupportGet4 || 'Виправлення помилок' },
          { icon: Shield, text: t.spSupportGet5 || 'Оновлення безпеки' },
          { icon: MessageSquare, text: t.spSupportGet6 || 'Оновлення контенту' },
          { icon: Search, text: t.spSupportGet7 || 'Щомісячні звіти' },
          { icon: Headphones, text: t.spSupportGet8 || 'Підтримка в чаті' },
        ],
        process: [
          { icon: BarChart3, title: t.spSupportProcess1 || 'Моніторинг', color: 'from-blue-500 to-cyan-500' },
          { icon: Shield, title: t.spSupportProcess2 || 'Безпека', color: 'from-violet-500 to-purple-500' },
          { icon: Package, title: t.spSupportProcess3 || 'Бекапи', color: 'from-emerald-500 to-green-500' },
          { icon: Zap, title: t.spSupportProcess4 || 'Оптимізація', color: 'from-orange-500 to-amber-500' },
          { icon: MessageSquare, title: t.spSupportProcess5 || 'Звіти', color: 'from-rose-500 to-pink-500' },
        ],
        faq: [
          { q: t.spSupportFaq1Q || 'Як швидко відповідаєте?', a: t.spSupportFaq1A || 'До 24 годин, критичні — до 2 годин.' },
          { q: t.spSupportFaq2Q || 'Що якщо зламається?', a: t.spSupportFaq2A || 'Відновимо з бекапу за 1 годину.' },
          { q: t.spSupportFaq3Q || 'Можна змінювати контент?', a: t.spSupportFaq3A || 'Так, входить в пакет.' },
        ],
        stats: [
          { value: '24/7', label: t.monitoring || 'моніторинг' },
          { value: '< 2ч', label: t.criticalResponse || 'критичні' },
          { value: '99.9%', label: t.uptime || 'uptime' },
        ],
      },
    };
    return base[slug] || base.landing;
  };

  const content = getContent();

  return (
    <div ref={containerRef} className="flex min-h-screen w-full flex-col bg-background relative overflow-hidden">
      {/* Clean gradient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Simple smooth gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: `
              radial-gradient(ellipse 80% 50% at 50% 0%, ${config.accent}15, transparent),
              radial-gradient(ellipse 60% 40% at 100% 50%, ${config.accent}10, transparent),
              radial-gradient(ellipse 50% 30% at 0% 80%, ${config.accent}08, transparent)
            `
          }}
        />
      </div>

      <WebImpulsHeader />
      
      <main className="flex-1 pt-[var(--header-height)] relative z-10">
        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-[85vh] flex items-center py-16">
          <div className="container relative">
            <motion.nav
              initial={{ opacity: 0, y: 10 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-muted-foreground mb-6"
            >
              <Link href={`/${locale}`} className="hover:text-primary transition-colors">{t.home || 'Головна'}</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/${locale}/services`} className="hover:text-primary transition-colors">{t.services || 'Послуги'}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{content.title}</span>
            </motion.nav>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-white text-sm bg-gradient-to-r shadow-lg', config.gradient)}
                  style={{ boxShadow: `0 10px 40px ${config.glow}` }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold">{content.subtitle}</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4"
                >
                  <span className={cn('bg-clip-text text-transparent bg-gradient-to-r', config.gradient)}>
                    {content.title}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 }}
                  className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0"
                >
                  {content.heroDesc}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8"
                >
                  {content.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className={cn('text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r', config.gradient)}>
                        {stat.value}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-3"
                >
                  <Button
                    size="lg"
                    onClick={() => setIsOrderModalOpen(true)}
                    className={cn('h-11 px-5 rounded-xl text-sm sm:text-base font-bold bg-gradient-to-r text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all', config.gradient)}
                  >
                    {content.price}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" asChild className="h-11 px-5 rounded-xl text-sm sm:text-base font-semibold border hover:bg-foreground hover:text-background">
                    <Link href={`/${locale}/contact`}>{t.getConsultation || 'Консультація'}</Link>
                  </Button>
                </motion.div>
              </div>

              {/* Right - Icon + Browser */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="relative hidden lg:flex flex-col items-center gap-6"
              >
                {/* Icon with stats */}
                <div className="relative">
                  <div className={cn('relative w-28 h-28 rounded-3xl flex items-center justify-center bg-gradient-to-br shadow-2xl', config.gradient)}>
                    <Icon className="w-14 h-14 text-white/90" />
                    <div className="absolute -top-2 -right-2 w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="absolute -left-20 top-1/2 -translate-y-1/2 text-right">
                    <p className={cn('text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r', config.gradient)}>{content.stats?.[0]?.value || '150+'}</p>
                    <p className="text-[10px] text-muted-foreground">{content.stats?.[0]?.label || 'проектів'}</p>
                  </div>
                  <div className="absolute -right-14 top-1">
                    <p className="text-xl font-black text-amber-500">95+</p>
                    <p className="text-[10px] text-muted-foreground">PageSpeed</p>
                  </div>
                </div>

                {/* Browser mockup */}
                <div className="relative w-[380px] rounded-2xl bg-card border border-border/50 shadow-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border/30">
                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"/><div className="w-2.5 h-2.5 rounded-full bg-amber-400"/><div className="w-2.5 h-2.5 rounded-full bg-green-400"/></div>
                    <div className="flex-1 h-5 px-2 rounded bg-muted/50 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500/60"/><span className="text-[10px] text-muted-foreground">your-site.com</span></div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-gradient-to-br from-amber-400 to-amber-500"/><div className="w-10 h-1.5 rounded-full bg-foreground/20"/></div><div className="flex gap-2"><div className="w-6 h-1.5 rounded-full bg-muted"/><div className="w-6 h-1.5 rounded-full bg-muted"/></div></div>
                    <div className="h-2 rounded-full bg-foreground/30 w-2/3 mb-2"/><div className="h-1.5 rounded-full bg-muted w-full mb-1"/><div className="h-1.5 rounded-full bg-muted w-4/5 mb-3"/>
                    <div className="flex gap-2 mb-4"><div className="h-6 w-16 rounded-lg bg-gradient-to-r from-primary to-violet-500"/><div className="h-6 w-14 rounded-lg border border-border"/></div>
                    <div className="grid grid-cols-3 gap-2">{[{c:'from-amber-400 to-orange-500'},{c:'from-primary to-violet-500'},{c:'from-emerald-400 to-green-500'}].map((x,i)=>(<div key={i} className="p-2 rounded-xl bg-card border border-border/30"><div className={cn('w-5 h-5 rounded-lg mb-1.5 bg-gradient-to-br',x.c)}/><div className="h-1.5 rounded-full bg-muted w-full mb-1"/><div className="h-1 rounded-full bg-muted/50 w-2/3"/></div>))}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Panel Showcase for Support page - right after hero */}
        {slug === 'support' && (
          <PanelShowcaseSection />
        )}

        {/* What is it Section */}
        <section ref={aboutRef} className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
              >
                <h2 className={cn('text-3xl md:text-4xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r', config.gradient)}>
                  {content.whatIsTitle}
                </h2>
                <p className="text-base md:text-xl text-muted-foreground leading-relaxed mb-6">
                  {content.whatIsText}
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {content.whatIsText2}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Need Section */}
        <section ref={benefitsRef} className="py-20">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isBenefitsInView ? { opacity: 1, y: 0 } : {}}
              className="text-3xl md:text-4xl font-black mb-12 text-center"
            >
              {content.whyNeedTitle}
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {content.whyNeedItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isBenefitsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className={cn('relative h-full p-6 rounded-2xl bg-card/50 border border-border/50 hover:shadow-xl transition-all')}>
                    <div className="flex gap-5">
                      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br shadow-lg', config.gradient)}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base md:text-lg mb-2">{item.title}</h3>
                        <p className="text-base text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* For Whom + What You Get */}
        <section className="py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* For Whom */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-black mb-6">{content.forWhomTitle}</h3>
                <div className="space-y-3">
                  {content.forWhomItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-card/50 border border-border/50">
                      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br', config.gradient)}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* What You Get */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-black mb-6">{content.whatYouGetTitle}</h3>
                <div className="space-y-3">
                  {content.whatYouGetItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-card/50 border border-border/50">
                      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br', config.gradient)}>
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-base">{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section ref={processRef} className="py-20">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isProcessInView ? { opacity: 1, y: 0 } : {}}
              className="text-3xl md:text-4xl font-black mb-12 text-center"
            >
              {t.howWeWork || 'Як ми працюємо'}
            </motion.h2>

            <div className="relative max-w-4xl mx-auto">
              <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-border" />
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isProcessInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.3 }}
                className={cn('hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 origin-left bg-gradient-to-r', config.gradient)}
              />

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
                {content.process.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isProcessInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, y: -5 }}
                      className={cn('relative w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg bg-gradient-to-br', step.color)}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-primary text-primary text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                    </motion.div>
                    <p className="font-bold text-base">{step.title}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section ref={faqRef} className="py-20">
          <div className="container">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
              className="text-3xl md:text-4xl font-black mb-12 text-center"
            >
              {t.faqTitle || 'Часті питання'}
            </motion.h2>

            <div className="max-w-2xl mx-auto space-y-3">
              {content.faq.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    'rounded-2xl overflow-hidden border transition-all',
                    openFaq === i ? 'bg-card shadow-lg border-primary/30' : 'bg-card/50 border-border/50'
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <span className="font-bold text-base pr-4">{item.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all',
                        openFaq === i ? `bg-gradient-to-br ${config.gradient} text-white` : 'bg-muted'
                      )}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-base text-muted-foreground">{item.a}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA - Simple */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                {t.readyToStart || 'Готові почати?'}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg mb-8">
                {t.ctaDescService || 'Зв\'яжемося протягом 2 годин'}
              </p>
              <Button
                size="lg"
                onClick={() => setIsOrderModalOpen(true)}
                className={cn('h-12 px-8 rounded-xl text-base font-bold bg-gradient-to-r text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all', config.gradient)}
              >
                {content.price} — {t.orderButton || 'Замовити'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        defaultService={slug}
        sourcePage={`service-${slug}`}
      />
    </div>
  );
}

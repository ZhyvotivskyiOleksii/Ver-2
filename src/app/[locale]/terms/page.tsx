'use client';

import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';
import { WebImpulsHeader } from '@/components/layout/web-impuls-header';
import { Footer } from '@/components/layout/footer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale, Ban, RefreshCw, Globe, Gavel, Mail, Clock, CheckCircle } from 'lucide-react';

const sections = [
  { id: 'intro', icon: FileText, titleKey: 'termsIntro' },
  { id: 'definitions', icon: Users, titleKey: 'termsDefinitions' },
  { id: 'services', icon: CheckCircle, titleKey: 'termsServices' },
  { id: 'orders', icon: CreditCard, titleKey: 'termsOrders' },
  { id: 'payment', icon: CreditCard, titleKey: 'termsPayment' },
  { id: 'delivery', icon: Clock, titleKey: 'termsDelivery' },
  { id: 'ip', icon: Shield, titleKey: 'termsIP' },
  { id: 'warranty', icon: CheckCircle, titleKey: 'termsWarranty' },
  { id: 'liability', icon: AlertTriangle, titleKey: 'termsLiability' },
  { id: 'termination', icon: Ban, titleKey: 'termsTermination' },
  { id: 'disputes', icon: Scale, titleKey: 'termsDisputes' },
  { id: 'changes', icon: RefreshCw, titleKey: 'termsChanges' },
  { id: 'contact', icon: Mail, titleKey: 'termsContact' },
];

export default function TermsPage() {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = (translations as any)[locale] || translations.ua;
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        if (visible.length > 0) {
          const currentId = visible[0].target.getAttribute('id');
          if (currentId) {
            setActiveSection((prev) => (prev === currentId ? prev : currentId));
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <WebImpulsHeader />
      <main className="flex-1 pt-[var(--header-height)]">
        <div className="container py-12">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">
            {/* Main Content */}
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="text-3xl md:text-4xl font-black mb-4">
                  {t.termsTitle || 'Умови використання'}
                </h1>
                <p className="text-muted-foreground">
                  {t.termsLastUpdated || 'Останнє оновлення'}: 14.12.2024
                </p>
              </motion.div>

              <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
                {/* 1. Introduction */}
                <section id="intro">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                    {t.termsIntro || '1. Загальні положення'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t.termsIntroText1 || 'Ці Умови використання (далі — "Умови") регулюють відносини між Web Impuls (далі — "Виконавець", "ми", "нас") та фізичними або юридичними особами (далі — "Замовник", "ви"), які замовляють наші послуги з веб-розробки, дизайну та супутні послуги.'}
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t.termsIntroText2 || 'Розміщуючи замовлення або використовуючи наші послуги, ви підтверджуєте, що прочитали, зрозуміли та погоджуєтесь з цими Умовами. Якщо ви не згодні з будь-яким положенням, будь ласка, не користуйтесь нашими послугами.'}
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t.termsIntroText3 || 'Ці Умови є юридично обов\'язковим договором між вами та Web Impuls. Вони застосовуються до всіх послуг, що надаються нами, якщо інше не погоджено в письмовій формі.'}
                  </p>
                </section>

                {/* 2. Definitions */}
                <section id="definitions">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-primary" />
                    {t.termsDefinitions || '2. Визначення термінів'}
                  </h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>{t.termsDef1 || '"Послуги"'}</strong>: {t.termsDef1Desc || 'веб-розробка, дизайн, створення веб-сайтів, інтернет-магазинів, веб-додатків, редизайн, технічна підтримка та супутні послуги.'}</li>
                    <li><strong>{t.termsDef2 || '"Проект"'}</strong>: {t.termsDef2Desc || 'конкретне завдання або набір завдань, погоджених між Виконавцем та Замовником.'}</li>
                    <li><strong>{t.termsDef3 || '"Брифінг"'}</strong>: {t.termsDef3Desc || 'початковий етап збору вимог та побажань Замовника щодо проекту.'}</li>
                    <li><strong>{t.termsDef4 || '"Макет"'}</strong>: {t.termsDef4Desc || 'візуальне представлення дизайну веб-сайту до початку розробки.'}</li>
                    <li><strong>{t.termsDef5 || '"Правки"'}</strong>: {t.termsDef5Desc || 'зміни до погодженого дизайну або функціоналу.'}</li>
                    <li><strong>{t.termsDef6 || '"Здача проекту"'}</strong>: {t.termsDef6Desc || 'передача готового продукту Замовнику.'}</li>
                  </ul>
                </section>

                {/* 3. Services */}
                <section id="services">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    {t.termsServices || '3. Опис послуг'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.termsServicesText1 || 'Web Impuls надає такі послуги:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.termsService1 || 'Створення Landing Page (односторінкових сайтів)'}</li>
                    <li>{t.termsService2 || 'Розробка корпоративних веб-сайтів'}</li>
                    <li>{t.termsService3 || 'Створення інтернет-магазинів (e-commerce)'}</li>
                    <li>{t.termsService4 || 'Розробка веб-додатків'}</li>
                    <li>{t.termsService5 || 'Редизайн існуючих веб-сайтів'}</li>
                    <li>{t.termsService6 || 'Технічна підтримка та обслуговування'}</li>
                    <li>{t.termsService7 || 'UI/UX дизайн'}</li>
                    <li>{t.termsService8 || 'SEO-оптимізація'}</li>
                  </ul>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.termsServicesText2 || 'Конкретний обсяг послуг визначається індивідуально для кожного проекту та фіксується в комерційній пропозиції або договорі.'}
                  </p>
                </section>

                {/* 4. Orders */}
                <section id="orders">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <CreditCard className="w-6 h-6 text-primary" />
                    {t.termsOrders || '4. Оформлення замовлення'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.termsOrdersText1 || 'Процес оформлення замовлення включає такі етапи:'}
                  </p>
                  <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                    <li>{t.termsOrder1 || 'Заповнення форми замовлення на нашому веб-сайті або зв\'язок через інші канали.'}</li>
                    <li>{t.termsOrder2 || 'Проведення брифінгу для уточнення вимог та побажань.'}</li>
                    <li>{t.termsOrder3 || 'Підготовка та надсилання комерційної пропозиції з описом робіт, термінами та вартістю.'}</li>
                    <li>{t.termsOrder4 || 'Погодження умов та підписання договору (за потреби).'}</li>
                    <li>{t.termsOrder5 || 'Внесення передоплати відповідно до погоджених умов.'}</li>
                    <li>{t.termsOrder6 || 'Початок робіт над проектом.'}</li>
                  </ol>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.termsOrdersText2 || 'Замовлення вважається прийнятим після підтвердження з нашого боку та отримання передоплати.'}
                  </p>
                </section>

                {/* 5. Payment */}
                <section id="payment">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <CreditCard className="w-6 h-6 text-primary" />
                    {t.termsPayment || '5. Оплата'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.termsPaymentText1 || 'Умови оплати:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.termsPayment1 || 'Стандартна схема оплати: 50% передоплата, 50% після завершення проекту.'}</li>
                    <li>{t.termsPayment2 || 'Для великих проектів можливе поетапне оплачування.'}</li>
                    <li>{t.termsPayment3 || 'Ми приймаємо платежі через банківський переказ, Stripe, PayPal.'}</li>
                    <li>{t.termsPayment4 || 'Ціни вказуються в USD.'}</li>
                    <li>{t.termsPayment5 || 'Всі ціни не включають ПДВ, якщо не вказано інше.'}</li>
                  </ul>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.termsPaymentText2 || 'Хостинг та домен НЕ входять у вартість розробки та оплачуються Замовником окремо. Ми можемо допомогти з налаштуванням хостингу та домену за додаткову плату.'}
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.termsPaymentText3 || 'У разі затримки оплати більше ніж на 14 днів, ми залишаємо за собою право призупинити роботи до отримання оплати.'}
                  </p>
                </section>

                {/* 6. Delivery */}
                <section id="delivery">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                    {t.termsDelivery || '6. Терміни виконання'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.termsDeliveryText1 || 'Орієнтовні терміни виконання:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.termsDelivery1 || 'Landing Page: 1-2 тижні'}</li>
                    <li>{t.termsDelivery2 || 'Корпоративний сайт: 3-4 тижні'}</li>
                    <li>{t.termsDelivery3 || 'Інтернет-магазин: 4-8 тижнів'}</li>
                    <li>{t.termsDelivery4 || 'Редизайн: 2-4 тижні'}</li>
                  </ul>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.termsDeliveryText2 || 'Терміни можуть змінюватись залежно від складності проекту та своєчасності надання матеріалів Замовником. Затримка з боку Замовника (надання контенту, зворотного зв\'язку, погодження) відповідно збільшує терміни виконання.'}
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.termsDeliveryText3 || 'Ми докладаємо максимум зусиль для дотримання термінів, але не несемо відповідальності за затримки, спричинені обставинами непереборної сили.'}
                  </p>
                </section>

                {/* 7. IP Rights */}
                <section id="ip">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                    {t.termsIP || '7. Інтелектуальна власність'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.termsIPText1 || 'Розподіл прав інтелектуальної власності:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.termsIP1 || 'Після повної оплати всі права на створений дизайн та код переходять до Замовника.'}</li>
                    <li>{t.termsIP2 || 'До повної оплати всі матеріали залишаються власністю Web Impuls.'}</li>
                    <li>{t.termsIP3 || 'Ми залишаємо за собою право використовувати проект у нашому портфоліо, якщо не погоджено інше.'}</li>
                    <li>{t.termsIP4 || 'Бібліотеки та фреймворки з відкритим кодом залишаються під їхніми ліцензіями.'}</li>
                    <li>{t.termsIP5 || 'Матеріали, надані Замовником (логотипи, фото, текст), залишаються його власністю.'}</li>
                  </ul>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.termsIPText2 || 'Замовник гарантує, що має права на всі матеріали, які надає нам для використання в проекті.'}
                  </p>
                </section>

                {/* 8. Warranty */}
                <section id="warranty">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    {t.termsWarranty || '8. Гарантія та правки'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.termsWarrantyText1 || 'Умови гарантії:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.termsWarranty1 || 'Landing Page: 30 днів безкоштовної підтримки та виправлення помилок.'}</li>
                    <li>{t.termsWarranty2 || 'Корпоративний сайт: 60 днів безкоштовної підтримки.'}</li>
                    <li>{t.termsWarranty3 || 'Інтернет-магазин: 90 днів безкоштовної підтримки.'}</li>
                    <li>{t.termsWarranty4 || 'У вартість входить до 2 раундів правок на етапі дизайну.'}</li>
                    <li>{t.termsWarranty5 || 'Додаткові правки понад ліміт оплачуються за погодинною ставкою.'}</li>
                  </ul>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.termsWarrantyText2 || 'Гарантія не поширюється на: зміни, внесені Замовником або третіми особами; проблеми, спричинені хостингом; оновлення сторонніх сервісів.'}
                  </p>
                </section>

                {/* 9. Liability */}
                <section id="liability">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                    {t.termsLiability || '9. Обмеження відповідальності'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.termsLiabilityText1 || 'Обмеження нашої відповідальності:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.termsLiability1 || 'Ми не несемо відповідальності за непрямі, випадкові або непередбачувані збитки.'}</li>
                    <li>{t.termsLiability2 || 'Максимальна відповідальність обмежується сумою, сплаченою за проект.'}</li>
                    <li>{t.termsLiability3 || 'Ми не гарантуємо конкретних бізнес-результатів (продажі, конверсії, рейтинги).'}</li>
                    <li>{t.termsLiability4 || 'Ми не відповідаємо за збої хостингу, домену або сторонніх сервісів.'}</li>
                    <li>{t.termsLiability5 || 'Замовник несе відповідальність за контент, розміщений на сайті.'}</li>
                  </ul>
                  <p className="text-base text-muted-foreground leading-relaxed mt-4">
                    {t.termsLiabilityText2 || 'Ці обмеження застосовуються в максимальному обсязі, дозволеному законодавством.'}
                  </p>
                </section>

                {/* 10. Termination */}
                <section id="termination">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Ban className="w-6 h-6 text-primary" />
                    {t.termsTermination || '10. Розірвання договору'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.termsTerminationText1 || 'Умови розірвання:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.termsTermination1 || 'Замовник може розірвати договір у будь-який момент з письмовим повідомленням.'}</li>
                    <li>{t.termsTermination2 || 'При розірванні Замовник оплачує вже виконану роботу.'}</li>
                    <li>{t.termsTermination3 || 'Передоплата не повертається, якщо роботи вже розпочаті.'}</li>
                    <li>{t.termsTermination4 || 'Ми можемо розірвати договір при порушенні Замовником умов оплати або співпраці.'}</li>
                    <li>{t.termsTermination5 || 'При відсутності зв\'язку з Замовником понад 30 днів проект вважається завершеним.'}</li>
                  </ul>
                </section>

                {/* 11. Disputes */}
                <section id="disputes">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Scale className="w-6 h-6 text-primary" />
                    {t.termsDisputes || '11. Вирішення спорів'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.termsDisputesText1 || 'Порядок вирішення спорів:'}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t.termsDisputes1 || 'Спори вирішуються шляхом переговорів.'}</li>
                    <li>{t.termsDisputes2 || 'Якщо переговори не дали результату — через медіацію.'}</li>
                    <li>{t.termsDisputes3 || 'Як крайній захід — через суд за місцем реєстрації Виконавця.'}</li>
                    <li>{t.termsDisputes4 || 'Застосовується законодавство Польщі / ЄС.'}</li>
                  </ul>
                </section>

                {/* 12. Changes */}
                <section id="changes">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <RefreshCw className="w-6 h-6 text-primary" />
                    {t.termsChanges || '12. Зміни до умов'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t.termsChangesText || 'Ми залишаємо за собою право змінювати ці Умови в будь-який час. Зміни набувають чинності з моменту їх публікації на нашому веб-сайті. Продовжуючи користуватись нашими послугами після внесення змін, ви погоджуєтесь з оновленими Умовами.'}
                  </p>
                </section>

                {/* 13. Contact */}
                <section id="contact">
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                    {t.termsContact || '13. Контактна інформація'}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">
                    {t.termsContactText || 'Для питань щодо цих Умов використання зв\'яжіться з нами:'}
                  </p>
                  <div className="bg-card p-6 rounded-2xl border border-border/50">
                    <p className="font-semibold mb-2">Web Impuls</p>
                    <p className="text-muted-foreground">Email: legal@webimpuls.com</p>
                    <p className="text-muted-foreground">Email: contact@webimpuls.com</p>
                  </div>
                </section>
              </div>
            </div>

            {/* Right Sidebar - Navigation */}
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card/50 border border-border/50 rounded-2xl p-6"
                >
                  <h3 className="font-bold text-lg mb-4">{t.tableOfContents || 'Зміст'}</h3>
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      const isActive = activeSection === section.id;
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm transition-all ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{t[section.titleKey] || section.titleKey}</span>
                        </button>
                      );
                    })}
                  </nav>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}











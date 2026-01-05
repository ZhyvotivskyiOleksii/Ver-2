
import type { Metadata } from 'next';
import PricingPageClient from './pricing-client';

export const metadata: Metadata = {
  title: 'Послуги та Ціни',
  description:
    'Дізнайтеся про вартість та терміни створення лендінгів, корпоративних сайтів, інтернет-магазинів та веб-додатків від WebImpuls Studio. Прозорі ціни та повний перелік послуг.',
};

export default function PricingPage() {
  return <PricingPageClient />;
}

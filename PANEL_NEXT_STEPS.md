# 🚀 Next Steps - Web Impuls Panel System

## Current Status

✅ Database schema designed (15 tables)
✅ Architecture documented
✅ UI mockups created
✅ Feature list defined

## Immediate Next Steps

### 1. Apply Database Migration

```bash
# Navigate to your Supabase dashboard
# Go to SQL Editor
# Paste and run: packages/database/migrations/001_panel_schema.sql
```

Or via CLI:
```bash
supabase db push
```

### 2. Set Up Monorepo Structure

**Option A: Keep in Ver-2 (simpler)**
```
Ver-2/
├── src/app/[locale]/
│   ├── (website)/        # Current pages
│   ├── admin/            # Admin panel routes
│   └── portal/           # Client portal routes
```

**Option B: Full Monorepo (recommended for scale)**
```bash
# Create new monorepo
mkdir webimpuls && cd webimpuls
pnpm init

# Initialize Turborepo
pnpm add turbo -D

# Create apps
mkdir -p apps/website apps/admin apps/portal
mkdir -p packages/database packages/ui packages/auth

# Move Ver-2 to apps/website
mv ../Ver-2/* apps/website/
```

### 3. Create Shared Database Package

```typescript
// packages/database/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side with service role
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

### 4. Create Auth Package

```typescript
// packages/auth/provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@webimpuls/database';
import type { User, Profile } from '@webimpuls/database';

interface AuthContext {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async function signUp(email: string, password: string, name: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      isLoading, 
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 5. Stripe Integration Setup

```bash
# Install Stripe
pnpm add stripe @stripe/stripe-js

# Create products in Stripe Dashboard:
# - Basic Support: 199 PLN/month
# - Pro Support: 399 PLN/month
# - Enterprise Support: 799 PLN/month
```

```typescript
// packages/billing/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createSubscription(
  customerId: string,
  priceId: string
) {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId);
}
```

### 6. AI Estimation Integration

```typescript
// packages/ai/estimation.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TaskInput {
  title: string;
  description: string;
  projectType: string;
  taskType: string;
}

interface Estimation {
  hours: { min: number; max: number };
  price: { min: number; max: number };
  confidence: number;
  reasoning: string;
}

export async function estimateTask(input: TaskInput): Promise<Estimation> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a web development project estimator. 
          Analyze tasks and provide accurate time/cost estimates.
          Consider complexity, project type, and similar past projects.
          Our hourly rate is $25 (100 PLN).`,
      },
      {
        role: 'user',
        content: `Estimate this task:
          Title: ${input.title}
          Description: ${input.description}
          Project Type: ${input.projectType}
          Task Type: ${input.taskType}
          
          Return JSON: {
            hours: { min: number, max: number },
            price: { min: number, max: number },
            confidence: number (0-1),
            reasoning: string
          }`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content!);
}
```

---

## Development Timeline

### Week 1-2: Foundation
- [ ] Set up monorepo (Turborepo + pnpm)
- [ ] Apply database migrations
- [ ] Create shared packages (database, ui, auth)
- [ ] Basic auth flow (login, register, logout)
- [ ] Admin layout with sidebar
- [ ] Client portal layout

### Week 3-4: Core Features
- [ ] Client management (CRUD)
- [ ] Project management (CRUD)
- [ ] Task management with Kanban board
- [ ] Task detail view with comments
- [ ] Basic file uploads

### Week 5: Billing & Subscriptions
- [ ] Stripe integration
- [ ] Subscription plans
- [ ] Payment processing
- [ ] Invoice generation
- [ ] Webhook handling

### Week 6: AI & Realtime
- [ ] AI task estimation
- [ ] Realtime task status updates
- [ ] Notification system
- [ ] Activity log

### Week 7: Advertising Module
- [ ] Campaign management
- [ ] Performance tracking
- [ ] Client reports
- [ ] Budget tracking

### Week 8: Polish & Launch
- [ ] Mobile responsiveness
- [ ] Email notifications
- [ ] Onboarding flow
- [ ] Testing & bug fixes
- [ ] Documentation
- [ ] Deployment

---

## Questions to Decide

1. **Domain structure:**
   - Option A: `admin.webimpuls.com` + `app.webimpuls.com`
   - Option B: `webimpuls.com/admin` + `webimpuls.com/app`

2. **Start with:**
   - Option A: Admin panel first (you use it)
   - Option B: Client portal first (client value)
   - Option C: Both in parallel

3. **MVP features:**
   - What's the minimum to launch?
   - Can we skip advertising module for V1?

4. **Pricing:**
   - Confirm subscription prices (199/399/799 PLN)
   - Hourly rate for tasks outside subscription
   - Urgent task surcharge

5. **Translations:**
   - All 4 languages from start?
   - Or UA+PL first?

---

## Ready to Start?

Say the word and we'll begin with:

1. **Option A:** Quick start - Add admin/portal routes to current Ver-2
2. **Option B:** Full setup - Create new monorepo structure

Which approach do you prefer? 🚀


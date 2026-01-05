# 🏗️ Web Impuls Panel System Architecture

## Overview

Complete client and team management system for Web Impuls web development studio.

## Applications

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SHARED SUPABASE DATABASE                       │
│                    (PostgreSQL + Auth + Storage + Realtime)           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│   WEBSITE     │           │  ADMIN PANEL  │           │ CLIENT PORTAL │
│ webimpuls.com │           │admin.webimpuls│           │ app.webimpuls │
│               │           │    .com       │           │    .com       │
│ • Marketing   │           │ • Team mgmt   │           │ • View projects│
│ • Portfolio   │           │ • All clients │           │ • Create tasks │
│ • Contact     │           │ • All projects│           │ • Track status │
│ • Blog        │           │ • Analytics   │           │ • Pay invoices │
│ • Services    │           │ • Billing     │           │ • Subscriptions│
│               │           │ • Time track  │           │ • Ad campaigns │
└───────────────┘           └───────────────┘           └───────────────┘
      apps/website              apps/admin                apps/portal
```

## Folder Structure

```
webimpuls/
├── apps/
│   ├── website/                 # Current Ver-2 (public website)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   └── lib/
│   │   ├── public/
│   │   └── package.json
│   │
│   ├── admin/                   # Team/Admin Panel
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/      # Login, register
│   │   │   │   ├── (dashboard)/ # Main dashboard
│   │   │   │   │   ├── page.tsx         # Overview
│   │   │   │   │   ├── clients/         # Client management
│   │   │   │   │   ├── projects/        # All projects
│   │   │   │   │   ├── tasks/           # Kanban board
│   │   │   │   │   ├── team/            # Team members
│   │   │   │   │   ├── time/            # Time tracking
│   │   │   │   │   ├── billing/         # Invoices, subscriptions
│   │   │   │   │   ├── advertising/     # Ad campaigns
│   │   │   │   │   ├── analytics/       # Reports
│   │   │   │   │   └── settings/        # System settings
│   │   │   │   └── layout.tsx
│   │   │   ├── components/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── tasks/
│   │   │   │   └── ui/
│   │   │   └── lib/
│   │   └── package.json
│   │
│   └── portal/                  # Client Portal
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/      # Login, register
│       │   │   ├── (dashboard)/ # Client dashboard
│       │   │   │   ├── page.tsx         # Overview
│       │   │   │   ├── projects/        # My projects
│       │   │   │   ├── tasks/           # My tasks
│       │   │   │   ├── support/         # Create tickets
│       │   │   │   ├── advertising/     # My ad campaigns
│       │   │   │   ├── billing/         # Invoices, subscription
│       │   │   │   └── settings/        # Profile settings
│       │   │   └── layout.tsx
│       │   ├── components/
│       │   └── lib/
│       └── package.json
│
├── packages/
│   ├── database/                # Shared database package
│   │   ├── migrations/          # SQL migrations
│   │   ├── types/               # Generated TypeScript types
│   │   ├── client.ts            # Supabase client
│   │   └── queries/             # Shared queries
│   │
│   ├── ui/                      # Shared UI components
│   │   ├── components/          # Button, Input, Card, etc.
│   │   ├── hooks/               # useAuth, useUser, etc.
│   │   └── styles/              # Shared Tailwind config
│   │
│   ├── auth/                    # Shared auth logic
│   │   ├── provider.tsx         # AuthProvider
│   │   ├── hooks.ts             # useAuth, useUser
│   │   └── middleware.ts        # Route protection
│   │
│   └── config/                  # Shared configs
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── eslint.config.js
│
├── turbo.json                   # Turborepo config
├── package.json                 # Root package.json
└── pnpm-workspace.yaml          # Workspace config
```

## Features

### 👨‍💻 Admin Panel (Team)

#### Dashboard
- [ ] Overview stats (tasks, revenue, hours)
- [ ] Recent activity feed
- [ ] Upcoming deadlines
- [ ] Quick actions

#### Clients
- [ ] Client list with search/filter
- [ ] Client details (company info, projects, invoices)
- [ ] Add/edit clients
- [ ] Assign team members

#### Projects
- [ ] Project list (Kanban/List view)
- [ ] Project details (tasks, files, team)
- [ ] Create/edit projects
- [ ] Project timeline

#### Tasks
- [ ] Kanban board (New → In Progress → Review → Done)
- [ ] Task details with comments
- [ ] AI estimation integration
- [ ] Bulk actions
- [ ] Filters & search

#### Time Tracking
- [ ] Timer widget
- [ ] Manual entry
- [ ] Weekly/monthly reports
- [ ] Billable vs non-billable

#### Team
- [ ] Team member list
- [ ] Roles & permissions
- [ ] Workload view
- [ ] Performance metrics

#### Billing
- [ ] Invoice generation
- [ ] Subscription management
- [ ] Payment history
- [ ] Revenue reports

#### Advertising
- [ ] Campaign list
- [ ] Performance metrics
- [ ] Budget tracking
- [ ] Client reports

#### Settings
- [ ] Company settings
- [ ] Email templates
- [ ] Integrations
- [ ] API keys

### 👤 Client Portal

#### Dashboard
- [ ] My projects overview
- [ ] Active tasks status
- [ ] Recent updates
- [ ] Quick actions

#### Projects
- [ ] Project list
- [ ] Project details
- [ ] Site links (live, staging)
- [ ] Files & documents

#### Tasks
- [ ] Create new task
- [ ] Task list with status
- [ ] Comment on tasks
- [ ] View AI estimation
- [ ] Approve estimates

#### Support
- [ ] Subscription status
- [ ] Hours used/remaining
- [ ] Quick ticket form
- [ ] Chat support (optional)

#### Advertising
- [ ] Campaign overview
- [ ] Performance reports
- [ ] Budget status
- [ ] Request changes

#### Billing
- [ ] Current subscription
- [ ] Invoice history
- [ ] Payment methods
- [ ] Upgrade/downgrade plan

#### Settings
- [ ] Profile settings
- [ ] Company info
- [ ] Team members (if owner)
- [ ] Notifications

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | Supabase Auth |
| **Realtime** | Supabase Realtime |
| **Storage** | Supabase Storage |
| **Payments** | Stripe |
| **Email** | Resend |
| **AI** | OpenAI / Gemini |
| **Hosting** | Vercel |
| **Monorepo** | Turborepo + pnpm |

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         LOGIN PAGE                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Email: [________________________]                       │    │
│  │  Password: [____________________]                        │    │
│  │                                                          │    │
│  │  [Login with Email]  [Login with Google]                 │    │
│  │                                                          │    │
│  │  Don't have an account? [Register]                       │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CHECK USER ROLE                               │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          │                                       │
          ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────┐
│  role = team member │               │   role = client     │
│  (admin, dev, etc.) │               │                     │
└─────────────────────┘               └─────────────────────┘
          │                                       │
          ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────┐
│ Redirect to:        │               │ Redirect to:        │
│ admin.webimpuls.com │               │ app.webimpuls.com   │
└─────────────────────┘               └─────────────────────┘
```

## Subscription Plans

| Plan | Price | Hours/month | Overage | Response Time | Features |
|------|-------|-------------|---------|---------------|----------|
| **Free** | 0 PLN | 0 | - | 5 days | Portal access only |
| **Basic** | 199 PLN | 3 | 80 PLN/h | 48 hours | + Email support |
| **Pro** | 399 PLN | 5 | 70 PLN/h | 24 hours | + Priority, Phone |
| **Enterprise** | 799 PLN | 10 | 60 PLN/h | 4 hours | + Dedicated manager |

## AI Task Estimation

```typescript
interface AIEstimation {
  hours: {
    min: number;
    max: number;
  };
  price: {
    min: number;
    max: number;
  };
  confidence: number; // 0-1
  reasoning: string;
  suggestedType: TaskType;
  suggestedPriority: TaskPriority;
}

async function estimateTask(input: {
  title: string;
  description: string;
  projectType: ProjectType;
  attachments?: string[];
}): Promise<AIEstimation> {
  const prompt = `
    Analyze this web development task and estimate:
    
    Title: ${input.title}
    Description: ${input.description}
    Project Type: ${input.projectType}
    
    Based on similar tasks in web development:
    1. Estimated hours (min-max)
    2. Estimated price at $25/hour
    3. Confidence level (0-1)
    4. Task type (bug, feature, design, content, etc.)
    5. Priority suggestion (low, medium, high, urgent)
    
    Return JSON format.
  `;
  
  // Call OpenAI/Gemini API
  // Parse response
  // Return estimation
}
```

## Realtime Updates

```typescript
// Subscribe to task updates
supabase
  .channel('tasks')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'tasks',
    filter: `project_id=eq.${projectId}`
  }, (payload) => {
    // Update UI in real-time
    handleTaskUpdate(payload);
  })
  .subscribe();
```

## API Endpoints

### Admin API
- `GET /api/admin/clients` - List all clients
- `GET /api/admin/projects` - List all projects
- `GET /api/admin/tasks` - List all tasks (with filters)
- `POST /api/admin/tasks/:id/assign` - Assign task
- `POST /api/admin/tasks/:id/estimate` - AI estimate
- `GET /api/admin/analytics` - Dashboard stats

### Client API
- `GET /api/portal/projects` - My projects
- `GET /api/portal/tasks` - My tasks
- `POST /api/portal/tasks` - Create task
- `GET /api/portal/subscription` - My subscription
- `POST /api/portal/subscription/upgrade` - Upgrade plan

### Webhooks
- `POST /api/webhooks/stripe` - Stripe payment events
- `POST /api/webhooks/supabase` - Database events

## Development Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Set up monorepo (Turborepo + pnpm)
- [ ] Configure shared packages
- [ ] Apply database migrations
- [ ] Implement auth flow
- [ ] Basic layouts for both panels

### Phase 2: Core Features (Week 3-4)
- [ ] Client & project management
- [ ] Task CRUD with Kanban
- [ ] Basic time tracking
- [ ] File uploads

### Phase 3: Billing (Week 5)
- [ ] Stripe integration
- [ ] Subscription plans
- [ ] Invoice generation
- [ ] Payment history

### Phase 4: AI & Realtime (Week 6)
- [ ] AI task estimation
- [ ] Realtime updates
- [ ] Notifications
- [ ] Activity log

### Phase 5: Advertising Module (Week 7)
- [ ] Campaign management
- [ ] Performance tracking
- [ ] Client reports
- [ ] Budget management

### Phase 6: Polish (Week 8)
- [ ] Mobile responsiveness
- [ ] Email notifications
- [ ] Onboarding flow
- [ ] Documentation

## Security Considerations

- [ ] Row Level Security (RLS) on all tables
- [ ] Role-based access control
- [ ] API rate limiting
- [ ] Input validation
- [ ] CSRF protection
- [ ] Secure headers
- [ ] Audit logging
- [ ] Data encryption

## Deployment

```yaml
# Vercel deployment config
# vercel.json for each app

# Website
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}

# Admin (admin.webimpuls.com)
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}

# Portal (app.webimpuls.com)  
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

## Environment Variables

```env
# Shared
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# AI
OPENAI_API_KEY=
# or
GEMINI_API_KEY=

# Email
RESEND_API_KEY=

# App URLs
NEXT_PUBLIC_WEBSITE_URL=https://webimpuls.com
NEXT_PUBLIC_ADMIN_URL=https://admin.webimpuls.com
NEXT_PUBLIC_PORTAL_URL=https://app.webimpuls.com
```

---

## Getting Started

```bash
# Clone and install
git clone https://github.com/webimpuls/webimpuls.git
cd webimpuls
pnpm install

# Run all apps
pnpm dev

# Run specific app
pnpm dev --filter=admin
pnpm dev --filter=portal
pnpm dev --filter=website
```


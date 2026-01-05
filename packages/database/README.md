# 📊 Web Impuls Database Package

## Overview

Shared database package for all Web Impuls applications:
- **Website** (webimpuls.com)
- **Admin Panel** (admin.webimpuls.com)
- **Client Portal** (app.webimpuls.com)

## Tech Stack

- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM / Supabase Client
- **Migrations**: SQL files in `/migrations`
- **Types**: Auto-generated TypeScript types

## Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends Supabase auth) |
| `companies` | Client companies/organizations |
| `company_members` | Links users to companies |
| `projects` | Client projects (websites, apps) |
| `project_members` | Team members assigned to projects |

### Task Management

| Table | Description |
|-------|-------------|
| `tasks` | Tasks/tickets with AI estimation |
| `task_comments` | Comments on tasks |
| `attachments` | File attachments |
| `time_entries` | Time tracking entries |

### Billing

| Table | Description |
|-------|-------------|
| `subscriptions` | Support subscription plans |
| `invoices` | Generated invoices |

### Advertising (New Service)

| Table | Description |
|-------|-------------|
| `ad_campaigns` | Advertising campaigns |
| `ad_reports` | Daily performance reports |

### System

| Table | Description |
|-------|-------------|
| `activity_log` | Audit trail |
| `notifications` | User notifications |

## Roles

| Role | Access |
|------|--------|
| `super_admin` | Full access to everything |
| `admin` | Full access, no billing settings |
| `manager` | Manage projects & tasks |
| `developer` | View projects, manage assigned tasks |
| `designer` | View projects, manage assigned tasks |
| `client` | Own company's projects & tasks only |

## Row Level Security (RLS)

All tables have RLS enabled with these rules:
- **Team members** can see all data
- **Clients** can only see their company's data
- Internal comments are hidden from clients

## Setup

```bash
# Apply migrations to Supabase
supabase db push

# Generate types
supabase gen types typescript --local > types/database.ts
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```














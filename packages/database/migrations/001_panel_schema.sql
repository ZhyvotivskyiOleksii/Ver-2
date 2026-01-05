-- =============================================
-- WEB IMPULS PANEL SYSTEM - DATABASE SCHEMA
-- =============================================
-- Version: 1.0.0
-- Date: 2024-12-14
-- Description: Complete schema for team and client panels
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

-- User roles
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'manager', 'developer', 'designer', 'client');

-- Project types
CREATE TYPE project_type AS ENUM ('landing', 'corporate', 'ecommerce', 'webapp', 'redesign', 'support', 'advertising');

-- Project status
CREATE TYPE project_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');

-- Task status
CREATE TYPE task_status AS ENUM ('new', 'pending_review', 'approved', 'in_progress', 'review', 'completed', 'cancelled');

-- Task priority
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Task type
CREATE TYPE task_type AS ENUM ('bug', 'feature', 'design', 'content', 'seo', 'advertising', 'maintenance', 'other');

-- Subscription plan
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'pro', 'enterprise');

-- Subscription status
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'trialing');

-- Service type (for advertising)
CREATE TYPE service_type AS ENUM ('google_ads', 'facebook_ads', 'instagram_ads', 'tiktok_ads', 'linkedin_ads', 'seo', 'smm');

-- =============================================
-- TABLES
-- =============================================

-- 1. Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role user_role DEFAULT 'client',
    language TEXT DEFAULT 'ua' CHECK (language IN ('ua', 'pl', 'en', 'de')),
    timezone TEXT DEFAULT 'Europe/Warsaw',
    is_active BOOLEAN DEFAULT true,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Companies (clients/organizations)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    website TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    country TEXT DEFAULT 'PL',
    vat_number TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Company members (links users to companies)
CREATE TABLE IF NOT EXISTS public.company_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- 4. Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    type project_type NOT NULL,
    status project_status DEFAULT 'draft',
    url TEXT,
    staging_url TEXT,
    repository_url TEXT,
    
    -- Pricing
    quoted_price DECIMAL(10,2),
    final_price DECIMAL(10,2),
    currency TEXT DEFAULT 'PLN' CHECK (currency IN ('PLN', 'EUR', 'USD')),
    
    -- Dates
    start_date DATE,
    deadline DATE,
    completed_at TIMESTAMPTZ,
    
    -- Team
    project_manager UUID REFERENCES public.profiles(id),
    
    -- Metadata
    technologies TEXT[], -- ['Next.js', 'React', 'Tailwind']
    settings JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(company_id, slug)
);

-- 5. Project team members
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'developer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- 6. Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL, -- subtasks
    
    -- Basic info
    title TEXT NOT NULL,
    description TEXT,
    type task_type DEFAULT 'other',
    status task_status DEFAULT 'new',
    priority task_priority DEFAULT 'medium',
    
    -- Estimation (AI-generated or manual)
    estimated_hours DECIMAL(5,2),
    estimated_price DECIMAL(10,2),
    ai_estimation JSONB, -- { hours: [min, max], price: [min, max], confidence: 0.8 }
    
    -- Actual
    actual_hours DECIMAL(5,2),
    actual_price DECIMAL(10,2),
    
    -- Assignment
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    assigned_to UUID REFERENCES public.profiles(id),
    reviewed_by UUID REFERENCES public.profiles(id),
    
    -- Dates
    due_date TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Flags
    is_billable BOOLEAN DEFAULT true,
    is_from_subscription BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    
    -- Order for sorting
    position INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Task comments
CREATE TABLE IF NOT EXISTS public.task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- hidden from clients
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Task attachments
CREATE TABLE IF NOT EXISTS public.attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.task_comments(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
    filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Time tracking
CREATE TABLE IF NOT EXISTS public.time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    description TEXT,
    hours DECIMAL(5,2) NOT NULL,
    hourly_rate DECIMAL(10,2),
    
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    
    is_billable BOOLEAN DEFAULT true,
    is_billed BOOLEAN DEFAULT false,
    invoice_id UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    plan subscription_plan NOT NULL DEFAULT 'free',
    status subscription_status DEFAULT 'active',
    
    -- Limits
    hours_included DECIMAL(5,2) DEFAULT 0, -- hours per month
    hours_used DECIMAL(5,2) DEFAULT 0,
    overage_rate DECIMAL(10,2), -- price per hour over limit
    
    -- Stripe
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    stripe_price_id TEXT,
    
    -- Billing
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'PLN',
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    
    -- Dates
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Advertising campaigns (new service)
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    
    name TEXT NOT NULL,
    service_type service_type NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'paused', 'completed')),
    
    -- Budget
    monthly_budget DECIMAL(10,2),
    total_spent DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'PLN',
    
    -- Performance metrics
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    ctr DECIMAL(5,4), -- click-through rate
    cpc DECIMAL(10,2), -- cost per click
    cpa DECIMAL(10,2), -- cost per acquisition
    roas DECIMAL(10,2), -- return on ad spend
    
    -- Settings
    target_audience JSONB,
    keywords TEXT[],
    ad_copy JSONB,
    landing_url TEXT,
    
    -- Dates
    start_date DATE,
    end_date DATE,
    
    -- Management fee
    management_fee_percent DECIMAL(5,2) DEFAULT 15.00,
    management_fee_fixed DECIMAL(10,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Advertising reports
CREATE TABLE IF NOT EXISTS public.ad_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.ad_campaigns(id) ON DELETE CASCADE,
    
    report_date DATE NOT NULL,
    
    spend DECIMAL(10,2) DEFAULT 0,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    
    metrics JSONB, -- additional platform-specific metrics
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(campaign_id, report_date)
);

-- 13. Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    
    invoice_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    
    -- Amounts
    subtotal DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 23.00, -- VAT
    tax_amount DECIMAL(10,2),
    total DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'PLN',
    
    -- Dates
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    paid_at TIMESTAMPTZ,
    
    -- Details
    items JSONB NOT NULL, -- [{ description, quantity, unit_price, total }]
    notes TEXT,
    
    -- Payment
    stripe_invoice_id TEXT,
    payment_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Activity log (audit trail)
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    entity_type TEXT NOT NULL, -- 'task', 'project', 'company', etc.
    entity_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'status_changed', etc.
    
    old_values JSONB,
    new_values JSONB,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL, -- 'task_assigned', 'task_completed', 'comment', 'payment', etc.
    title TEXT NOT NULL,
    message TEXT,
    
    entity_type TEXT,
    entity_id UUID,
    action_url TEXT,
    
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

CREATE INDEX idx_companies_slug ON public.companies(slug);
CREATE INDEX idx_company_members_user ON public.company_members(user_id);
CREATE INDEX idx_company_members_company ON public.company_members(company_id);

CREATE INDEX idx_projects_company ON public.projects(company_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_type ON public.projects(type);

CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_assigned ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON public.tasks(created_by);

CREATE INDEX idx_time_entries_task ON public.time_entries(task_id);
CREATE INDEX idx_time_entries_user ON public.time_entries(user_id);
CREATE INDEX idx_time_entries_date ON public.time_entries(date);

CREATE INDEX idx_subscriptions_company ON public.subscriptions(company_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

CREATE INDEX idx_ad_campaigns_company ON public.ad_campaigns(company_id);
CREATE INDEX idx_ad_reports_campaign ON public.ad_reports(campaign_id);
CREATE INDEX idx_ad_reports_date ON public.ad_reports(report_date);

CREATE INDEX idx_activity_log_entity ON public.activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_user ON public.activity_log(user_id);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id) WHERE is_read = false;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Helper function: check if user is team member (admin, developer, etc.)
CREATE OR REPLACE FUNCTION public.is_team_member(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id 
        AND role IN ('super_admin', 'admin', 'manager', 'developer', 'designer')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: check if user belongs to company
CREATE OR REPLACE FUNCTION public.user_belongs_to_company(user_id UUID, company_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.company_members 
        WHERE company_members.user_id = user_belongs_to_company.user_id 
        AND company_members.company_id = user_belongs_to_company.company_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users can read their own, team can read all
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_team_member(auth.uid()));

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Companies: team sees all, clients see their own
CREATE POLICY "Team can view all companies" ON public.companies
    FOR SELECT USING (public.is_team_member(auth.uid()));

CREATE POLICY "Clients can view own company" ON public.companies
    FOR SELECT USING (public.user_belongs_to_company(auth.uid(), id));

CREATE POLICY "Team can manage companies" ON public.companies
    FOR ALL USING (public.is_team_member(auth.uid()));

-- Projects: team sees all, clients see their company's projects
CREATE POLICY "Team can view all projects" ON public.projects
    FOR SELECT USING (public.is_team_member(auth.uid()));

CREATE POLICY "Clients can view own projects" ON public.projects
    FOR SELECT USING (public.user_belongs_to_company(auth.uid(), company_id));

CREATE POLICY "Team can manage projects" ON public.projects
    FOR ALL USING (public.is_team_member(auth.uid()));

-- Tasks: team sees all, clients see their project's tasks
CREATE POLICY "Team can view all tasks" ON public.tasks
    FOR SELECT USING (public.is_team_member(auth.uid()));

CREATE POLICY "Clients can view own tasks" ON public.tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = tasks.project_id 
            AND public.user_belongs_to_company(auth.uid(), p.company_id)
        )
    );

CREATE POLICY "Clients can create tasks" ON public.tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_id 
            AND public.user_belongs_to_company(auth.uid(), p.company_id)
        )
    );

CREATE POLICY "Team can manage tasks" ON public.tasks
    FOR ALL USING (public.is_team_member(auth.uid()));

-- Comments: team sees all (including internal), clients see non-internal
CREATE POLICY "Team can view all comments" ON public.task_comments
    FOR SELECT USING (public.is_team_member(auth.uid()));

CREATE POLICY "Clients can view non-internal comments" ON public.task_comments
    FOR SELECT USING (
        is_internal = false AND
        EXISTS (
            SELECT 1 FROM public.tasks t 
            JOIN public.projects p ON p.id = t.project_id
            WHERE t.id = task_comments.task_id 
            AND public.user_belongs_to_company(auth.uid(), p.company_id)
        )
    );

CREATE POLICY "Users can create comments" ON public.task_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: users see their own
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Log activity
CREATE OR REPLACE FUNCTION public.log_activity(
    p_entity_type TEXT,
    p_entity_id UUID,
    p_action TEXT,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO public.activity_log (user_id, entity_type, entity_id, action, old_values, new_values)
    VALUES (auth.uid(), p_entity_type, p_entity_id, p_action, p_old_values, p_new_values)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- INITIAL DATA
-- =============================================

-- Subscription plans pricing (for reference)
COMMENT ON TABLE public.subscriptions IS 'Subscription Plans:
- free: 0 PLN/month, 0 hours
- basic: 199 PLN/month, 3 hours, overage 80 PLN/hour
- pro: 399 PLN/month, 5 hours, overage 70 PLN/hour  
- enterprise: 799 PLN/month, 10 hours, overage 60 PLN/hour';


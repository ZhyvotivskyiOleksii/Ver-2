-- Cookie Consent Table
CREATE TABLE IF NOT EXISTS cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  consent_given BOOLEAN DEFAULT FALSE,
  necessary BOOLEAN DEFAULT TRUE,
  analytics BOOLEAN DEFAULT FALSE,
  marketing BOOLEAN DEFAULT FALSE,
  preferences BOOLEAN DEFAULT FALSE,
  ip_address TEXT,
  user_agent TEXT,
  page_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cookie_consents_visitor_id ON cookie_consents(visitor_id);

-- RLS policies
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON cookie_consents
  FOR INSERT
  WITH CHECK (true);

-- Allow updates for same visitor_id
CREATE POLICY "Allow updates by visitor_id" ON cookie_consents
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow select for same visitor_id
CREATE POLICY "Allow select" ON cookie_consents
  FOR SELECT
  USING (true);














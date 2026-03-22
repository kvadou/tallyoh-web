-- TallyOh Initial Schema
-- Shared database for iOS app + Next.js admin portal

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('admin', 'parent', 'child');
CREATE TYPE mission_type AS ENUM ('story', 'real_world', 'quiz', 'daily', 'custom');
CREATE TYPE mission_status AS ENUM ('active', 'completed', 'expired');
CREATE TYPE transaction_type AS ENUM ('earned', 'spent');
CREATE TYPE character_id AS ENUM ('hammy', 'pearl', 'ziggy', 'willow', 'sparks');
CREATE TYPE adventure_land AS ENUM ('coin_canyon', 'savings_forest', 'invention_tower', 'family_store', 'generosity_garden', 'future_forest');
CREATE TYPE subscription_tier AS ENUM ('free', 'family');

-- ============================================
-- CORE TABLES
-- ============================================

CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  parent_pin TEXT NOT NULL DEFAULT '1234',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE SET NULL,
  role user_role NOT NULL DEFAULT 'parent',
  display_name TEXT NOT NULL,
  age INT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- CONTENT TABLES
-- ============================================

CREATE TABLE characters (
  id character_id PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  role TEXT NOT NULL,
  personality TEXT NOT NULL,
  catchphrase TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_unlockable BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE story_chapters (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  chapter_number INT NOT NULL,
  land adventure_land NOT NULL,
  coins_reward INT NOT NULL DEFAULT 10,
  age_min INT NOT NULL DEFAULT 4,
  age_max INT NOT NULL DEFAULT 10,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE story_pages (
  id TEXT NOT NULL,
  chapter_id TEXT NOT NULL REFERENCES story_chapters(id) ON DELETE CASCADE,
  page_order INT NOT NULL,
  text TEXT NOT NULL,
  speaker character_id,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (chapter_id, id)
);

CREATE TABLE story_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id TEXT NOT NULL,
  page_id TEXT NOT NULL,
  question TEXT NOT NULL,
  FOREIGN KEY (chapter_id, page_id) REFERENCES story_pages(chapter_id, id) ON DELETE CASCADE
);

CREATE TABLE choice_options (
  id TEXT NOT NULL,
  choice_id UUID NOT NULL REFERENCES story_choices(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  next_page_id TEXT,
  coins_bonus INT NOT NULL DEFAULT 0,
  response_text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (choice_id, id)
);

CREATE TABLE mission_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  coins_reward INT NOT NULL,
  type mission_type NOT NULL,
  character_id character_id,
  age_min INT NOT NULL DEFAULT 4,
  age_max INT NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- USER ACTIVITY TABLES
-- ============================================

CREATE TABLE coin_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 0,
  total_earned INT NOT NULL DEFAULT 0,
  total_spent INT NOT NULL DEFAULT 0,
  UNIQUE(user_id)
);

CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES coin_wallets(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  reason TEXT NOT NULL,
  type transaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE mission_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES mission_templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  coins_reward INT NOT NULL,
  type mission_type NOT NULL,
  character_id character_id,
  status mission_status NOT NULL DEFAULT 'active',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE story_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id TEXT NOT NULL REFERENCES story_chapters(id) ON DELETE CASCADE,
  current_page_id TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  coins_earned INT NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, chapter_id)
);

CREATE TABLE store_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cost_coins INT NOT NULL,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id UUID NOT NULL REFERENCES store_rewards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coins_spent INT NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_family ON users(family_id);
CREATE INDEX idx_coin_transactions_wallet ON coin_transactions(wallet_id);
CREATE INDEX idx_coin_transactions_created ON coin_transactions(created_at DESC);
CREATE INDEX idx_mission_assignments_user ON mission_assignments(user_id);
CREATE INDEX idx_mission_assignments_status ON mission_assignments(status);
CREATE INDEX idx_story_progress_user ON story_progress(user_id);
CREATE INDEX idx_story_pages_chapter ON story_pages(chapter_id, page_order);
CREATE INDEX idx_store_rewards_family ON store_rewards(family_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER families_updated_at BEFORE UPDATE ON families FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER characters_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER story_chapters_updated_at BEFORE UPDATE ON story_chapters FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER mission_templates_updated_at BEFORE UPDATE ON mission_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED: Characters
-- ============================================

INSERT INTO characters (id, name, species, role, personality, catchphrase, accent_color, sort_order, is_unlockable) VALUES
  ('hammy', 'Hammy', 'Hamster', 'The Earner', 'Energetic, always building, never stops moving', 'What can I make today?', '#E87040', 1, false),
  ('pearl', 'Pearl', 'Turtle', 'The Saver', 'Calm, patient, wise — always comes out ahead', 'Every coin counts toward something bigger', '#5A9A5E', 2, false),
  ('ziggy', 'Ziggy', 'Raccoon', 'The Spender', 'Fun-loving, impulsive, attracted to shiny things', 'Is this a want or a need?', '#6B7B8D', 3, false),
  ('willow', 'Willow', 'Deer', 'The Giver', 'Gentle, empathetic, always helping others', 'How can I help?', '#8B6F47', 4, false),
  ('sparks', 'Sparks', 'Fox', 'The Thinker', 'Clever, curious, loves puzzles and taking things apart', 'Let''s figure this out step by step', '#D4763A', 5, false);

-- ============================================
-- RLS: Enable on all tables
-- ============================================

ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE choice_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY admin_all ON families FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON users FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON admins FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON characters FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON story_chapters FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON story_pages FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON story_choices FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON choice_options FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON mission_templates FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON coin_wallets FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON coin_transactions FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON mission_assignments FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON story_progress FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON store_rewards FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
CREATE POLICY admin_all ON reward_redemptions FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Public can read characters and published chapters
CREATE POLICY public_read_characters ON characters FOR SELECT USING (true);
CREATE POLICY public_read_published_chapters ON story_chapters FOR SELECT USING (is_published = true);
CREATE POLICY public_read_published_pages ON story_pages FOR SELECT USING (
  EXISTS (SELECT 1 FROM story_chapters WHERE id = chapter_id AND is_published = true)
);
CREATE POLICY public_read_published_choices ON story_choices FOR SELECT USING (
  EXISTS (SELECT 1 FROM story_chapters WHERE id = chapter_id AND is_published = true)
);
CREATE POLICY public_read_choice_options ON choice_options FOR SELECT USING (
  EXISTS (SELECT 1 FROM story_choices sc JOIN story_chapters ch ON ch.id = sc.chapter_id WHERE sc.id = choice_id AND ch.is_published = true)
);
CREATE POLICY public_read_active_missions ON mission_templates FOR SELECT USING (is_active = true);

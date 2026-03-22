# TallyOh Next.js Full-Stack Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Next.js 15 web application with Supabase backend that serves three purposes: (1) public marketing site, (2) admin portal for Doug & Alexis to operate the business, and (3) shared database that the iOS app will also connect to.

**Architecture:** Next.js 15 App Router with `/admin` route group behind Supabase Auth. Supabase provides PostgreSQL database, auth, storage, and row-level security. The admin portal is a server-rendered dashboard with client components where needed. The marketing site is the public-facing landing page (port of current static HTML). Database schema mirrors the iOS app's data models (characters, stories, missions, coins) and adds operational tables (users, families, analytics).

**Tech Stack:** Next.js 15, TypeScript, Supabase (Auth + DB + Storage + RLS), Tailwind CSS 4, shadcn/ui components, Plus Jakarta Sans + Be Vietnam Pro fonts (per design.md)

---

## Phase 1: Foundation (Supabase + Next.js Skeleton)

### Task 1: Create Supabase Project & Database Schema

**Prerequisite:** Create a Supabase project at https://supabase.com/dashboard. Note the project URL and anon/service_role keys.

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `.env.local` (do NOT commit)
- Create: `.env.example`

**Step 1: Create `.env.example` with required keys**

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Step 2: Create `.env.local` with real values**

Doug will provide the actual Supabase project URL and keys after creating the project.

**Step 3: Write the initial database migration**

```sql
-- supabase/migrations/001_initial_schema.sql

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

-- Families group parents and children together
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  parent_pin TEXT NOT NULL DEFAULT '1234',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users (parents and children, linked to Supabase Auth)
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

-- Admin users (Doug & Alexis — separate from family users)
CREATE TABLE admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- CONTENT TABLES (managed via admin)
-- ============================================

-- Characters
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

-- Story chapters
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

-- Story pages (belong to chapters)
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

-- Story choices (belong to pages)
CREATE TABLE story_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id TEXT NOT NULL,
  page_id TEXT NOT NULL,
  question TEXT NOT NULL,
  FOREIGN KEY (chapter_id, page_id) REFERENCES story_pages(chapter_id, id) ON DELETE CASCADE
);

-- Choice options
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

-- Mission templates (admin-created, reusable)
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

-- Coin wallets (one per child)
CREATE TABLE coin_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 0,
  total_earned INT NOT NULL DEFAULT 0,
  total_spent INT NOT NULL DEFAULT 0,
  UNIQUE(user_id)
);

-- Coin transactions
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES coin_wallets(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  reason TEXT NOT NULL,
  type transaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mission assignments (instance of a template for a specific child)
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

-- Story progress (tracks which chapters a child has completed)
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

-- Family Store rewards (parent-curated)
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

-- Reward redemptions
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
```

**Step 4: Run the migration**

Run the SQL in the Supabase SQL Editor (Dashboard > SQL Editor > New Query > paste > Run), or use the Supabase CLI if installed.

**Step 5: Commit**

```bash
git add supabase/ .env.example .gitignore
git commit -m "feat: add Supabase schema with characters, stories, missions, wallets, and admin tables"
```

---

### Task 2: Initialize Next.js 15 Project

**Files:**
- Create: New Next.js project in `tallyoh-web/` (replaces current static site)
- Keep: All image assets from current site

**Step 1: Back up current assets**

```bash
cd /Users/dougkvamme/Projects/tallyoh/tallyoh-web
mkdir -p /tmp/tallyoh-assets
cp *.jpg *.png *.mp4 *.ico /tmp/tallyoh-assets/
cp design.md /tmp/tallyoh-assets/
cp -r brand /tmp/tallyoh-assets/
cp -r docs /tmp/tallyoh-assets/
```

**Step 2: Initialize Next.js**

```bash
cd /Users/dougkvamme/Projects/tallyoh/tallyoh-web
# Remove old static files (keep .git)
rm -f index.html
# Init Next.js
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

If prompted about overwriting, say yes — we backed up everything.

**Step 3: Restore assets**

```bash
cp /tmp/tallyoh-assets/*.jpg /tmp/tallyoh-assets/*.png /tmp/tallyoh-assets/*.mp4 /tmp/tallyoh-assets/*.ico public/
cp /tmp/tallyoh-assets/design.md .
cp -r /tmp/tallyoh-assets/brand .
cp -r /tmp/tallyoh-assets/docs .
```

**Step 4: Install dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install -D @types/node
```

**Step 5: Set up environment files**

Copy `.env.example` to `.env.local` and fill in real Supabase values.

**Step 6: Verify it runs**

```bash
npm run dev
```

Visit http://localhost:3000 — should see default Next.js page.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 15 project with TypeScript, Tailwind, Supabase"
```

---

### Task 3: Supabase Client Setup

**Files:**
- Create: `src/lib/supabase/client.ts` (browser client)
- Create: `src/lib/supabase/server.ts` (server client)
- Create: `src/lib/supabase/middleware.ts` (auth middleware)
- Create: `src/middleware.ts` (Next.js middleware)

**Step 1: Create browser client**

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Step 2: Create server client**

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  )
}
```

**Step 3: Create admin server client (uses service role for admin operations)**

```typescript
// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

**Step 4: Create middleware**

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      // Allow the login page itself
      if (request.nextUrl.pathname === '/admin/login') {
        return supabaseResponse
      }
      return NextResponse.redirect(url)
    }

    // Check if user is an admin (except on login page)
    if (request.nextUrl.pathname !== '/admin/login') {
      const { data: admin } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!admin) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

**Step 5: Verify dev server still runs**

```bash
npm run dev
```

**Step 6: Commit**

```bash
git add src/lib/supabase/ src/middleware.ts
git commit -m "feat: add Supabase client (browser, server, admin) and auth middleware"
```

---

### Task 4: Tailwind + Design System Config

**Files:**
- Modify: `tailwind.config.ts` or `src/app/globals.css` (Tailwind v4 uses CSS config)
- Create: `src/lib/fonts.ts`

**Step 1: Set up Google Fonts**

```typescript
// src/lib/fonts.ts
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from 'next/font/google'

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})
```

**Step 2: Configure Tailwind with design system tokens**

Update `src/app/globals.css` to include the design system colors and tokens from `design.md`:

```css
@import "tailwindcss";

@theme {
  /* Surface Hierarchy */
  --color-surface: #fffcf7;
  --color-surface-low: #fcf9f4;
  --color-surface-mid: #f6f3ee;
  --color-surface-high: #f0eee8;
  --color-surface-bright: #ffffff;
  --color-surface-dim: #e5e2dc;

  /* Primary */
  --color-primary: #36679c;
  --color-primary-container: #93c1fd;
  --color-on-primary: #ffffff;
  --color-on-primary-fixed: #002648;

  /* Secondary */
  --color-secondary: #865c22;
  --color-secondary-container: #ffc885;

  /* Text */
  --color-on-surface: #1a1a18;
  --color-on-surface-variant: #656461;

  /* Accents */
  --color-forest-green: #5A9A5E;
  --color-flag-orange: #E87040;
  --color-tech-purple: #7B68AE;

  /* Fonts */
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}
```

**Step 3: Update root layout**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { plusJakarta, beVietnam } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'TallyOh — Where every Tally tells a Story',
  description: 'A financial literacy adventure app for kids ages 4-10.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${beVietnam.variable} scroll-smooth`}>
      <body className="bg-surface text-on-primary-fixed font-body antialiased">
        {children}
      </body>
    </html>
  )
}
```

**Step 4: Verify**

```bash
npm run dev
```

Page should render with warm cream background.

**Step 5: Commit**

```bash
git add src/lib/fonts.ts src/app/globals.css src/app/layout.tsx
git commit -m "feat: configure Tailwind design system with TallyOh tokens and fonts"
```

---

### Task 5: Install shadcn/ui

**Step 1: Initialize shadcn**

```bash
npx shadcn@latest init
```

Select: New York style, Zinc base color, CSS variables = yes.

**Step 2: Install core components for admin**

```bash
npx shadcn@latest add button card table input label dialog dropdown-menu sidebar tabs badge separator avatar sheet toast
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: install shadcn/ui with core admin components"
```

---

## Phase 2: Admin Portal

### Task 6: Admin Login Page

**Files:**
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/login/actions.ts`

**Step 1: Create login server action**

```typescript
// src/app/admin/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: error.message }
  }

  // Verify they're an admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication failed' }

  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!admin) {
    await supabase.auth.signOut()
    return { error: 'Not authorized as admin' }
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
```

**Step 2: Create login page**

```typescript
// src/app/admin/login/page.tsx
'use client'

import { useState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <img src="/logo-nav.png" alt="TallyOh" className="h-12 mx-auto mb-2" />
          <CardTitle className="font-display text-xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 3: Verify**

Visit http://localhost:3000/admin/login — should see login form.

**Step 4: Commit**

```bash
git add src/app/admin/
git commit -m "feat: add admin login page with Supabase auth"
```

---

### Task 7: Admin Layout with Sidebar

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/(dashboard)/layout.tsx`
- Create: `src/components/admin/admin-sidebar.tsx`

**Step 1: Create admin root layout (wraps everything including login)**

```typescript
// src/app/admin/layout.tsx
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

**Step 2: Create admin sidebar component**

```typescript
// src/components/admin/admin-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Target,
  Coins,
  ShoppingBag,
  PawPrint,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { logout } from '@/app/admin/login/actions'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users & Families', icon: Users },
  { href: '/admin/characters', label: 'Characters', icon: PawPrint },
  { href: '/admin/stories', label: 'Stories', icon: BookOpen },
  { href: '/admin/missions', label: 'Missions', icon: Target },
  { href: '/admin/economy', label: 'Coin Economy', icon: Coins },
  { href: '/admin/store', label: 'Store & Rewards', icon: ShoppingBag },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-on-primary-fixed min-h-screen flex flex-col">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-3">
          <img src="/app-icon-1024.jpg" alt="TallyOh" className="w-10 h-10 rounded-xl" />
          <div>
            <span className="font-display font-bold text-white text-lg">TallyOh</span>
            <span className="block text-xs text-white/50">Admin</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 mt-auto">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/8 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
```

**Step 3: Create dashboard layout (sidebar + content area)**

```typescript
// src/app/admin/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!admin) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-surface-mid">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
```

**Step 4: Create dashboard home page**

```typescript
// src/app/admin/(dashboard)/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Target, Coins } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch counts
  const [usersRes, chaptersRes, missionsRes] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('story_chapters').select('id', { count: 'exact', head: true }),
    supabase.from('mission_templates').select('id', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Users', value: usersRes.count ?? 0, icon: Users, color: 'text-primary' },
    { label: 'Story Chapters', value: chaptersRes.count ?? 0, icon: BookOpen, color: 'text-tech-purple' },
    { label: 'Mission Templates', value: missionsRes.count ?? 0, icon: Target, color: 'text-flag-orange' },
    { label: 'Characters', value: 5, icon: Coins, color: 'text-secondary' },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-on-surface-variant">{label}</CardTitle>
              <Icon className={`w-5 h-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

**Step 5: Verify**

Login at /admin/login with admin credentials. Should see sidebar + dashboard with stat cards.

**Step 6: Commit**

```bash
git add src/app/admin/ src/components/admin/
git commit -m "feat: add admin layout with sidebar navigation and dashboard overview"
```

---

### Task 8: Characters Admin (CRUD)

**Files:**
- Create: `src/app/admin/(dashboard)/characters/page.tsx`
- Create: `src/app/admin/(dashboard)/characters/actions.ts`

This is the first full CRUD admin page. It lists all characters, lets you edit their properties (personality, catchphrase, image, etc.), and toggle unlockable status. Characters are seeded from the migration but should be editable.

**Implementation:** Server component table listing all characters. Edit via dialog/modal (shadcn Dialog). Server actions for update.

---

### Task 9: Stories Admin (CRUD)

**Files:**
- Create: `src/app/admin/(dashboard)/stories/page.tsx` (list all chapters)
- Create: `src/app/admin/(dashboard)/stories/[id]/page.tsx` (chapter editor with pages)
- Create: `src/app/admin/(dashboard)/stories/actions.ts`

**Implementation:** List view shows all chapters with publish status. Chapter detail page shows a page-by-page editor where you can add/edit/reorder story pages, add choices, set coin rewards. This is how Doug and Alexis author new story content.

---

### Task 10: Missions Admin (CRUD)

**Files:**
- Create: `src/app/admin/(dashboard)/missions/page.tsx`
- Create: `src/app/admin/(dashboard)/missions/actions.ts`

**Implementation:** Table of mission templates. Create/edit form with title, description, coin reward, type, character assignment, age range. Toggle active/inactive.

---

### Task 11: Users & Families Admin

**Files:**
- Create: `src/app/admin/(dashboard)/users/page.tsx`
- Create: `src/app/admin/(dashboard)/users/[id]/page.tsx` (user detail)

**Implementation:** Table of all users grouped by family. User detail shows profile, coin balance, story progress, mission history. This is the read-heavy operational view — Doug and Alexis use this to see how families are engaging.

---

### Task 12: Economy & Analytics Admin

**Files:**
- Create: `src/app/admin/(dashboard)/economy/page.tsx`
- Create: `src/app/admin/(dashboard)/analytics/page.tsx`

**Implementation:** Economy page shows aggregate coin stats (total in circulation, earned today, spent today). Analytics page shows user counts, active families, story completion rates, mission completion rates. Server-side queries with simple stat cards and tables — no charting library needed for v1.

---

## Phase 3: Marketing Site (Public)

### Task 13: Port Landing Page to Next.js

**Files:**
- Create: `src/app/(marketing)/page.tsx`
- Create: `src/app/(marketing)/layout.tsx`
- Create: `src/components/marketing/header.tsx`
- Create: `src/components/marketing/footer.tsx`
- Create: `src/components/marketing/hero.tsx`
- Create: `src/components/marketing/sections.tsx`

**Implementation:** Port the current `index.html` design to React Server Components. Use the design.md "Tactical Whimsy" system. Route group `(marketing)` keeps it separate from admin. Same content sections: hero video, kingdom map, adventure lands, characters, Hammy feature, how it works, parents section, origin story, download CTA, footer.

---

## Phase 4: Row-Level Security & iOS Integration

### Task 14: Supabase RLS Policies

**Files:**
- Create: `supabase/migrations/002_rls_policies.sql`

**Implementation:**
- Admins can read/write everything
- Parents can read/write their own family data
- Children can read their own data, write to their own wallet/progress
- Public can read published story chapters and character data
- No anonymous writes to any table

---

### Task 15: iOS App Supabase Integration Guide

**Files:**
- Create: `docs/plans/2026-03-22-ios-supabase-integration.md`

**Implementation:** Document how to wire the existing Swift models (`KVCharacter`, `StoryChapter`, `Mission`, `CoinWallet`) to the shared Supabase tables. Map each Swift struct to its Postgres table. Show the Supabase Swift SDK calls needed to replace the local JSON/in-memory data. This is a reference doc for the next iOS session.

---

## Execution Order

| Phase | Tasks | Dependencies |
|-------|-------|-------------|
| 1 - Foundation | Tasks 1-5 | None (start here) |
| 2 - Admin | Tasks 6-12 | Phase 1 complete + Supabase project created |
| 3 - Marketing | Task 13 | Phase 1 complete |
| 4 - Integration | Tasks 14-15 | Phase 2 complete |

**Phase 1 is the critical path.** Task 1 requires Doug to create a Supabase project first.

**Phase 2 and 3 can run in parallel** once foundation is done.

---

## Doug Must Do Before Starting

1. **Create a Supabase project** at https://supabase.com/dashboard
2. **Note the project URL** and **anon key** and **service role key** (Settings > API)
3. **Create your admin user** in Supabase Auth (Authentication > Users > Add User) with your email/password
4. **Insert yourself into the admins table** after running the migration:
   ```sql
   INSERT INTO admins (id, email, display_name)
   VALUES ('your-auth-user-uuid', 'doug@tallyohkids.com', 'Doug Kvamme');
   ```
5. Add Alexis the same way.

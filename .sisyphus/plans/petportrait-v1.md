# PetPortrait V1 — Consumer AI Pet Portrait Web App

## TL;DR

> **Quick Summary**: Build a consumer web app where users sign up, upload pet photos, generate AI art portraits (via Seedream), and share a public gallery page. Freemium with 5 free generations/month. Fresh Next.js + Supabase + Vercel project targeting Chinese market first.
> 
> **Deliverables**:
> - Landing page with examples and sign-up CTA
> - Auth flow (Google OAuth + email/password via Supabase)
> - AI generation page: upload photo → pick preset style or custom prompt → generate portrait
> - Personal gallery dashboard with grid + stack views (carrying over et-and-pamelo's UX)
> - Public gallery at `/u/[username]` with OG tags for sharing
> - Rate limiting (5 generations/month free tier)
> 
> **Estimated Effort**: Medium (2-3 weeks)
> **Parallel Execution**: YES — 5 waves, max 4 concurrent agents
> **Critical Path**: Scaffold → Auth → Upload + AI Gen → Create Page → Final QA

---

## Context

### Original Request
User has a personal pet photo gallery (et-and-pamelo) for cats E.T. and Pomelo. Built with vanilla HTML/JS on Vercel with GitHub as CMS and a Seedream AI image generation integration. Wants to turn this into a consumer product where anyone can create AI pet portraits and share them.

### Interview Summary
**Key Discussions**:
- **Scale**: Consumer product at Product Hunt level (thousands of users)
- **Core hook**: Both AI pet portraits AND beautiful gallery are equally important
- **Platform**: Initially wanted native app, accepted web-first recommendation
- **Monetization**: Freemium — free tier with 5 generations/month, payments deferred to V1.1
- **Social model**: Shareable but not social — public gallery URL, no community feed
- **AI provider**: Flexible; keeping Seedream for V1 (Chinese market first), easy swap later
- **Generation UX**: Preset styles + custom prompt option
- **Developer profile**: Vibe coder (AI-assisted, minimal framework experience)
- **Timeline**: 2-4 weeks for MVP
- **Starting point**: Fresh repo, new project (keep old site as-is)

**Research Findings**:
- Current AI provider (Seedream/Volcengine) uses China-region endpoint (`ark.cn-beijing.volces.com`) — works for Chinese market, will need swap for international
- GitHub-as-CMS won't survive multi-user (race conditions, rate limits)
- The "stack" card-flicking UX is a unique differentiator worth carrying over
- Supabase free tier storage (1GB) runs out immediately at scale — must plan for Pro ($25/mo)

### Metis Review
**Identified Gaps** (addressed):
- AI provider is China-only → targeting Chinese market first, so this is fine for V1
- Generation wait UX → synchronous with loading animation, 60s timeout
- Storage costs → plan for Supabase Pro tier
- Month reset logic → calendar month (1st UTC)
- Username moderation → use user-chosen display name with simple validation
- Framework complexity for vibe coder → Next.js App Router with TS; code must be simple and flat
- Retry policy → regeneration counts as another generation (no free retries)

---

## Work Objectives

### Core Objective
Build a multi-user web app where anyone can create AI-generated pet portraits and share them via a personal gallery URL.

### Concrete Deliverables
- New Next.js project at `/Users/ianvs/Documents/Projects/petportrait/`
- Deployed to Vercel with custom domain-ready config
- Supabase project with auth, database, and storage configured
- 6 pages: landing, login, signup, dashboard (gallery), create (generate), public gallery
- 1 API route: `/api/generate` (Seedream proxy with rate limiting)
- Gallery components: grid view, stack view, lightbox with transitions

### Definition of Done
- [ ] `npx next build` exits 0 with no TypeScript errors
- [ ] All Playwright QA scenarios pass
- [ ] A new user can: sign up → upload pet photo → generate portrait → see it in gallery → share public URL
- [ ] 6th generation in a month returns 429 error
- [ ] Public gallery URL returns correct OG meta tags
- [ ] Mobile responsive (works on 375px width)

### Must Have
- Supabase Auth with Google OAuth and email/password
- AI generation via Seedream (OpenAI-compatible API) with 60s timeout
- Gallery with grid + stack views carrying over et-and-pamelo's design language
- Lightbox with FLIP animation and swipe/keyboard navigation
- Card-flick gesture in stack mode (directional physics)
- Rate limiting: 5 generations/month, calendar month reset
- Public gallery at `/u/[username]` with OG tags
- Preset style selector (6-8 styles) + custom prompt input
- Loading animation during generation (10-60s wait)
- JPEG output (not PNG) to save storage
- Mobile-responsive (3→2→1 column grid at 1024px/640px breakpoints)
- Error boundary with user-facing messages (not stack traces)

### Must NOT Have (Guardrails)
- ❌ No social features (comments, likes, follow, feed, discover)
- ❌ No payment/subscription UI or Stripe integration (V1.1)
- ❌ No admin panel (use Supabase dashboard)
- ❌ No multiple AI provider abstraction (hardcode Seedream, single file for easy swap)
- ❌ No analytics, email marketing, or notification systems
- ❌ No image editing/cropping before generation
- ❌ No background job queue (sync generation only)
- ❌ No retry queues or circuit breakers for AI calls
- ❌ No JSDoc on every function — code should be self-documenting
- ❌ No utility files for things used once — inline it
- ❌ No repository pattern — direct Supabase client calls
- ❌ No more than 3 levels of component nesting
- ❌ No loading skeletons on every component (only generation wait + gallery load)
- ❌ No 3D model support (images only)
- ❌ No video generation
- ❌ No native app / PWA

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (fresh project)
- **Automated tests**: None — vibe coder project, rely entirely on Agent-Executed QA
- **Framework**: N/A
- **QA is primary verification method**: Every task has Playwright or curl-based QA scenarios

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

| Deliverable Type | Verification Tool | Method |
|------------------|-------------------|--------|
| Frontend/UI | Playwright (playwright skill) | Navigate, interact, assert DOM, screenshot |
| API/Backend | Bash (curl) | Send requests, assert status + response fields |
| Auth flows | Playwright + curl | Sign up, login, protected route redirect |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — sequential, must complete first):
└── Task 1: Scaffold Next.js + Supabase + Vercel + design tokens [unspecified-high]

Wave 2 (Core — 4 parallel after Wave 1):
├── Task 2: Auth (Google OAuth + email + middleware) [unspecified-high]
├── Task 3: Gallery UX components (grid + stack + lightbox) [visual-engineering]
├── Task 4: Style presets data + selector UI [quick]
└── Task 5: Landing page [visual-engineering]

Wave 3 (Integration — 3 parallel after Wave 2):
├── Task 6: Image upload + Supabase Storage [unspecified-high]
├── Task 7: AI generation API route (Seedream proxy) [deep]
└── Task 8: Public gallery /u/[username] [unspecified-high]

Wave 4 (Full flow — 2 parallel after Wave 3):
├── Task 9: Create page (full generation flow UI) [visual-engineering]
└── Task 10: Rate limiting + generation counter UI [unspecified-low]

Wave FINAL (Review — 4 parallel after ALL):
├── F1: Plan compliance audit [oracle]
├── F2: Code quality review [unspecified-high]
├── F3: Full QA walkthrough [unspecified-high]
└── F4: Scope fidelity check [deep]

Critical Path: T1 → T2 → T6 → T7 → T9 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 4 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|------------|--------|------|
| 1: Scaffold | — | 2, 3, 4, 5 | 1 |
| 2: Auth | 1 | 6, 7, 8 | 2 |
| 3: Gallery UX | 1 | 8, 9 | 2 |
| 4: Style presets | 1 | 9 | 2 |
| 5: Landing page | 1 | — | 2 |
| 6: Upload + Storage | 2 | 9 | 3 |
| 7: AI Gen API | 2 | 9, 10 | 3 |
| 8: Public gallery | 2, 3 | — | 3 |
| 9: Create page | 3, 4, 6, 7 | — | 4 |
| 10: Rate limiting | 2, 7 | — | 4 |
| F1-F4 | ALL | — | FINAL |

### Agent Dispatch Summary

| Wave | # Parallel | Tasks → Agent Category |
|------|------------|----------------------|
| 1 | 1 | T1 → `unspecified-high` |
| 2 | **4** | T2 → `unspecified-high`, T3 → `visual-engineering`, T4 → `quick`, T5 → `visual-engineering` |
| 3 | **3** | T6 → `unspecified-high`, T7 → `deep`, T8 → `unspecified-high` |
| 4 | **2** | T9 → `visual-engineering`, T10 → `unspecified-low` |
| FINAL | **4** | F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep` |

---

## TODOs

- [ ] 1. Scaffold Next.js + Supabase Project + Design System

  **What to do**:
  - Run `npx create-next-app@latest petportrait --typescript --tailwind --app --src-dir --use-npm` in `/Users/ianvs/Documents/Projects/`
  - Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`
  - Create Supabase project (or use existing) — configure environment variables in `.env.local`:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `SEEDREAM_API_URL=https://ark.cn-beijing.volces.com/api/v3/images/generations`
    - `SEEDREAM_API_KEY`
    - `SEEDREAM_MODEL` (or endpoint ID)
  - Create Supabase client utilities: `src/lib/supabase/client.ts` (browser), `src/lib/supabase/server.ts` (server)
  - Set up database schema via Supabase SQL editor:
    ```sql
    -- Users profile (extends Supabase auth.users)
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      username TEXT UNIQUE NOT NULL,
      display_name TEXT,
      avatar_url TEXT,
      generation_count INT DEFAULT 0,
      generation_reset_at TIMESTAMPTZ DEFAULT date_trunc('month', NOW() AT TIME ZONE 'UTC') + INTERVAL '1 month',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- Gallery items (both originals and portraits)
    CREATE TABLE gallery_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('original', 'portrait')),
      image_url TEXT NOT NULL,
      original_id UUID REFERENCES gallery_items(id),
      prompt TEXT,
      style TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- RLS policies
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
    
    -- Profiles: users can read all, update own
    CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
    CREATE POLICY "Users update own" ON profiles FOR UPDATE USING (auth.uid() = id);
    
    -- Gallery: public read, user CRUD own
    CREATE POLICY "Public gallery" ON gallery_items FOR SELECT USING (true);
    CREATE POLICY "Users insert own" ON gallery_items FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users delete own" ON gallery_items FOR DELETE USING (auth.uid() = user_id);
    ```
  - Create Supabase Storage buckets: `originals` (private), `portraits` (public)
  - Set up Tailwind with design tokens matching et-and-pamelo:
    - Background: `#ffffff`
    - Border radius: `24px` (use `rounded-3xl`)
    - Font: PingFang SC, system-ui stack
    - Grid gap: `24px` (use `gap-6`)
    - Responsive breakpoints: 3 cols > 1024px, 2 cols > 640px, 1 col mobile
  - Create basic layout: `src/app/layout.tsx` with font config, global styles
  - Create placeholder pages: `/`, `/login`, `/dashboard`, `/create`, `/u/[username]`
  - Initialize git repo, push to GitHub, deploy to Vercel
  - Verify empty shell deploys and loads

  **Must NOT do**:
  - Do NOT add any auth logic yet (just placeholder pages)
  - Do NOT install analytics, Sentry, or monitoring
  - Do NOT create an admin panel

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Involves project scaffolding, database setup, and deployment — multi-concern setup task
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Design system setup with specific visual requirements

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: Tasks 2, 3, 4, 5
  - **Blocked By**: None (starting task)

  **References**:

  **Pattern References** (existing code to follow):
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/assets/styles.css` — Design tokens: `#fff` bg, system font stack, 3→2→1 responsive grid, 24px gap, 24px border-radius
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/index.html:10-16` — Inline styles with PingFang SC font, page title positioning, media query breakpoints

  **API/Type References**:
  - Database schema defined above in the "What to do" section — use this exact SQL

  **External References**:
  - Supabase + Next.js quickstart: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
  - Supabase Auth with SSR: https://supabase.com/docs/guides/auth/server-side/nextjs

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Project builds and deploys successfully
    Tool: Bash
    Preconditions: Project created in /Users/ianvs/Documents/Projects/petportrait/
    Steps:
      1. cd /Users/ianvs/Documents/Projects/petportrait/ && npm run build
      2. Assert exit code 0
      3. Assert no TypeScript errors in output
    Expected Result: Build succeeds with 0 errors
    Failure Indicators: Non-zero exit code, TypeScript errors
    Evidence: .sisyphus/evidence/task-1-build-success.txt

  Scenario: Dev server starts and pages load
    Tool: Playwright (playwright skill)
    Preconditions: npm run dev running on localhost:3000
    Steps:
      1. Navigate to http://localhost:3000 → assert page loads (status 200)
      2. Navigate to http://localhost:3000/login → assert page loads
      3. Navigate to http://localhost:3000/dashboard → assert page loads
      4. Navigate to http://localhost:3000/create → assert page loads
      5. Take screenshots of each
    Expected Result: All 4 pages return 200 and render content
    Evidence: .sisyphus/evidence/task-1-pages-load.png

  Scenario: Supabase connection works
    Tool: Bash (curl)
    Preconditions: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY set
    Steps:
      1. curl -s "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?select=count" -H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" -H "Authorization: Bearer ${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
      2. Assert response is valid JSON (not an error)
    Expected Result: Returns empty array or count, confirming table exists and connection works
    Evidence: .sisyphus/evidence/task-1-supabase-connection.txt
  ```

  **Commit**: YES
  - Message: `feat: scaffold Next.js + Supabase project with design system`
  - Files: entire project
  - Pre-commit: `npm run build`

---

- [ ] 2. Authentication (Google OAuth + Email/Password)

  **What to do**:
  - Configure Supabase Auth providers: Google OAuth, email/password
  - Create Supabase auth middleware in `src/middleware.ts` — refresh session on every request
  - Build login page `/login` with: Google sign-in button, email/password form, link to signup
  - Build signup page `/signup` with: email, password, username (auto-generated from email prefix, editable), display name
  - On signup: create `profiles` row via Supabase trigger or client-side insert
  - Create auth context/provider to expose current user throughout the app
  - Protect `/dashboard` and `/create` routes — redirect to `/login` if unauthenticated
  - Add logout functionality
  - Add a basic nav bar showing user avatar + display name + logout when authenticated

  **Must NOT do**:
  - No "forgot password" flow (V1.1)
  - No profile editing page (V1.1)
  - No phone verification
  - No magic link auth

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Auth involves middleware, multiple pages, database triggers, and provider configuration
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Login/signup UI needs to match the clean, white design language

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4, 5)
  - **Blocks**: Tasks 6, 7, 8
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/admin.html:7-21` — Clean form styling: `.panel` with white bg, border, 12px radius; `.row` grid layout; `.btn` with #111 bg, white text, 10px radius

  **External References**:
  - Supabase Auth with Next.js App Router: https://supabase.com/docs/guides/auth/server-side/nextjs
  - Supabase Google OAuth setup: https://supabase.com/docs/guides/auth/social-login/auth-google

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Unauthenticated user redirected from /dashboard
    Tool: Playwright
    Preconditions: No active session
    Steps:
      1. Navigate to http://localhost:3000/dashboard
      2. Assert URL contains "/login" (redirected)
    Expected Result: User is redirected to /login
    Evidence: .sisyphus/evidence/task-2-redirect.png

  Scenario: Email signup creates account and profile
    Tool: Playwright
    Preconditions: Clean database state
    Steps:
      1. Navigate to http://localhost:3000/signup
      2. Fill email: "test@example.com", password: "TestPass123!", username: "testuser", display name: "Test User"
      3. Click signup button
      4. Assert redirect to /dashboard (or email confirmation message depending on Supabase config)
    Expected Result: Account created, profile row exists
    Evidence: .sisyphus/evidence/task-2-signup-flow.png

  Scenario: Login with valid credentials
    Tool: Playwright
    Preconditions: Account exists for test@example.com
    Steps:
      1. Navigate to /login
      2. Enter email and password
      3. Click login
      4. Assert redirect to /dashboard
      5. Assert nav bar shows "Test User" display name
    Expected Result: User lands on dashboard with their name showing
    Evidence: .sisyphus/evidence/task-2-login-success.png

  Scenario: Unauthenticated API access rejected
    Tool: Bash (curl)
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/generate
      2. Assert status is 401 or 405
    Expected Result: API rejects unauthenticated request
    Evidence: .sisyphus/evidence/task-2-api-auth.txt
  ```

  **Commit**: YES
  - Message: `feat: add auth (Google OAuth + email) with protected routes`
  - Files: `src/middleware.ts`, `src/app/login/`, `src/app/signup/`, `src/lib/supabase/`, `src/components/nav.tsx`
  - Pre-commit: `npm run build`

---

- [ ] 3. Gallery UX Components (Grid + Stack + Lightbox)

  **What to do**:
  - Create React component `GalleryGrid` that renders gallery items in a responsive grid (3→2→1 cols)
  - Each gallery item has random slight rotation (`±0.8°`) and offset (`±2px`) via CSS variables — matching et-and-pamelo
  - Add wobble hover animation: `±1.4° rotation + 1.02 scale` over `900ms`
  - Add intersection observer for scroll-in fade animation (opacity 0→1, translateY 12px→0)
  - Create `Lightbox` component:
    - FLIP animation from card position to center
    - Left/right half-screen click zones for navigation
    - Keyboard navigation (ArrowLeft, ArrowRight, Escape)
    - Touch swipe for mobile (>40px horizontal → nav, >60px down → close)
    - Slide transition between images (card shifts 1/3 width + fade)
  - Create `StackView` component:
    - Cards pile center-screen with random rotation (`±9°`) and slight jitter (`±3px`)
    - z-index stacking with shadow depth
    - Click-to-flick: ghost clone animates toward click direction (`520ms cubic-bezier(0.22,0.61,0.36,1)`)
    - Top card removed from stack, next card revealed
  - Create `ViewToggle` component: grid/stack buttons fixed at bottom center
  - ALL components should accept a `GalleryItem[]` prop with `{id, imageUrl, type, createdAt}`
  - Components must work standalone with mock data (no auth/database dependency)

  **Must NOT do**:
  - No 3D model or video support (images only)
  - No infinite scroll or pagination (load all items for V1)
  - No drag-to-reorder
  - No framer-motion (use Web Animations API directly, matching the original)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Heavily animation/interaction-focused with specific physics and timing requirements
  - **Skills**: [`frontend-ui-ux`, `frontend-design`]
    - `frontend-ui-ux`: Complex UI interactions with gesture handling
    - `frontend-design`: Visual polish with specific design language

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 4, 5)
  - **Blocks**: Tasks 8, 9
  - **Blocked By**: Task 1

  **References**:

  **Pattern References** (CRITICAL — these are the design spec):
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/index.html:17-70` — ALL CSS for gallery items, lightbox, stack mode, animations, wobble, view switch. This is the canonical reference.
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/index.html:96-105` — IntersectionObserver for scroll-in animation
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/index.html:192-271` — Lightbox: open with FLIP, close, nav with slide transition
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/index.html:278-342` — Stack mode: toStack() with jitter/rotation/shadow, toGrid() reset
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/index.html:345-401` — handleStackClick(): ghost clone, directional velocity calculation, 520ms fly-out animation. THIS IS THE SIGNATURE INTERACTION.
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/index.html:450-482` — Touch/swipe handling for lightbox
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/assets/styles.css` — Grid layout: `repeat(3, minmax(260px, 1fr))`, gap 24px, responsive breakpoints

  **WHY Each Reference Matters**:
  - Lines 17-70: These inline styles define EVERY visual detail — border-radius, shadow depths, animation keyframes, transition timing. Don't guess — copy the values.
  - Lines 345-401: The card-flick is the product's signature moment. The physics must feel identical: click position → direction vector → ghost clone → travel distance = 0.9 × viewport → spin proportional to direction.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Grid renders with correct columns
    Tool: Playwright
    Preconditions: Gallery component rendered with 6 mock items
    Steps:
      1. Navigate to test page at viewport width 1200px
      2. Assert grid has 3 columns (check computed grid-template-columns)
      3. Resize to 900px → assert 2 columns
      4. Resize to 500px → assert 1 column
      5. Assert each item has slight random rotation (check CSS variable --rot exists)
    Expected Result: Responsive grid with rotation on items
    Evidence: .sisyphus/evidence/task-3-grid-responsive.png

  Scenario: Lightbox opens and navigates
    Tool: Playwright
    Preconditions: Gallery with 4 mock items
    Steps:
      1. Click first gallery item
      2. Assert lightbox overlay appears (selector: .lightbox.show or equivalent)
      3. Click right half of screen → assert second image shown
      4. Press ArrowLeft → assert first image shown
      5. Press Escape → assert lightbox closes
    Expected Result: Lightbox with full navigation
    Evidence: .sisyphus/evidence/task-3-lightbox-nav.png

  Scenario: Stack mode card flick
    Tool: Playwright
    Preconditions: Gallery with 4 mock items in stack mode
    Steps:
      1. Click stack toggle button
      2. Assert cards are piled (all items have 'stacked' class or equivalent)
      3. Click anywhere on the pile
      4. Assert top card animates out (ghost element created and removed after ~520ms)
      5. Assert next card is now on top
    Expected Result: Card flicks away in click direction, next card appears
    Evidence: .sisyphus/evidence/task-3-stack-flick.png
  ```

  **Commit**: YES
  - Message: `feat: gallery components with grid, stack, lightbox, and card-flick`
  - Files: `src/components/gallery/`
  - Pre-commit: `npm run build`

---

- [ ] 4. Style Presets Data + Selector UI

  **What to do**:
  - Create a preset styles data file `src/lib/presets.ts` with 6-8 style options:
    ```ts
    export const STYLE_PRESETS = [
      { id: 'oil-painting', name: '油画风', nameEn: 'Oil Painting', prompt: 'Transform this pet photo into a classical oil painting style portrait, rich colors, visible brushstrokes, museum quality' },
      { id: 'anime', name: '动漫风', nameEn: 'Anime', prompt: 'Transform this pet into an anime character style, Studio Ghibli inspired, soft colors, expressive eyes' },
      { id: 'astronaut', name: '太空宇航员', nameEn: 'Astronaut', prompt: 'Transform this pet into an astronaut floating in space, wearing a space suit, stars and nebula background' },
      { id: 'renaissance', name: '文艺复兴', nameEn: 'Renaissance', prompt: 'Transform this pet into a Renaissance oil painting, wearing noble clothing, dramatic lighting, ornate frame' },
      { id: 'watercolor', name: '水彩', nameEn: 'Watercolor', prompt: 'Transform this pet photo into a delicate watercolor painting, soft washes of color, white paper showing through' },
      { id: 'cyberpunk', name: '赛博朋克', nameEn: 'Cyberpunk', prompt: 'Transform this pet into a cyberpunk character, neon lights, futuristic city background, holographic effects' },
      { id: 'pixel-art', name: '像素风', nameEn: 'Pixel Art', prompt: 'Transform this pet into pixel art style, 16-bit retro game aesthetic, vibrant colors, clean pixels' },
      { id: 'custom', name: '自定义', nameEn: 'Custom', prompt: '' },
    ]
    ```
  - Create `StyleSelector` component: horizontal scrollable row of style cards
  - Each card shows: style name (Chinese) + small example icon/emoji
  - Selected state: darker border, slight scale-up
  - "Custom" option reveals a text input for free-form prompt
  - Component exports selected style ID and the resolved prompt string

  **Must NOT do**:
  - No example images for each style (just text labels + emoji for V1)
  - No style preview/generation
  - No more than 8 presets

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple data file + one UI component
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Component needs to match design language

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 3, 5)
  - **Blocks**: Task 9
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/index.html:59-66` — View switch buttons: `44px` circle buttons, `rgba(255,255,255,0.9)` bg, active state `#111` bg, hover lift. Use similar treatment for style cards.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Style selector displays all presets
    Tool: Playwright
    Preconditions: StyleSelector rendered standalone
    Steps:
      1. Assert 8 style options visible (including "Custom")
      2. Assert first option "油画风" is visible
      3. Assert last option "自定义" is visible
    Expected Result: All 8 presets render
    Evidence: .sisyphus/evidence/task-4-presets-render.png

  Scenario: Custom prompt input appears
    Tool: Playwright
    Steps:
      1. Click "自定义" (Custom) option
      2. Assert text input field appears
      3. Type "把我的猫变成海盗" into the input
      4. Assert the component's resolved prompt equals the typed text
    Expected Result: Custom prompt mode works
    Evidence: .sisyphus/evidence/task-4-custom-prompt.png
  ```

  **Commit**: YES (group with Task 3 if they finish together)
  - Message: `feat: style presets data and selector component`
  - Files: `src/lib/presets.ts`, `src/components/style-selector.tsx`
  - Pre-commit: `npm run build`

---

- [ ] 5. Landing Page

  **What to do**:
  - Create marketing landing page at `/` (root route)
  - Hero section: large headline "给你的宠物一个艺术肖像" / "AI Pet Portraits", subtext describing the value prop
  - Show 4-6 example before/after pairs (use placeholder images or the existing et-and-pamelo images as examples)
  - "Get Started" CTA button → links to `/signup`
  - How it works section: 3 steps (Upload → Choose Style → Get Portrait)
  - If user is already logged in, redirect to `/dashboard` or show "Go to Dashboard" CTA instead
  - Mobile responsive
  - Match et-and-pamelo's white, clean aesthetic

  **Must NOT do**:
  - No pricing section (no payments in V1)
  - No testimonials or social proof (no users yet)
  - No animation beyond simple fade-in on scroll

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Marketing page needs visual polish
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Landing page visual quality

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 3, 4)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/index.html:107-145` — Splash intro pattern: hero element with scale-up animation. Landing page can use similar dramatic image presentation.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Landing page loads and renders
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/
      2. Assert headline text contains "宠物" or "Pet Portrait"
      3. Assert CTA button exists with link to /signup
      4. Take screenshot at 1200px width
      5. Take screenshot at 375px width (mobile)
    Expected Result: Landing page renders on desktop and mobile
    Evidence: .sisyphus/evidence/task-5-landing-desktop.png, .sisyphus/evidence/task-5-landing-mobile.png
  ```

  **Commit**: YES
  - Message: `feat: landing page with hero, examples, and CTA`
  - Files: `src/app/page.tsx`
  - Pre-commit: `npm run build`

---

- [ ] 6. Image Upload + Supabase Storage

  **What to do**:
  - Create upload component with drag-and-drop + file picker (match admin.html's `.drop` pattern)
  - Client-side image validation: accept only JPEG/PNG/WebP, max 10MB
  - Client-side resize: scale down to max 2048px on longest edge (canvas API)
  - Convert to JPEG before upload (quality 85) to save storage
  - Upload to Supabase Storage bucket `originals` with path: `{user_id}/{uuid}.jpg`
  - Create `gallery_items` record with `type: 'original'`
  - Show upload preview before confirming
  - Display upload progress (Supabase Storage supports progress callbacks)
  - Create `src/lib/upload.ts` with the upload logic (reusable)

  **Must NOT do**:
  - No image cropping or editing
  - No multi-file upload
  - No camera capture (just file picker)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Involves Supabase Storage, client-side image processing, and database writes
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: Task 9
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/admin.html:35-39` — Drop zone UI pattern: dashed border, centered text, overlay input
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/admin.html:120-147` — toBase64(), isImageFile(), renderUploadPreview() patterns

  **External References**:
  - Supabase Storage upload: https://supabase.com/docs/guides/storage/uploads

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Upload image successfully
    Tool: Playwright
    Preconditions: Logged in as test user
    Steps:
      1. Navigate to upload component (on /create page or test page)
      2. Upload a JPEG test image (< 5MB)
      3. Assert preview image appears
      4. Confirm upload
      5. Assert success message or image appears in gallery
    Expected Result: Image uploaded to Supabase and record created
    Evidence: .sisyphus/evidence/task-6-upload-success.png

  Scenario: Reject oversized file
    Tool: Playwright
    Preconditions: Logged in
    Steps:
      1. Attempt to upload a file > 10MB
      2. Assert error message about file size appears
    Expected Result: Upload rejected with clear error
    Evidence: .sisyphus/evidence/task-6-oversize-error.png
  ```

  **Commit**: YES
  - Message: `feat: image upload with resize, preview, and Supabase Storage`
  - Files: `src/components/upload.tsx`, `src/lib/upload.ts`
  - Pre-commit: `npm run build`

---

- [ ] 7. AI Generation API Route (Seedream Proxy)

  **What to do**:
  - Create API route `src/app/api/generate/route.ts`:
    - Accept POST with `{ imageUrl: string, prompt: string, style: string }`
    - Validate auth (reject 401 if not logged in)
    - Check generation count: if `generation_count >= 5` AND `generation_reset_at > now()`, return 429 with `{ remaining: 0, resetAt }`
    - If `generation_reset_at <= now()`, reset counter to 0 and update `generation_reset_at` to next month
    - Download original image from Supabase Storage URL
    - Call Seedream API (OpenAI-compatible images/generations format):
      ```ts
      const response = await fetch(process.env.SEEDREAM_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SEEDREAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: resolvedPrompt,
          image: imageBase64OrUrl,
          model: process.env.SEEDREAM_MODEL,
          size: '1024x1024',
          response_format: 'b64_json',
          watermark: false,
        }),
      })
      ```
    - Convert response b64_json to JPEG buffer
    - Upload result to Supabase Storage bucket `portraits` at `{user_id}/{uuid}.jpg`
    - Create `gallery_items` record with `type: 'portrait'`, link to `original_id`
    - Increment `generation_count`
    - Return `{ success: true, portraitUrl, remaining: 5 - newCount }`
    - 60-second timeout on the AI call
    - Simple try-catch error handling — return user-friendly error message
  - Keep ALL Seedream logic in this single file (easy to swap provider later)

  **Must NOT do**:
  - No background job queue — synchronous only
  - No retry logic or circuit breaker
  - No abstract provider interface
  - No multiple output images (1 result per generation)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Most complex backend task — auth, rate limiting, external API, storage, database all in one route
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 8)
  - **Blocks**: Tasks 9, 10
  - **Blocked By**: Task 2

  **References**:

  **Pattern References** (CRITICAL):
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/api/seedream.js` — The ENTIRE file is the reference. Lines 35-80 show the `images/generations` JSON flow. Copy this pattern exactly, adapting for Next.js App Router route format.
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/api/seedream.js:36-79` — Payload construction, response parsing, error handling. Use these exact field names.

  **WHY Each Reference Matters**:
  - The existing seedream.js is battle-tested with Volcengine/Ark. Don't reinvent — adapt to Next.js route handler format and add auth + rate limiting.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Authenticated generation succeeds
    Tool: Bash (curl)
    Preconditions: User logged in with valid session, test image uploaded
    Steps:
      1. POST /api/generate with valid auth cookie, imageUrl, and style "oil-painting"
      2. Assert response status 200
      3. Assert response contains { success: true, portraitUrl: "https://...", remaining: N }
      4. Assert portraitUrl is accessible (curl returns 200)
    Expected Result: Portrait generated and stored
    Evidence: .sisyphus/evidence/task-7-generation-success.txt

  Scenario: Unauthenticated request rejected
    Tool: Bash (curl)
    Steps:
      1. POST /api/generate without auth cookie
      2. Assert response status 401
    Expected Result: Rejected with 401
    Evidence: .sisyphus/evidence/task-7-unauth-rejected.txt

  Scenario: Rate limit enforced (6th generation)
    Tool: Bash (curl)
    Preconditions: User has generation_count = 5
    Steps:
      1. POST /api/generate with valid auth
      2. Assert response status 429
      3. Assert response contains { remaining: 0, resetAt: "..." }
    Expected Result: 429 with reset date
    Evidence: .sisyphus/evidence/task-7-rate-limit.txt
  ```

  **Commit**: YES
  - Message: `feat: AI generation API route with Seedream proxy and rate limiting`
  - Files: `src/app/api/generate/route.ts`
  - Pre-commit: `npm run build`

---

- [ ] 8. Public Gallery Page `/u/[username]`

  **What to do**:
  - Create dynamic route `src/app/u/[username]/page.tsx`
  - Server-side: fetch user profile by username, fetch their gallery items (portraits only, ordered by created_at desc)
  - If username not found: show 404 page
  - Render gallery using the `GalleryGrid` component from Task 3
  - Include view toggle (grid/stack) — same as dashboard
  - Add OG meta tags for social sharing:
    - `og:title`: "[Display Name]'s Pet Portraits"
    - `og:image`: first portrait image URL
    - `og:description`: "Check out my AI pet portraits on PetPortrait"
  - Add "Create Your Own Portraits" CTA button linking to `/signup` (for non-logged-in visitors)
  - If the viewing user IS the gallery owner, show a link back to dashboard instead
  - No auth required to view (public page)

  **Must NOT do**:
  - No comments, likes, or social interactions
  - No follow functionality
  - No edit/delete from public page (only from dashboard)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: SSR page with database queries, OG tags, and component integration
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Public-facing page needs polish

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 6, 7)
  - **Blocks**: None
  - **Blocked By**: Tasks 2, 3

  **References**:

  **Pattern References**:
  - Gallery component from Task 3 — reuse as-is
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/index.html:74-84` — Gallery container + lightbox structure

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Public gallery renders for existing user
    Tool: Playwright
    Preconditions: User "testuser" exists with 3 portraits
    Steps:
      1. Navigate to http://localhost:3000/u/testuser (not logged in)
      2. Assert page title contains "testuser" or display name
      3. Assert 3 gallery items rendered
      4. Assert "Create Your Own" CTA button visible
    Expected Result: Public gallery renders without auth
    Evidence: .sisyphus/evidence/task-8-public-gallery.png

  Scenario: 404 for nonexistent user
    Tool: Bash (curl)
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/u/nonexistentuser12345
      2. Assert status 404
    Expected Result: Returns 404, never 500
    Evidence: .sisyphus/evidence/task-8-404.txt

  Scenario: OG tags present for social sharing
    Tool: Bash (curl)
    Preconditions: User "testuser" has at least 1 portrait
    Steps:
      1. curl -s http://localhost:3000/u/testuser
      2. Assert response contains 'og:title' meta tag
      3. Assert response contains 'og:image' meta tag with portrait URL
    Expected Result: OG tags present for link previews
    Evidence: .sisyphus/evidence/task-8-og-tags.txt
  ```

  **Commit**: YES
  - Message: `feat: public gallery page with OG tags and CTA`
  - Files: `src/app/u/[username]/page.tsx`
  - Pre-commit: `npm run build`

---

- [ ] 9. Create Page (Full Generation Flow UI)

  **What to do**:
  - Build the `/create` page that orchestrates the full generation flow:
    1. **Step 1 - Upload**: Show upload component (from Task 6). User picks a pet photo. Show preview.
    2. **Step 2 - Style**: Show style selector (from Task 4). User picks a preset or writes custom prompt.
    3. **Step 3 - Generate**: User clicks "Generate" button. Show loading state with fun animation (spinning paw print, progress text like "Your pet is being transformed... 🐱✨"). 60-second timeout with error message if exceeded.
    4. **Step 4 - Result**: Show the generated portrait. "Save to Gallery" button (creates gallery_item). "Generate Again" button (goes back to step 2 with same image, costs another generation).
  - Show remaining generations counter: "3 of 5 remaining this month"
  - If 0 remaining, disable generate button with message "You've used all your free portraits this month. Premium coming soon!"
  - After saving, option to "View in Gallery" (→ /dashboard) or "Share" (→ /u/[username])
  - Mobile-friendly step flow (not a desktop wizard)
  - Loading state must be engaging — this is a 10-60 second wait

  **Must NOT do**:
  - No multi-image generation (1 at a time)
  - No image editing before or after
  - No retry that doesn't count as generation

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: The most important UX page — the loading experience is critical
  - **Skills**: [`frontend-ui-ux`, `frontend-design`]
    - `frontend-ui-ux`: Multi-step flow with state management
    - `frontend-design`: Loading animation quality matters

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 10)
  - **Blocks**: None
  - **Blocked By**: Tasks 3, 4, 6, 7

  **References**:

  **Pattern References**:
  - Upload component from Task 6
  - Style selector from Task 4
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/admin.html:51-82` — Seedream generation UI flow: prompt input, file upload, generate button, loading state ("生成中…"), result display, publish button. Adapt this flow into a polished multi-step experience.
  - `/Users/ianvs/Documents/Projects/et-and-pamelo/admin.html:221-293` — JS for generation: disable button, change text, call API, handle response, show result. Reference for client-side flow logic.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Full generation flow — happy path
    Tool: Playwright
    Preconditions: Logged in user with 5 remaining generations
    Steps:
      1. Navigate to /create
      2. Assert "5 of 5 remaining" text visible
      3. Upload a test JPEG image
      4. Assert image preview appears
      5. Select "油画风" (Oil Painting) preset
      6. Click "Generate" button
      7. Assert loading animation visible (button disabled, spinner/animation showing)
      8. Wait up to 90 seconds for result
      9. Assert portrait image appears
      10. Click "Save to Gallery"
      11. Assert success confirmation
      12. Assert counter now shows "4 of 5 remaining"
    Expected Result: Complete generation and save flow
    Evidence: .sisyphus/evidence/task-9-full-flow.png

  Scenario: Custom prompt generation
    Tool: Playwright
    Preconditions: Logged in
    Steps:
      1. Navigate to /create
      2. Upload test image
      3. Select "自定义" (Custom)
      4. Type "把我的猫变成海盗船长"
      5. Click Generate
      6. Wait for result
      7. Assert portrait appears
    Expected Result: Custom prompt works
    Evidence: .sisyphus/evidence/task-9-custom-prompt.png

  Scenario: Zero remaining blocks generation
    Tool: Playwright
    Preconditions: User has generation_count = 5
    Steps:
      1. Navigate to /create
      2. Assert "0 of 5 remaining" text visible
      3. Assert generate button is disabled
      4. Assert "Premium coming soon" message visible
    Expected Result: Generation blocked with upgrade teaser
    Evidence: .sisyphus/evidence/task-9-zero-remaining.png
  ```

  **Commit**: YES
  - Message: `feat: create page with full generation flow UI`
  - Files: `src/app/create/page.tsx`, `src/components/generation-flow.tsx`
  - Pre-commit: `npm run build`

---

- [ ] 10. Rate Limiting + Generation Counter UI on Dashboard

  **What to do**:
  - Add generation counter display to `/dashboard` header: "You have X portraits remaining this month"
  - Visual progress bar (X out of 5 filled)
  - When 0 remaining: show upgrade teaser card "Want unlimited portraits? Premium coming soon — join the waitlist"
  - Server-side rate limit enforcement (already in Task 7's API route) — this task adds the UI
  - Add monthly reset logic verification: if `generation_reset_at < now()`, reset `generation_count` to 0 on next API call
  - Add basic IP-based rate limiting on `/api/generate`: max 20 requests per hour per IP (to prevent abuse even with multiple accounts)
  - Dashboard should show the user's gallery items (portraits + originals) using the GalleryGrid from Task 3
  - Add "Create New Portrait" button that links to `/create`
  - Add "Share Gallery" button that copies `/u/[username]` URL to clipboard
  - Add delete functionality: each gallery item has a delete option (with confirmation)

  **Must NOT do**:
  - No Stripe or payment integration
  - No waitlist email collection (just a message)
  - No analytics dashboard

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Mostly UI components + simple database queries
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 9)
  - **Blocks**: None
  - **Blocked By**: Tasks 2, 7

  **References**:

  **Pattern References**:
  - Gallery component from Task 3
  - Dashboard should use same white, clean aesthetic from design system

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Dashboard shows gallery and counter
    Tool: Playwright
    Preconditions: Logged in user with 3 portraits, 2 remaining generations
    Steps:
      1. Navigate to /dashboard
      2. Assert "3 of 5 remaining" or similar counter visible
      3. Assert 3 gallery items rendered
      4. Assert "Create New Portrait" button visible
      5. Assert "Share Gallery" button visible
    Expected Result: Dashboard renders with all elements
    Evidence: .sisyphus/evidence/task-10-dashboard.png

  Scenario: Delete gallery item
    Tool: Playwright
    Preconditions: Logged in user with at least 1 gallery item
    Steps:
      1. Navigate to /dashboard
      2. Click delete on first gallery item
      3. Assert confirmation dialog appears
      4. Confirm deletion
      5. Assert item removed from gallery
    Expected Result: Item deleted with confirmation
    Evidence: .sisyphus/evidence/task-10-delete-item.png

  Scenario: Share button copies URL
    Tool: Playwright
    Preconditions: Logged in as user "testuser"
    Steps:
      1. Navigate to /dashboard
      2. Click "Share Gallery" button
      3. Assert clipboard contains URL ending in /u/testuser (or toast confirmation shown)
    Expected Result: URL copied to clipboard
    Evidence: .sisyphus/evidence/task-10-share-copy.png
  ```

  **Commit**: YES
  - Message: `feat: dashboard with gallery, generation counter, and management`
  - Files: `src/app/dashboard/page.tsx`
  - Pre-commit: `npm run build`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npx next build` (must pass). Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp), utility files for single-use functions, repository patterns.
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration: sign up → create portrait → view in dashboard → check public gallery. Test edge cases: empty gallery, expired session, very large image upload, rapid button clicks. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual code. Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect: social features, payment logic, analytics, admin panels, over-abstracted providers. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| After Task(s) | Message | Verification |
|------------|---------|--------------|
| 1 | `feat: scaffold Next.js + Supabase project with design system` | `npm run build` |
| 2 | `feat: add auth (Google OAuth + email) with protected routes` | `npm run build` |
| 3 | `feat: gallery components with grid, stack, lightbox, and card-flick` | `npm run build` |
| 4 | `feat: style presets data and selector component` | `npm run build` |
| 5 | `feat: landing page with hero, examples, and CTA` | `npm run build` |
| 6 | `feat: image upload with resize, preview, and Supabase Storage` | `npm run build` |
| 7 | `feat: AI generation API route with Seedream proxy and rate limiting` | `npm run build` |
| 8 | `feat: public gallery page with OG tags and CTA` | `npm run build` |
| 9 | `feat: create page with full generation flow UI` | `npm run build` |
| 10 | `feat: dashboard with gallery, generation counter, and management` | `npm run build` |

---

## Success Criteria

### Verification Commands
```bash
# Build passes
cd /Users/ianvs/Documents/Projects/petportrait && npm run build
# Expected: exits 0, no errors

# Dev server starts
npm run dev &
# Expected: server at localhost:3000

# Landing page loads
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Expected: 200

# Auth redirect works
curl -s -o /dev/null -w "%{http_code}" -L http://localhost:3000/dashboard
# Expected: 200 (after redirect to /login)

# Public gallery 404
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/u/nonexistent
# Expected: 404

# API rejects unauthenticated
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/generate
# Expected: 401
```

### Final Checklist
- [ ] All "Must Have" present and working
- [ ] All "Must NOT Have" absent (verified by F4)
- [ ] Build passes (`npm run build` exits 0)
- [ ] Full user flow works end-to-end (verified by F3)
- [ ] Mobile responsive on 375px viewport
- [ ] Public gallery has correct OG tags
- [ ] Rate limiting enforced (6th generation returns 429)

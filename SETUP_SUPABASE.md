# Setting Up Supabase for Intellectus Funding Profiles

This guide walks you through creating a free Supabase project, setting up the
`profiles` table, and connecting it to the Intellectus Platform so that funding
profiles are stored in a persistent PostgreSQL database rather than locally in
the browser.

---

## 1. Create a Supabase Account and Project

1. Go to <https://supabase.com> and click **Start your project** (free tier is
   sufficient).
2. Sign in with GitHub or email.
3. Click **New project**.
4. Fill in the details:
   - **Name** – e.g. `intellectus-funding`
   - **Database Password** – choose a strong password and save it somewhere safe
   - **Region** – pick the region closest to your users
5. Click **Create new project** and wait ~2 minutes for provisioning to finish.

---

## 2. Create the `profiles` Table

1. In the Supabase dashboard, open the **SQL Editor** (left sidebar).
2. Click **New query**.
3. Paste the SQL below and click **Run**:

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id                     TEXT PRIMARY KEY,
  student_type           TEXT NOT NULL,
  display_name           TEXT NOT NULL,
  student_email          TEXT NOT NULL UNIQUE,
  age                    INTEGER,
  study_level            TEXT,
  high_school_grade      TEXT,
  institution_name       TEXT NOT NULL,
  field_of_study         TEXT NOT NULL,
  city                   TEXT NOT NULL,
  bio                    TEXT NOT NULL,
  profile_image_data_url TEXT,
  transcript_data_url    TEXT,
  transcript_name        TEXT,
  needs                  TEXT[]  DEFAULT '{}',
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read all profiles (public browse)
CREATE POLICY "Read all profiles"
  ON profiles FOR SELECT
  USING (true);

-- Anyone can insert a new profile
CREATE POLICY "Insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Anyone can update (simple open policy — tighten if you add auth)
CREATE POLICY "Update own profile"
  ON profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Anyone can delete (simple open policy — tighten if you add auth)
CREATE POLICY "Delete own profile"
  ON profiles FOR DELETE
  USING (true);
```

---

## 3. Get Your API Keys

1. In the Supabase dashboard go to **Settings** → **API**.
2. Copy the two values you need:
   - **Project URL** – looks like `https://xxxxxxxxxxxx.supabase.co`
   - **anon / public key** – the long JWT string labelled *anon public*

---

## 4. Add the Keys to Your Project

1. In the root of the repository, copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your values:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
   ```

3. **Never commit `.env.local`** — it is already listed in `.gitignore`.

---

## 5. Deploy to GitHub Pages

For the environment variables to be available in the GitHub Pages build you
need to add them as **repository secrets** and expose them during the build:

1. Go to your repository → **Settings** → **Secrets and variables** →
   **Actions**.
2. Add two secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. In your GitHub Actions workflow (`.github/workflows/*.yml`), add the
   environment variables to the build step:

   ```yaml
   - name: Build
     run: npm run build
     env:
       VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
       VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
   ```

---

## 6. Test Locally

```bash
npm install          # if you haven't already
npm run dev
```

Open <http://localhost:5173/#/funding> and create a test profile. Check the
**Table Editor** in your Supabase dashboard to confirm the row was saved.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| "Could not load profiles" | Missing / wrong env vars | Double-check `.env.local` and restart `npm run dev` |
| "Could not save your profile" | RLS policy not set up | Re-run the SQL from Step 2 |
| Profiles not visible after deploy | Secrets not added to GitHub Actions | Follow Step 5 above |
| CORS error in console | Project URL typo | Ensure the URL ends in `.supabase.co` with no trailing slash |

---

## Fallback Behaviour

If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are absent (e.g. during
local development before you've set up Supabase), the app automatically falls
back to **localStorage**. Profiles saved in this mode are stored only in that
browser and are not shared with other users.

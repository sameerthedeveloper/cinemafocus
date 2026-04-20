# Cinema Focus — Architecture & Data Structure

This document provides a comprehensive overview of the Cinema Focus project's technical architecture, infrastructure, and Firestore database schema.

---

## 🏗 Tech Stack & Architecture

**Frontend Framework**
- **React (v19)** powered by **Vite**
- **React Router (v7)** for client-side routing
- **Tailwind CSS (v4)** for styling and responsive layouts
- **Lucide React** for consistent iconography
- **React Helmet Async** for SEO management and `<head>` tags

**Backend & Data Services**
- **Firebase Firestore**: Primary NoSQL cloud database for dynamic content (products, categories, news).
- **Firebase Auth & Storage**: Authentication and file hosting.
- **Supabase**: Configured as an alternative or supplementary backend (connected via `.env` but primary logic relies on Firebase).

---

## 📂 Directory Structure

```text
cinemafocus/
├── public/                 # Static assets (favicons, etc.)
├── src/
│   ├── assets/             # Images and local styles
│   ├── components/         # Reusable React components (UI building blocks)
│   ├── context/            # Global React Context providers (Auth, Theme, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── firebase.js     # Firebase SDK initialization & configuration
│   │   ├── db.js           # Firestore data fetchers (Products, Categories, PRs)
│   │   ├── seed-data.js    # Hardcoded fallback data objects
│   │   ├── seeder.js       # Script logic for populating Firestore
│   ├── pages/              # Top-level route components (Home, Products, etc.)
│   ├── App.jsx             # Main application layout and routes
│   └── main.jsx            # React root entry point
├── .env                    # Environment credentials
├── vite.config.js          # Vite configuration & split chunks
└── tailwind.config.js      # Tailwind theme configuration
```

---

## 🗄️ Database Structure (Firestore)

The application utilizes Firebase Firestore as a highly-available NoSQL document store. Below are the core collections and their expected fields.

> [!NOTE]
> Database access seamlessly falls back to local JSON data (`src/lib/seed-data.js`) in case Firestore reads fail or connection times out. 

### 1. `products` (Collection)
Stores the premium audio and home cinema systems catalog.
- `id` (String): Document ID (usually the product slug)
- `name` (String): Product display name
- `brand` (String): Manufacturer brand name
- `category` (String): Slug representing the category (links to `categories` collection)
- `featured` (Boolean): Determines if it shows on the homepage
- `price` / `priceRange` (Number/String): Retail cost
- `imageUrl` (String): Link to primary product image
- *Other fields*: specs, description, etc.

### 2. `categories` (Collection)
Manages the product groupings and navigational taxonomy.
- `id` (String): Document ID
- `name` (String): Display name (e.g., "Amplifiers", "Subwoofers")
- `order` (Number): Sorting precedence for the UI hierarchy

### 3. `press_releases` (Collection)
Company news and PR campaigns.
- `id` (String): Document ID
- `slug` (String): URL-friendly string identifier validation targeting
- `title` (String): Headline of the press release
- `date` (Timestamp): Publication date
- `content` (String / Markdown): Body of the press release

### 4. `projects` (Collection)
Portfolio showcasing past professional home cinema installations.
- `id` (String): Document ID
- `title` (String): Title of the installation project
- `createdAt` (Timestamp): Chronological ordering
- `images` (Array): Gallery of the portfolio images

### 5. `new_launches` (Collection)
Highlight entries for newly introduced equipment in the store.
- `id` (String): Document ID 
- `productSlug` (String): Reference to a product
- `announcementText` (String): Promotional text

### 6. Singleton Content Nodes
For site-wide constants, items are stored in single documents.
- **Collection `hero` > Doc `main`**: Stores headline, subheadline, and image for the homepage hero block.
- **Collection `site_content` > Doc `trust_badges`**: Array of guarantees or partner badges displayed globally.

---

## 🔄 Data Fetching Flow
All database interactions are centralized in `src/lib/db.js`. 
- **Timeouts**: Every primary query is wrapped in a `Promise.race([], 5000ms)` to ensure the user never hangs. If Firestore doesn't respond within 5 seconds, it returns dummy local data.
- **Mock Overrides**: There is a global constant toggle `USE_MOCK` in `db.js` which forces the site to run fully standalone without cloud requests.

## 🔐 Environment Needs
The system requires the following `.env` parameters to function online:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

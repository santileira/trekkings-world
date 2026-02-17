# Trekkings World

A bilingual (Spanish/English) blog showcasing trekking routes around the world, starting with Argentina.

## Features

- Multi-country support (Argentina, Chile, USA - expandable)
- Bilingual content (ES/EN)
- Interactive maps with Leaflet
- Photo galleries with lightbox
- Difficulty/duration/region filters
- Comments via Giscus
- Ad monetization ready (Google AdSense)
- SEO optimized
- Fully responsive

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **CMS**: Sanity.io
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + OpenStreetMap
- **Comments**: Giscus
- **Hosting**: Vercel (recommended)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Sanity

1. Create a Sanity project at [sanity.io/manage](https://www.sanity.io/manage)
2. Copy your project ID
3. Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

4. Add your Sanity project ID to `.env.local`

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

Access Sanity Studio at [http://localhost:3000/studio](http://localhost:3000/studio) to manage content.

### 4. Add Content

1. Go to `/studio`
2. Create a Country (e.g., Argentina with code "ar")
3. Create Regions for that country
4. Create Treks with all details

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add your environment variables
4. Deploy!

### Set up Ads (Google AdSense)

1. Apply for AdSense at [google.com/adsense](https://www.google.com/adsense)
2. Once approved, add your publisher ID to the AdBanner component
3. Create ad units and add slot IDs

### Set up Comments (Giscus)

1. Enable GitHub Discussions in your repo
2. Go to [giscus.app](https://giscus.app) to configure
3. Update the Comments component with your repo details

## Project Structure

```
trekkings-world/
├── src/
│   ├── app/
│   │   ├── [locale]/              # i18n routes (es/en)
│   │   │   ├── page.tsx           # Homepage
│   │   │   └── [country]/         # Country routes
│   │   │       ├── page.tsx       # Country page
│   │   │       └── trekkings/     # Trek routes
│   │   └── studio/                # Sanity Studio
│   ├── components/                # React components
│   ├── i18n/                      # Internationalization
│   └── lib/                       # Utilities
├── messages/                      # Translation files
├── sanity/                        # Sanity schemas
└── public/                        # Static assets
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (usually "production") |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version |

## License

MIT

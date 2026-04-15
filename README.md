This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and integrated with [Kontent.ai](https://kontent.ai) CMS.

## Getting Started

### Prerequisites

- Node.js 18+
- A Kontent.ai account and project

### Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Configure your Kontent.ai credentials in `.env.local`:
   ```
   NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID=your_environment_id
   NEXT_PUBLIC_KONTENT_DELIVERY_API_KEY=your_delivery_api_key
   NEXT_PUBLIC_KONTENT_PREVIEW_API_KEY=your_preview_api_key  # optional
   ```

   You can find these values in your Kontent.ai project under **Project Settings > API Keys**.

### Installation

Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Kontent.ai Integration

This project is configured to fetch content from Kontent.ai CMS. The integration includes:

- **Configuration**: `config/kontent.ts` - Client setup and configuration
- **Utilities**: `lib/kontent.ts` - Helper functions for fetching content
- **Content Types**: Ready to work with your Kontent.ai content models

### Setting up Content Types

1. In your Kontent.ai project, create the following content types:
   - `home_page` with elements:
     - `title` (Text)
     - `subtitle` (Text)
     - `description` (Rich text)
     - `cta_text` (Text)
     - `features` (Modular content) - for insurance features
   - `landing_page` with elements:
     - `title` (Text)
     - `url_slug` (Text) - used for the page URL
     - `banner` (Asset) - banner image for the landing page
     - `content_section` (Rich text) - main content for the landing page
     - `forms_section` (Rich text) - forms content
     - `faq_s` (Modular content) - linked FAQs
     - `mrec_tiles` (Modular content) - MREC tiles
   - `brand_partner_root` with elements:
     - `brand_partner_logo` (Asset) - the logo image
     - `brand_disclaimer` (Rich text) - the disclaimer text
   - `faq_page` with elements:
     - `title` (Text)
     - `url_slug` (Text) - used for the page URL
     - `banner` (Asset) - banner image
     - `content_section` (Rich text) - main content
   - `faq_content` with elements:
     - `question` (Text)
     - `answer` (Rich text)
   - `mrec_tiles` with elements:
     - `title` (Text)
     - `description` (Rich text)
     - `image` (Asset)
     - `cta_text` (Text)
     - `cta_url` (Text)

2. Create collections for organizing content:
   - `brand_partner_root_collection` - for brand partner logo and disclaimer items
   - `home_page_collection` - for home page content
   - `faq_content_collection` - for FAQ content
   - `mrec_tiles_collection` - for MREC tiles

3. Create content items based on your content types and assign them to the appropriate collections.

### Landing Pages

Landing pages are available under:

```
/landing/[url_slug]
```

For example, a landing page with `url_slug` value `special-offer` will be available at:

```bash
http://localhost:3000/landing/special-offer
```

### API Routes

The application includes an API route for fetching Kontent.ai content:

```
GET /api/kontent?type=content_type&limit=10
```

Example:
```bash
curl "http://localhost:3000/api/kontent?type=home_page"
```

## Project Structure

```
├── config/
│   └── kontent.ts          # Kontent.ai client configuration
├── lib/
│   └── kontent.ts          # Utility functions for content fetching
├── app/
│   ├── api/kontent/        # API routes for Kontent.ai
│   ├── page.tsx            # Home page with CMS integration
│   └── layout.tsx          # App layout
├── .env.example            # Environment variables template
└── .env.local              # Your environment variables (gitignored)
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Kontent.ai Documentation](https://kontent.ai/learn)
- [Kontent.ai JavaScript SDK](https://github.com/kontent-ai/delivery-sdk-js)

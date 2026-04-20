# Content Block Rendering Pattern

## Overview

This project supports rendering nested `content_block` content types from Kontent.ai. When a parent content type (like `landing_page`) links to one or more `content_block` items via a rich text field, the content from those blocks is automatically extracted and rendered with consistent styling.

## CMS Structure

### Content Block Type

The `content_block` content type should have:
- **Codename:** `content_block`
- **Primary Field:** Any rich text field containing the content (typically named `body`, but also supports `content`, `rich_text`, `main_content`, `text`, or any custom field name with HTML content)

Example:
```
Content Block (code: content_block)
├── body (rich_text) - The main content to display
└── title (text) - Optional metadata
```

### Parent Content Type (Landing Page)

The landing page uses this structure:
```
Landing Page (code: landing_page)
├── content_section (rich_text) - Can contain linked content_blocks
├── forms_section (rich_text) - Can contain linked content_blocks
└── ... other fields
```

## How It Works

### Data Flow

1. **CMS Setup**
   - Create `content_block` items with rich text content in a `body` field
   - In your `landing_page`, add linked references to `content_block` items in the `content_section` or `forms_section` rich text fields

2. **Data Layer (lib/kontent.ts)**
   - `getLandingPageBySlug()` fetches the landing page with depthParameter(3) to include nested content_blocks
   - `getMergedContentStructureHtml()` scans all fields for linked content_blocks
   - `getSectionHtml()` extracts rich text from the content_section field
   - `getContentBlockBodies()` extracts the HTML body from each linked content_block
   - Result: A merged HTML string containing all content_block bodies with direct rich text

3. **Component Rendering (app/landing/[slug]/page.tsx)**
   - The landing page component receives `page.contentSection` (already merged HTML)
   - Uses `ContentBlockRenderer` component to render the HTML with proper styling
   - Kontent.ai edit mode integration is included via data attributes

## Usage in Components

### Using ContentBlockRenderer

```tsx
import ContentBlockRenderer from '@/components/ContentBlockRenderer';
import { getLandingPageBySlug } from '@/lib/kontent';
import { landingPageStyles, getBrandStyles } from '@/lib/design-system';

export default async function LandingPage() {
  const page = await getLandingPageBySlug('my-page');
  const brandStyles = getBrandStyles(page?.brandKey);

  return (
    <ContentBlockRenderer
      html={page.contentSection}
      itemId={page.itemId}
      elementCodename="content_section"
      tag="div"
      className="rich-text-content"
      style={{ ...landingPageStyles.bodyText, ...brandStyles.bodyText }}
    />
  );
}
```

### ContentBlockRenderer Props

| Prop | Type | Description |
|------|------|-------------|
| `html` | `string` | The HTML content extracted from content_blocks (required) |
| `itemId` | `string` | (Optional) Kontent.ai item ID for edit mode integration |
| `elementCodename` | `string` | (Optional) CMS field codename for edit mode integration |
| `className` | `string` | (Optional) CSS classes to apply to the container |
| `style` | `CSSProperties` | (Optional) Inline styles (used for design system tokens) |
| `tag` | `JSX.IntrinsicElements` | (Optional) HTML tag to wrap content (default: `'div'`) |

## Styling

Content blocks inherit styling from:

1. **Design System Tokens** (via `style` prop)
   - `landingPageStyles.bodyText` - Base typography and spacing
   - `brandStyles.bodyText` - Brand-specific overrides

2. **CSS Classes** (via `className` prop)
   - `.rich-text-content` - Custom CSS for rich text formatting
   - HTML structure from rendered content blocks

### Example Styling

```tsx
<ContentBlockRenderer
  html={contentHtml}
  style={{ 
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333'
  }}
  className="rich-text-content prose prose-lg"
/>
```

## Supported Field Names

The extraction logic automatically looks for rich text fields in the following order:

1. `body`
2. `content`
3. `rich_text_content`
4. `rich_text`
5. `main_content`
6. `text`
7. Any field with HTML content (pattern: `/<[^>]+>/`)
8. First non-empty string field as fallback

This flexibility allows content blocks to use any field name and still be properly extracted.

## Kontent.ai Edit Mode

When `itemId` and `elementCodename` are provided to `ContentBlockRenderer`, the component adds data attributes that enable inline editing in Kontent.ai:

```html
<div 
  data-kontent-item-id="uuid-here" 
  data-kontent-element-codename="content_section">
  <!-- rendered content -->
</div>
```

## Examples

### Example 1: Simple Content Block

**CMS Setup:**
- Create a `content_block` with codename `content_block`
- Add a rich text field named `body` with markdown/HTML content
- In your landing page's `content_section`, add a link to this content_block

**Result:**
```html
<!-- Automatically rendered with contentSection HTML from lib/kontent.ts -->
<div class="rich-text-content">
  <h2>Your Content Title</h2>
  <p>Your content body...</p>
</div>
```

### Example 2: Multiple Content Blocks

If `content_section` contains multiple linked content_blocks, they are automatically merged:

```
Landing Page
├── content_section (rich text)
│   ├── [linked] Content Block #1 (body: "First section")
│   ├── [linked] Content Block #2 (body: "Second section")
│   └── Direct rich text: "Introduction text"
```

**Rendered as:**
```html
<div>
  <!-- Direct rich text -->
  <p>Introduction text</p>
  <!-- Content Block #1 body -->
  <p>First section</p>
  <!-- Content Block #2 body -->
  <p>Second section</p>
</div>
```

## Troubleshooting

### Content Not Displaying

1. **Check CMS Linking**
   - Ensure content_block items are linked in the parent content type's rich text field
   - Verify links are saved properly

2. **Verify Field Names**
   - Check that the content_block has a field with rich text content
   - Look for supported field names: body, content, rich_text, etc.

3. **Check Data Layer Extraction**
   - Add logging to `getMergedContentStructureHtml()` temporarily
   - Verify content_blocks are detected: `isContentBlockLinkedItem()` returns true

### Styling Issues

1. **CSS Not Applied**
   - Ensure `className` and `style` props are passed to `ContentBlockRenderer`
   - Check that design system tokens are available

2. **HTML Rendering Issues**
   - Content from `body` field must be valid HTML
   - Check browser console for HTML parsing errors

## Implementation Checklist

- [x] Data layer functions extract content_block bodies from linked items
- [x] `ContentBlockRenderer` component renders extracted HTML
- [x] Landing page components use `ContentBlockRenderer` for consistency
- [x] Design system styling applied to rendered content
- [x] Kontent.ai edit mode integration supported
- [x] Flexible field name detection (supports any field name)
- [x] Deduplication prevents duplicate content when merging
- [x] Type safety with TypeScript interfaces

## Related Files

- **Data Layer:** [lib/kontent.ts](../lib/kontent.ts)
  - `getMergedContentStructureHtml()` - Merges content_blocks
  - `getSectionHtml()` - Extracts from a single field
  - `getContentBlockBodies()` - Extracts from linked content_blocks
  - `isContentBlockLinkedItem()` - Detects content_block type

- **Component:** [components/ContentBlockRenderer.tsx](../components/ContentBlockRenderer.tsx)
  - Renders extracted HTML with styling

- **Usage:** 
  - [app/landing/[slug]/page.tsx](../app/landing/[slug]/page.tsx)
  - [app/[slug]/page.tsx](../app/[slug]/page.tsx)
  - [app/faqs/[slug]/page.tsx](../app/faqs/[slug]/page.tsx)

## Best Practices

1. **Keep content_blocks focused** - Use small, reusable blocks rather than large monolithic content
2. **Use consistent field names** - Prefer `body` for the main content field
3. **Validate HTML** - Ensure content in the body field is clean HTML
4. **Test in edit mode** - Verify Kontent.ai inline editing works after deploying
5. **Use design tokens** - Pass styling through design system rather than hardcoding CSS

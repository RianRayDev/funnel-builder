# Funnel Builder — Component JSON Schema

**For Claude Code:** This document describes every component in the funnel builder's JSON format.
Use this to generate valid JSON that the builder can import, or to convert JSON exports to static HTML/CSS.

---

## JSON Structure

```json
{
  "content": [ /* array of components */ ],
  "root": { "props": { "title": "Page Title" } }
}
```

Each component in `content` has this shape:
```json
{ "type": "ComponentName", "props": { "id": "unique-id", ...componentProps } }
```

**IMPORTANT:** Every component MUST have a unique `id` in its props.

---

## Layout Components

### Section
Container for page sections with background and padding.
```json
{ "type": "Section", "props": { "id": "sec-1", "backgroundColor": "bg-white", "paddingY": "py-16", "maxWidth": "max-w-6xl" } }
```
- `backgroundColor`: `"bg-white"` | `"bg-slate-50"` | `"bg-slate-100"` | `"bg-slate-900"` | `"bg-blue-50"` | `"bg-amber-50"`
- `paddingY`: `"py-8"` | `"py-16"` | `"py-24"` | `"py-32"`
- `maxWidth`: `"max-w-4xl"` | `"max-w-6xl"` | `"max-w-7xl"` | `"max-w-full"`

### Columns
Responsive grid layout.
```json
{ "type": "Columns", "props": { "id": "cols-1", "columns": "grid-cols-3", "gap": "gap-6" } }
```
- `columns`: `"grid-cols-2"` | `"grid-cols-3"` | `"grid-cols-4"`
- `gap`: `"gap-4"` | `"gap-6"` | `"gap-8"` | `"gap-12"`

### Spacer
Vertical spacing between elements.
```json
{ "type": "Spacer", "props": { "id": "sp-1", "height": "h-8" } }
```
- `height`: `"h-4"` | `"h-8"` | `"h-12"` | `"h-16"` | `"h-24"` | `"h-32"`

### Divider
Horizontal separator line.
```json
{ "type": "Divider", "props": { "id": "div-1", "style": "border-solid", "color": "border-border" } }
```
- `style`: `"border-solid"` | `"border-dashed"` | `"border-dotted"`
- `color`: `"border-border"` | `"border-muted-foreground/20"` | `"border-primary/30"`

---

## Content Components

### Heading
Text headings h1 through h6.
```json
{ "type": "Heading", "props": { "id": "h-1", "text": "Your Headline", "level": "h2", "alignment": "text-center", "color": "text-foreground" } }
```
- `level`: `"h1"` through `"h6"`
- `alignment`: `"text-left"` | `"text-center"` | `"text-right"`
- `color`: `"text-foreground"` | `"text-primary"` | `"text-muted-foreground"` | `"text-white"`

### TextBlock
Body text / paragraphs.
```json
{ "type": "TextBlock", "props": { "id": "txt-1", "content": "Your text here.", "alignment": "text-left", "size": "text-base" } }
```
- `size`: `"text-sm"` | `"text-base"` | `"text-lg"` | `"text-xl"`

### ImageBlock
Images with optional border radius.
```json
{ "type": "ImageBlock", "props": { "id": "img-1", "src": "https://example.com/photo.jpg", "alt": "Description", "borderRadius": "rounded-xl", "objectFit": "object-cover" } }
```
- `borderRadius`: `"rounded-none"` | `"rounded-lg"` | `"rounded-xl"` | `"rounded-2xl"` | `"rounded-full"`
- `objectFit`: `"object-cover"` | `"object-contain"` | `"object-fill"`

### VideoEmbed
YouTube or Vimeo video embeds.
```json
{ "type": "VideoEmbed", "props": { "id": "vid-1", "url": "https://youtube.com/watch?v=xxx", "aspectRatio": "aspect-video", "borderRadius": "rounded-xl", "autoplay": false } }
```

---

## Interactive Components

### ButtonBlock
CTA buttons with link.
```json
{ "type": "ButtonBlock", "props": { "id": "btn-1", "label": "Get Started", "link": "#", "variant": "primary", "size": "md", "fullWidth": false, "alignment": "justify-center" } }
```
- `variant`: `"primary"` | `"secondary"` | `"outline"` | `"ghost"`
- `size`: `"sm"` | `"md"` | `"lg"`
- `alignment`: `"justify-start"` | `"justify-center"` | `"justify-end"`

### FormBlock
Lead capture forms.
```json
{
  "type": "FormBlock",
  "props": {
    "id": "form-1",
    "fields": [
      { "label": "Full Name", "type": "text", "placeholder": "Your name", "required": true },
      { "label": "Email", "type": "email", "placeholder": "you@example.com", "required": true }
    ],
    "submitLabel": "Get Started",
    "submitStyle": "primary",
    "layout": "stacked",
    "actionUrl": ""
  }
}
```
- `fields[].type`: `"text"` | `"email"` | `"tel"` | `"textarea"` | `"select"`
- `submitStyle`: `"primary"` | `"large"` | `"outline"`
- `layout`: `"stacked"` | `"inline"`

---

## Marketing Components

### Testimonial
Social proof quotes.
```json
{
  "type": "Testimonial",
  "props": {
    "id": "test-1",
    "quote": "This product changed everything for us.",
    "authorName": "Sarah Johnson",
    "authorTitle": "Marketing Director",
    "avatarUrl": "",
    "rating": "5",
    "style": "card"
  }
}
```
- `rating`: `"0"` | `"3"` | `"4"` | `"5"`
- `style`: `"card"` | `"minimal"` | `"centered"`

### FeatureList
Feature/benefit grids.
```json
{
  "type": "FeatureList",
  "props": {
    "id": "feat-1",
    "items": [
      { "title": "Fast", "description": "Sub-second load times." },
      { "title": "Secure", "description": "End-to-end encryption." }
    ],
    "icon": "check",
    "columns": "grid-cols-3",
    "style": "cards"
  }
}
```
- `icon`: `"check"` | `"star"` | `"zap"` | `"shield"` | `"heart"` | `"award"`
- `style`: `"cards"` | `"list"` | `"inline"`

### FAQAccordion
Expandable Q&A sections.
```json
{
  "type": "FAQAccordion",
  "props": {
    "id": "faq-1",
    "items": [
      { "question": "What is included?", "answer": "Everything you need." },
      { "question": "Can I cancel?", "answer": "Yes, anytime." }
    ],
    "style": "card"
  }
}
```
- `style`: `"card"` | `"simple"`

### CountdownTimer
Urgency/deadline timers.
```json
{ "type": "CountdownTimer", "props": { "id": "cd-1", "targetDate": "2026-05-01 00:00", "label": "Offer expires in", "style": "boxes", "size": "md" } }
```
- `style`: `"boxes"` | `"inline"` | `"minimal"`
- `size`: `"sm"` | `"md"` | `"lg"`

### TrustBadges
Security and guarantee indicators.
```json
{ "type": "TrustBadges", "props": { "id": "trust-1", "badges": ["secure", "guarantee", "payment"], "alignment": "justify-center", "size": "sm" } }
```
- `badges[]`: `"secure"` | `"encrypted"` | `"guarantee"` | `"payment"` | `"verified"`

---

## Converting JSON to Static HTML/CSS

When Claude Code converts this JSON to production code:

1. Each component maps to a Tailwind-styled HTML block
2. Use the exact Tailwind classes specified in props
3. Render components in order (top to bottom = array order)
4. Section/Columns components may have nested DropZone content (stored in the `zones` key of the JSON)
5. Forms should POST to the `actionUrl` or use a default form handler
6. CountdownTimer needs a small inline `<script>` for the live countdown
7. FAQAccordion needs toggle JS for expand/collapse
8. All other components are pure HTML/CSS — no JS required

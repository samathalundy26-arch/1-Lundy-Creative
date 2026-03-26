# Lundy Creative Studio Designer

**A dyslexia-friendly, highly visual paper pad collection management system for creative studio designers.**

---

## Project Overview

Lundy Creative Studio Designer is a comprehensive browser-based creative management app built for paper product designers. Specifically optimized for users with dyslexia using visual anchors, color-coding, large touch targets (44px+), and minimal dense text. Manage every aspect of paper pad design — from inspiration capture to final production files — with full visual customization of every collection's appearance.

---

## ✅ Completed Features

### 🖼️ Visual Customization System (NEW)
- **Card Cover Images** — Upload a custom cover image per collection; shown on gallery cards and sidebar thumbnails. Hover over any card → click the 📷 icon to upload instantly without opening a modal
- **Page Background Pattern** — Upload a tiled pattern/texture image per collection that tiles as the full-page background when you enter that collection's detail view
- **Pattern Scale Control** — Real-time slider (20%–300%) to adjust tile size of the background pattern
- **Pattern Opacity Control** — Real-time slider (5%–80%) to control how subtle or bold the pattern appears over the gradient
- **Inline Header BG Bar** — Always-visible control bar directly below the palette dots row: "Card Cover" | "Page Pattern" | "Clear BG" buttons + scale/opacity sliders appear when a pattern is active
- **Right Panel Pattern Section** — Upload, preview, remove, and adjust pattern settings from the right sidebar panel
- **Collection Palette → Page Background** — The palette gradient from the collection's colors applies as the base page tint automatically
- **Collection Accent Colors** — Click any palette dot to instantly apply that color as the app's accent theme
- **Persistent Storage** — All cover images, pattern images, scale/opacity settings saved to `localStorage`

### 📁 My Collections (Paper Pad Library)
- **Gallery View** — Visual grid of collection cards with cover images, color palette band, status badges, tags
- **Card-Level Actions** — Hover over any card to reveal: 📷 Upload Cover, ✏️ Edit, 🗑️ Delete
- **Collection Detail View** — Three-panel layout: Left sidebar list + Center content + Right customization panel
- **Inline Title Editing** — Double-click the collection name to rename it in-place
- **Color Palette Row** — Clickable palette dots (30px) with one-click theme application
- **Background Customization Bar** — Always-visible at top of detail content
- **Components Grid** — Visual boxes showing component type, thumbnail previews, count controls (±), and VIEW FILES
- **Edit Mode** — Toggle to enable ✕ remove buttons on each component box
- **File Center Panel** — File type buttons, extra file chips, organize-by tabs, notes textarea
- **Right Panel** — Cover preview (with Change Cover + Remove buttons), Pattern section (upload/preview/remove/scale/opacity), File Center folder list, Quick Notes
- **New Collection Modal** — Wide two-column modal: left (name/size/type/status/tags/palette), right (cover image upload preview + pattern image upload preview)
- **Edit Collection Modal** — Wide two-column layout with cover/pattern thumbnails, scale/opacity sliders
- **Delete Collection** — Confirmation required
- **Global Search** — Real-time filtering by name and tags in gallery view
- **4 Sample Collections** pre-loaded (Resilient Blooms, Golden Harvest, Ocean Dreams, Midnight Garden)

### 🎨 Inspiration Board
- Infinite whiteboard canvas with drag & drop images
- Sticky notes anywhere on the board
- Drag to reposition items
- Color-coded folder system with sidebar
- 3 sample folders pre-loaded

### 📋 Craft Projects
- Project gallery with status filter bar
- 3-step new project setup (basics → workspace type → color scheme)
- Guided template sections (overview, materials, checklist, notes, etc.)
- Progress tracking via checklist completion
- 2 sample projects pre-loaded

### 🤖 Studio (AI Creation Hub)
- 6 collection templates with component breakdowns
- AI prompt editor (customizable)
- Simulated collection generation
- Save generated collection to My Collections
- Mockup gallery (6 lifestyle templates)

### 📦 3D Unzip (Pattern Generator)
- Upload 3D object photos
- Object type/dimensions form
- 5-tab output: Fashion Illustration, 2D Die Line, SVG Template, Materials List, Assembly Instructions
- Saved projects gallery

### 🧪 GEN Studio (NEW)
- **Studio Dashboard** — Welcome banner with today's date, live stats (library, AI programs, prompts, binders, notebooks, worksheets), quick action buttons, recently added grid
- **AI Program Dashboards** — All 18 pre-loaded AI tools (Copilot, Firefly, ChatGPT, Midjourney, Canva AI, Gemini, Ask Anything, DeepAI Chat, DeepSeek, NotebookLM, M365 Copilot, Genspark, Skywork, Wispr Flow, Notion AI, Milanote, Manus, Firebase Studio) with color-coded cards, count stats, storage section list, slide-over detail panel, add/delete in edit mode
- **Visual Library** — Gallery-style grid, filter by All/Images/Worksheets/Prompts/Foil Layers/Patterns/Templates, real-time search, file type badges, AI source tracking, add/delete items
- **Skill Binders** — Binder spine shelf, tabbed dividers (add/delete tabs), per-tab page management, 6 page types (Worksheet/Tutorial/Notes/Prompt/Technique/Reference), inline title/content editing, auto-save
- **Notebooks & Folders** — Visual containers (Folders, Spiral Notebooks, Sketchbooks, 12×12 Scrapbook Pads) with SVG visuals, type filter, add/delete
- **Worksheet Generator** — Page size selector, branded header, editable title/source/tags/content, 7 color themes, live preview as you type, save to library, print/PDF
- **Prompt Helper** — Brain-dump natural language input, 5 variants (Short/Medium/Detailed/Creative/Technical), SAM Mode toggle, AI target selector, copy to clipboard, save to library, saved prompts panel with load/delete
- **Brand Kit** — Full color palette with hex codes, typography showcase (Playfair Display, Lato, Sacramento), logo concept variations
- **Spine navigation** — Left sidebar with 8 section buttons, animated page transitions, no vertical scrollbars

### ✨ Foil Studio
- Pattern upload from file or collections
- HTML5 canvas drawing tools (Draw/Erase/Highlight)
- Adjustable brush size
- Workflow A (Digital Foil) / Workflow B (Stencil)
- Alignment system panel
- Saved foil projects

### App-Wide Features
- **Main Tab Navigation** — 6 tabs wired correctly (MY COLLECTIONS, STUDIO, INSPIRATION, CRAFT PROJECTS, 3D UNZIP, FOIL STUDIO)
- **Edit Mode** — Global toggle (pencil icon top-right)
- **Theme Customizer** — 6 presets + custom accent/background color
- **Toast Notifications** — Success/error/info with slide animation
- **LocalStorage Persistence** — All data auto-saved
- **Responsive Design** — Desktop, tablet, mobile

---

## 🗂️ File Structure

```
index.html                  Main SPA structure (all HTML sections + modals)
css/
  style.css                 Global styles, topbar, tabs, page body, modals, buttons, toasts
  collections.css           Collection cards, detail view, bg-custom-bar, pattern controls, file center
  sections.css              Inspiration, Projects, Studio, 3D Unzip, Foil Studio
js/
  data.js                   App state, data models, LocalStorage, sample seed data
  app.js                    Core navigation (main-tabs), edit mode, modal helpers, toasts
  collections.js            Gallery, detail view, cover/pattern upload, file center, file viewer
  inspiration.js            Whiteboard canvas, drag & drop, folders
  projects.js               Project gallery, detail view, guided sections
  studio.js                 Template library, generation workflow, mockup gallery
  unzip3d.js                3D object upload, template generation, output tabs
  foil.js                   Canvas drawing, workflow selection, alignment system
  theme.js                  Theme presets, color variable application
```

---

## 📊 Data Models (localStorage)

### `lcs_collections`
```json
{
  "id": "lcs_...",
  "name": "string",
  "size": "12x12",
  "type": "Digital | Print & Cut | Physical",
  "status": "In Progress | Beginning | Ready for Final | Needs Editing | Completed | Paused",
  "tags": ["string"],
  "palette": ["#hex x6"],
  "coverColor": "#hex",
  "coverImage": "base64 | null",
  "patternImage": "base64 | null",
  "patternScale": 1.0,
  "patternOpacity": 0.18,
  "notes": "string",
  "quickNotes": "string",
  "createdAt": 0,
  "updatedAt": 0,
  "components": [{ "id": "", "type": "", "label": "", "count": 0, "items": [], "icon": "" }]
}
```

### `lcs_inspoFolders` / `lcs_inspoItems` / `lcs_projects` / `lcs_unzipProjects` / `lcs_foilProjects`
See original README data models — unchanged.

---

## 🎨 Design System

| Variable | Value | Use |
|---|---|---|
| `--accent` | `#CFA18D` (dynamic) | Primary accent (changes per collection palette) |
| `--blush-50` | `#FDF5F3` | App background |
| `--warm-700` | `#3D2F2A` | Primary text |
| `--font-heading` | Playfair Display | Headings |
| `--font-body` | Lato | Body text (dyslexia-friendly) |
| `--font-script` | Sacramento | Logo branding |

---

## 🔮 Features Not Yet Implemented

1. **Real AI Integration** — Generation is simulated
2. **ZIP File Export** — Requires server-side processing
3. **Image Cropping** — For uploaded cover/pattern images
4. **Cloud Sync** — localStorage only; no cross-device sync
5. **Sortable Drag-Drop** — Components can't be reordered by drag
6. **Whiteboard Resize Handles** — Can't resize whiteboard items
7. **Print Preview** — Proper print layout for die lines
8. **Mockup Auto-Placement** — AI-driven pattern placement in mockups
9. **Foil Layer SVG Export** — Canvas drawing as separate foil layer
10. **Real 3D Photo AI Analysis** — Computer vision not integrated

---

## 🚀 Recommended Next Steps

1. **Add image cropping** (Cropper.js) for cover/pattern uploads
2. **Add Sortable.js** for drag-reorder of components
3. **Add JSZip** for real ZIP downloads
4. **Add more pattern presets** (built-in tileable textures users can choose without uploading)
5. **Add pattern blend modes** (multiply, overlay, screen) for richer layering
6. **Connect AI API** with user's own key for real generation
7. **Add undo/redo** for whiteboard and collection edits
8. **Add keyboard shortcuts** for power users
9. **Add collection duplication** (clone collection with all settings)

---

*Lundy Creative Studio Designer — Built for creative minds. Visual first, always. ✨*

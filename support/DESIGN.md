# Design System Documentation: The Academic Luminary

## 1. Overview & Creative North Star
This design system is built to transform the digital learning experience for pedagogical students into a high-end, editorial journey. We move away from the "grid of boxes" typical of EdTech and toward a philosophy we call **"The Academic Luminary."**

The "Academic Luminary" style balances the weight of traditional pedagogical authority with the ethereal, translucent nature of Artificial Intelligence. It relies on **intentional asymmetry**, where large display typography creates a rhythmic flow, and **layered transparency**, where content feels like it is floating in a clean, illuminated space. By rejecting rigid borders and embracing tonal depth, we create an environment that feels both high-tech and deeply welcoming.

---

## 2. Colors: The Palette of Intelligence
The color strategy is rooted in a "Light+Depth" approach. We use a near-white base to ensure a "breathable" academic atmosphere, contrasted by a sophisticated technological gradient.

### The Signature Gradient
To provide the "visual soul" of the platform, use a linear gradient from **Sky Blue (`#4DA6FF`)** to **Deep Violet (`#4C1D95`)**. This should be reserved for high-impact elements: Hero headers, Primary CTAs, and Progress visualizations.

### Surface Hierarchy & The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are prohibited for sectioning. Boundaries must be defined solely through background color shifts or tonal transitions.
- **Surface (`#f9f9ff`):** The canvas. Use for the main background.
- **Surface-Container-Low (`#f3f3fa`):** Use for large layout sections (e.g., a sidebar or a secondary content area).
- **Surface-Container-Lowest (`#ffffff`):** Use for "elevated" content cards. Placing a white card on a `-low` background creates a natural lift without a border.

### The Glass & Gradient Rule
Floating elements (modals, navigation bars, AI floating action buttons) should utilize **Glassmorphism**. Use semi-transparent variants of `surface` or `surface_container_lowest` with a `backdrop-blur` (16px–32px). This allows the technological gradients to bleed through subtly, maintaining a cohesive, high-tech aesthetic.

---

## 3. Typography: Editorial Authority
We utilize a single-font strategy to balance character with readability, ensuring a cohesive academic feel across all text elements.

- **Display, Headlines, Body & Labels (Public Sans):** Use Public Sans for all `display-`, `headline-`, `body-`, `title-`, and `label-` tokens. Public Sans offers a clean, modern aesthetic with excellent readability, suitable for both impactful headlines and long-form pedagogical content. Use `display-lg` (3.5rem) with tight letter-spacing to create a "magazine-style" hierarchy.

**Hierarchy Note:** Always favor extreme contrast. If a headline is `headline-lg`, the sub-text should jump down to `body-md` to create clear, intentional whitespace and focus.

---

## 4. Elevation & Depth: Tonal Layering
In this system, depth is a feeling, not a structure.

- **The Layering Principle:** Stack surfaces to create hierarchy. A `surface-container-high` element should only exist inside a `surface-container-low` area. This "nesting" creates a physical sense of organization.
- **Ambient Shadows:** For floating components (e.g., a card being hovered), use a diffused shadow: 
  - *Blur:* 40px–60px.
  - *Opacity:* 4%–8% of the `on-surface` color.
  - *Tint:* Ensure the shadow has a hint of the `primary` blue to avoid a "dirty" grey look.
- **The "Ghost Border" Fallback:** If a separation is strictly required for accessibility, use a "Ghost Border": the `outline-variant` token at **15% opacity**. Never use 100% opaque outlines.

---

## 5. Components
Each component must feel like a custom-crafted tool, not a standard UI kit element.

### Buttons
- **Primary:** Gradient (`#4DA6FF` to `#4C1D95`) with `on-primary` text. Radius: `md` (1.5rem), reflecting the moderate roundedness of the system.
- **Secondary:** `secondary-container` background with `on-secondary-container` text. Moderate `md` (1.5rem) radius.
- **State Change:** On hover, use a subtle scale-up (1.02x) rather than just a color change.

### Cards & Lists
- **Rule:** No divider lines. Separate list items using 12px–16px of vertical whitespace or by alternating background tones between `surface-container-low` and `surface-container-lowest`.
- **Shape:** Use `md` (1.5rem) corner radius to reinforce the "welcoming" vibe.

### Input Fields
- **Style:** Use a "soft-inset" look. Background: `surface-container-high`. No border.
- **Focus State:** Apply a "Ghost Border" using the `primary` color at 40% opacity and a soft outer glow.

### AI Specialized Components
- **AI Response Bubble:** Use a glassmorphic background with a subtle gradient border (the only exception to the no-line rule). 
- **Progress Trackers:** Use the signature gradient for the fill. The "track" should be `surface-container-highest` at 30% opacity.

---

## 6. Do's and Don'ts

### Do:
- **Do** use "Breathing Room." Leverage a normal level of spacing between elements.
- **Do** use Kazakh terminology with pride—ensure the typography handles the specific glyphs of the Kazakh alphabet perfectly (Public Sans supports these well).
- **Do** overlap elements. Let an image or an AI icon slightly "break" the container of a card to create an organic, high-end feel.

### Don'ts:
- **Don't** use pure black (`#000000`). Use `on-surface` for all dark text.
- **Don't** use sharp corners. The minimum radius for any container should be `sm` (0.5rem), but favor a moderate `md` (1.5rem).
- **Don't** use 1px dividers to separate "lessons" or "modules." Use a shift in surface tone or increased whitespace.
- **Don't** use standard "drop shadows" that look like they belong in 2015. Keep them wide, soft, and nearly invisible.

---

*This design system is a living framework. It is intended to empower designers to build interfaces that feel less like software and more like a premium, mentored experience for the next generation of educators.*

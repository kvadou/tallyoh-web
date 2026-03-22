```markdown
# Design System Strategy: Tactical Whimsy

## 1. Overview & Creative North Star

**Creative North Star: "The Tactile Storybook"**

This design system moves beyond the flat, sterile world of traditional fintech to create a digital environment that feels physical, handcrafted, and alive. For children aged 4–10, financial literacy shouldn't feel like a math class; it should feel like an adventure through a world built of paper, clay, and soft afternoon light.

We break the "standard app" mold by rejecting rigid grids in favor of **Organic Asymmetry**. Elements are layered like a pop-up book, using overlapping surfaces and soft tonal shifts to create depth. By prioritizing a papercraft aesthetic, we signal that this space is safe, friendly, and intentionally built for small hands and big imaginations.

---

## 2. Colors & Surface Logic

Our palette is inspired by natural pigments—creams, ochres, and minerals—to provide a warm, premium editorial feel.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** To maintain the storybook aesthetic, boundaries are defined by background shifts. Use `surface-container-low` (#fcf9f4) sections against a `surface` (#fffcf7) background. This creates a "staged" look, like different sheets of heavy cardstock layered on a desk.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack.
- **Base Layer:** `surface` (#fffcf7)
- **Secondary Zones:** `surface-container` (#f6f3ee)
- **Interactive Cards:** `surface-container-lowest` (#ffffff) to create a subtle "pop" of brightness.
- **Nesting Logic:** An inner container should always be at least one tier higher or lower than its parent to define importance without needing a structural line.

### Signature Textures & The "Glass" Rule
- **The Glass Rule:** For floating navigation or modal overlays, use a semi-transparent `surface` color with a 20px backdrop-blur. This mimics frosted vellum paper, allowing the vibrant "Kingdom" artwork to bleed through.
- **Signature Gradients:** For primary CTAs, use a subtle linear gradient from `primary` (#36679c) to `primary-container` (#93c1fd) at a 135-degree angle. This gives a "rounded clay" volume to buttons that flat colors cannot achieve.

---

## 3. Typography: Editorial Friendliness

We employ a high-contrast scale to guide young readers and their parents through the experience.

- **The Display Pair:** We use **Plus Jakarta Sans** for headlines to provide a modern, rounded, and approachable authority. We pair this with **Be Vietnam Pro** for body copy to ensure maximum legibility at smaller scales.
- **Visual Hierarchy:**
- **Display-LG (3.5rem):** Reserved for "Hero" moments and achievement celebrations.
- **Headline-MD (1.75rem):** Used for section titles, colored in `on_primary_fixed` (#002648) to provide a "Navy" anchor to the page.
- **Body-LG (1rem):** The primary reading weight. Use `on_surface_variant` (#656461) to reduce harsh contrast and maintain the "Slate Gray" softness.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too "digital." We use **Ambient Shadowing** and **Tonal Layering** to create a tactile, clay-like feel.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-dim` (#e5e2dc) background. The 12% lightness difference provides all the "lift" needed for a high-end experience.
- **Ambient Shadows:** When a card needs to "float" (e.g., a coin balance), use a shadow with a 32px blur and 5% opacity. The shadow color should be a tinted blue-gray (`#2C3E50` at 5% opacity) to mimic natural, cool-toned ambient light.
- **The "Ghost Border" Fallback:** If a border is required for input accessibility, use `outline-variant` (#bbb9b4) at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Buttons & Pills
- **Primary Action:** Rounded (`xl`: 3rem corner radius). Uses the signature gradient with a `surface-container-lowest` shadow.
- **Pill Badges:** Used for status (e.g., "Earned," "Locked"). Fully rounded edges, using `secondary_container` (#ffc885) for a warm, "Sandy Gold" glow.

### Tactile Cards
- **Construction:** No borders. 2rem (`lg`) corner radius.
- **Grouping:** Instead of dividers, use **Spacing Scale 6** (2rem) of vertical white space to separate card groups.

### Input Fields
- Soft, pill-shaped containers using `surface-container-high` (#f0eee8). Labels use `label-md` in `secondary` (#865c22) to give a professional, golden-brown accent to form elements.

### Interactive "Coins" (Custom Component)
- As a financial app, currency is central. Currency displays should use a `secondary_fixed` (#ffc885) background with a "clay-molded" inner shadow to feel like a physical object a child can grab.

---

## 6. Do's and Don'ts

### Do:
- **Use Intentional Asymmetry:** Let illustrations overlap container boundaries to create a "pop-up book" effect.
- **Prioritize Breathing Room:** Use the **Spacing Scale 10** (3.5rem) for major section gutters to keep the UI "light and airy."
- **Embrace the Texture:** Use the Material `surface-variant` tones to create a sense of recycled, high-quality paper stock.

### Don't:
- **Don't use Dark Mode:** This system is strictly light and warm. Dark backgrounds break the "papercraft" metaphor.
- **Don't use 1px Dividers:** Lines are too clinical. Use color blocks or whitespace to define sections.
- **Don't use Pure Black:** Even for text, the darkest value should be `on_primary_fixed` (Navy) to maintain the soft, storybook palette.
- **Don't use Sharp Corners:** Nothing in this world should be sharp. Every interactive element must have a minimum `DEFAULT` (1rem) radius.

---

*This design system is a living framework. When in doubt, ask: "Does this feel like it was crafted by hand, or generated by a machine?" Choose the hand-crafted path.*```
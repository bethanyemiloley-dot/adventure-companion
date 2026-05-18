---
name: Ethereal Companion
colors:
  surface: '#fcf9f5'
  surface-dim: '#dcdad6'
  surface-bright: '#fcf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ef'
  surface-container: '#f0ede9'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e5e2de'
  on-surface: '#1c1c1a'
  on-surface-variant: '#3e4a3d'
  inverse-surface: '#31302e'
  inverse-on-surface: '#f3f0ec'
  outline: '#6e7a6c'
  outline-variant: '#bdcaba'
  surface-tint: '#006e2b'
  primary: '#006e2b'
  on-primary: '#ffffff'
  primary-container: '#47c163'
  on-primary-container: '#004a1b'
  inverse-primary: '#66de7c'
  secondary: '#2a58c0'
  on-secondary: '#ffffff'
  secondary-container: '#6c94ff'
  on-secondary-container: '#002b76'
  tertiary: '#725c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#caa719'
  on-tertiary-container: '#4c3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#82fc96'
  primary-fixed-dim: '#66de7c'
  on-primary-fixed: '#002108'
  on-primary-fixed-variant: '#00531f'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b3c5ff'
  on-secondary-fixed: '#001849'
  on-secondary-fixed-variant: '#003fa5'
  tertiary-fixed: '#ffe07d'
  tertiary-fixed-dim: '#e8c339'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#564500'
  background: '#fcf9f5'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2de'
  earth-moss: '#235524'
  serene-sky: '#E8F1FF'
  warm-sand: '#F5F1EA'
  soft-clay: '#D9C5B2'
  gentle-blush: '#F2E5E5'
typography:
  display-lg:
    fontFamily: Quicksand
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  quote-expressive:
    fontFamily: Bricolage Grotesque
    fontSize: 22px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Nunito Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  margin-mobile: 24px
  gutter: 16px
  safe-area: 32px
---

## Brand & Style
The design system is centered on the concept of "Gentle Stewardship." It is designed for individuals navigating non-traditional lifestyles who find standard productivity tools clinical or anxiety-inducing. The brand personality is that of a calm, artistic companion—supportive, whimsical, and deeply rooted in the serenity of the natural world.

The visual style is a hybrid of **Organic Minimalism** and **Artistic Whimsy**. It avoids the rigid grids of traditional SaaS, opting instead for a "hand-crafted" digital environment. Key characteristics include:
- **Hand-Drawn UI Elements:** Borders, icons, and dividers feature slight irregularities to mimic ink on paper or charcoal on stone.
- **Atmospheric Depth:** Using soft blurs and layered landscape illustrations to create a sense of vast, open space.
- **Companion-Centric:** The "companion life form" is integrated into the UI transitions and empty states, acting as a guide rather than a notification bot.

## Colors
The palette prioritizes "low-arousal" tones that evoke nature—forests, morning skies, and sun-bleached stones. 

- **Primary (Sage Green):** Used for growth-oriented actions and positive states.
- **Secondary (Serene Blue):** Used for structural elements and reflective moments.
- **Neutral (Cream/Beige):** Replaces harsh whites to reduce eye strain and create a "paper-like" warmth.
- **Constraint:** Red is strictly forbidden for "overdue" states. Instead, use **Soft Clay** or **Warm Sand** to indicate items that need attention, framing them as "resting" rather than "failed."

## Typography
Typography is split between functional clarity and emotional resonance.

- **UI & Navigation:** **Quicksand** and **Nunito Sans** provide a rounded, approachable feel that is highly legible even at small sizes. 
- **Emotional Layer:** **Bricolage Grotesque** is used sparingly for quotes, companion messages, and poetic interludes. Its slightly quirky, characterful construction feels more personal and "human" than a standard sans-serif.
- **Hierarchy:** Maintain generous line heights to ensure the text feels "airy" and uncrowded.

## Layout & Spacing
This design system uses a **Fluid, Contextual Layout** rather than a rigid grid. 

- **Breathing Room:** Increase standard margins (24px minimum) to ensure content never feels cramped against the screen edges.
- **Asymmetry:** Use slight offsets in image placement and card alignment to mimic an organic, scrapbook-like feel.
- **Vertical Flow:** Content should be separated by generous whitespace or hand-drawn horizontal rules (wavy lines) to prevent the "list-fatigue" common in productivity apps.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Soft Shadows**, avoiding the "floating" appearance of Material Design.

- **Surface Tiers:** Use `warm-sand` for the base background and `neutral-color` (#FDFAF6) for foreground cards.
- **Ambient Glow:** Shadows should be very large, highly diffused, and tinted with the primary color (e.g., a soft green shadow) rather than gray.
- **Depth of Field:** Use blurred landscape illustrations in the background of the "Home" view to create a sense of physical space. Elements closer to the user are more opaque, while background elements use a `20px` backdrop-blur.

## Shapes
The shape language is dominated by **Organic Ovals** and **Soft Rectangles**. 

- **Irregularity:** When possible, use SVG masks to give cards a slightly "wobbly" edge, as if hand-cut from cardstock.
- **Radius:** Standard UI elements use a 1rem (`16px`) radius, while the most important call-to-actions use a pill-shape to feel soft to the touch.
- **Icons:** Icons must be "Open-stroke" with rounded terminals, avoiding sharp corners or perfectly straight lines.

## Components
- **Buttons:** Large, pill-shaped, and using a "squishy" haptic feedback. Avoid high-contrast borders; use subtle tonal differences to indicate state.
- **Cards:** Cards should not have hard borders. Use a soft `gentle-blush` or `serene-sky` background color to distinguish them from the main canvas.
- **Companion Widget:** A central, floating element (the companion life form) that reacts to user touch with gentle animations. It does not use speech bubbles; it uses "thought clouds" with soft, hand-drawn edges.
- **Input Fields:** Bottom-aligned labels with a single, hand-drawn "sketchy" underline instead of a full bounding box, reducing the feeling of "filling out a form."
- **Progress Indicators:** Instead of bars or circles, use a "Path" metaphor—a hand-drawn dotted line that fills in as the user moves through their day.
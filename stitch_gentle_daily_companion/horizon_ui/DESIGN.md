---
name: Horizon UI
colors:
  surface: '#f9f9ff'
  surface-dim: '#d7dae3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fc'
  surface-container: '#ebedf7'
  surface-container-high: '#e6e8f1'
  surface-container-highest: '#e0e2eb'
  on-surface: '#181c22'
  on-surface-variant: '#414753'
  inverse-surface: '#2d3037'
  inverse-on-surface: '#eef0fa'
  outline: '#717785'
  outline-variant: '#c1c6d5'
  surface-tint: '#005db8'
  primary: '#005ab4'
  on-primary: '#ffffff'
  primary-container: '#0a73e0'
  on-primary-container: '#fefcff'
  inverse-primary: '#aac7ff'
  secondary: '#465f88'
  on-secondary: '#ffffff'
  secondary-container: '#b6d0ff'
  on-secondary-container: '#3f5881'
  tertiary: '#964400'
  on-tertiary: '#ffffff'
  tertiary-container: '#bd5700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458d'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#aec7f7'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#2d476f'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68c'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#763400'
  background: '#f9f9ff'
  on-background: '#181c22'
  surface-variant: '#e0e2eb'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
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
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

# Horizon UI Design System

## Brand & Style
Horizon UI is designed to evoke a sense of reliability, clarity, and modern professionalism. Moving away from aggressive industrial tones, the brand now embraces a trustworthy and accessible aesthetic. The style is **Corporate / Modern**, leaning into the balance and precision found in contemporary digital interfaces. It prioritizes user confidence through a calm color palette and soft, approachable geometry, making it ideal for high-utility platforms where focus and stability are paramount.

## Colors
The color palette is anchored by a vibrant, professional blue, signaling trust and technological fluency. 

- **Primary (#1275e2):** A clear, energetic blue used for main actions and key brand moments.
- **Secondary (#5f78a3):** A muted, cool-toned slate blue used for supporting elements and balancing the primary vibrancy.
- **Tertiary (#c55b00):** A warm amber used sparingly for highlights, alerts, or contrasting accents to draw attention without overwhelming the cool base.
- **Neutral (#74777f):** A balanced gray used for surfaces, borders, and text, ensuring high legibility and a sophisticated backdrop.

The system utilizes a "fidelity" color variant, ensuring that derived semantic colors remain true to the tonal intent of the core palette while maintaining accessible contrast ratios.

## Typography
The system utilizes **Inter** across all levels to ensure maximum legibility and a clean, neutral character. Inter’s tall x-height and wide apertures make it exceptionally readable on screens of all sizes.

- **Headlines:** Set with tighter letter-spacing and heavier weights (600-700) to create a strong visual hierarchy.
- **Body Text:** Standardized at 14px and 16px with generous line heights to facilitate comfortable long-form reading.
- **Labels:** Utilized for small metadata and UI controls, employing medium weights and slight tracking for clarity at small scales.

## Layout & Spacing
The layout follows a **fluid grid** model that adapts to screen width while maintaining consistent internal rhythms. We employ an 8px spacing scale to ensure all elements align to a predictable cadence.

- **Desktop:** 12-column grid with 24px margins.
- **Tablet:** 8-column grid with 16px margins.
- **Mobile:** 4-column grid with 16px margins.

Spacing should be applied logically: use 16px (md) for standard padding within cards and containers, and 24px or 32px for vertical sections to allow the design to breathe.

## Elevation & Depth
Horizon UI uses **Tonal Layers** and **Ambient Shadows** to communicate hierarchy. Depth is not achieved through heavy dark shadows, but through subtle shifts in surface color and soft, diffused shadows tinted with the neutral color.

- **Level 0 (Flat):** Main background surface.
- **Level 1 (Raised):** Cards and navigation bars, using a subtle 4px blur shadow with low opacity.
- **Level 2 (Overlay):** Modals and dropdowns, featuring a more pronounced 12px blur shadow to indicate clear separation from the layers below.

## Shapes
The shape language is defined by **Rounded** geometry. This level of roundedness softens the interface, making it feel more modern and user-friendly compared to sharp-edged designs.

- **Standard Elements (Buttons, Inputs):** 0.5rem (8px) radius.
- **Large Containers (Cards, Modals):** 1rem (16px) radius.
- **Feature Elements:** 1.5rem (24px) radius.

## Components
- **Buttons:** Solid primary blue with 8px rounded corners. Text is centered, medium-weight Inter. Secondary buttons use a subtle gray outline or tonal slate background.
- **Inputs:** 8px rounded borders with a 1px neutral stroke. On focus, the border transitions to primary blue with a soft glow.
- **Cards:** White or light-gray surfaces with a 16px corner radius and Level 1 elevation.
- **Chips:** Highly rounded (pill-shaped) with secondary slate backgrounds and small label typography.
- **Checkboxes/Radios:** Softened squares and circles using primary blue for selected states, ensuring they feel integrated with the overall shape language.
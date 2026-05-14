---
name: Premium E-Commerce System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5b4137'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#8f7065'
  outline-variant: '#e3bfb1'
  surface-tint: '#a63c00'
  primary: '#a63c00'
  on-primary: '#ffffff'
  primary-container: '#ff6000'
  on-primary-container: '#531a00'
  inverse-primary: '#ffb598'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#6648bf'
  on-tertiary: '#ffffff'
  tertiary-container: '#9d80fa'
  on-tertiary-container: '#33008c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#ffb598'
  on-primary-fixed: '#370e00'
  on-primary-fixed-variant: '#7e2c00'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e8deff'
  tertiary-fixed-dim: '#cdbdff'
  on-tertiary-fixed: '#20005f'
  on-tertiary-fixed-variant: '#4d2da6'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
---

## Brand & Style

This design system is built to elevate the high-volume e-commerce experience into a premium, curated environment. It bridges the gap between mass-market accessibility and boutique sophistication. The brand personality is characterized by efficiency, clarity, and reliability.

The visual style follows a **Modern Minimalist** approach. It prioritizes high-quality product photography by utilizing expansive white space and a restrained color palette. By removing unnecessary decorative elements and focusing on structural hierarchy, the UI ensures that the path to purchase is frictionless. The aesthetic is clean and rhythmic, evoking a sense of organized luxury that builds immediate user trust.

## Colors

The palette is centered around a sophisticated, high-vibrancy orange which serves as the primary action color. This color is used strategically for calls-to-action and critical navigational cues to maintain high conversion rates without overwhelming the user.

- **Primary**: A refined orange used for buttons, active states, and highlights.
- **Secondary**: A deep charcoal for primary typography and iconography, providing high legibility and a grounded feel.
- **Tertiary**: An accent purple used sparingly for special categories, promotions, or loyalty-program elements.
- **Neutral**: A range of cool grays used for borders, backgrounds, and secondary text to create a soft contrast against the dominant white surfaces.

The default mode is strictly light-themed to ensure a "clean and airy" retail environment that mimics high-end physical store layouts.

## Typography

This design system utilizes **Inter** for its systematic, utilitarian nature that scales perfectly from small captions to bold marketing headlines. The hierarchy is designed to guide the eye quickly through product titles, price points, and specifications.

Heavy weights (600-700) are reserved for headlines and pricing to ensure they stand out as the most important information on the page. Body text uses a generous line height to promote readability during long browsing sessions. Mobile headlines are scaled down to prevent awkward word wrapping while maintaining visual impact.

## Layout & Spacing

The layout is built on a **12-column fixed grid** for desktop environments, centering the content to provide a premium, balanced feel. On mobile and tablet devices, the layout transitions to a fluid grid to maximize screen real estate.

Spacing follows an 8px rhythmic scale. Gutters are kept wide (24px) to ensure that product cards have room to "breathe," preventing the UI from feeling cluttered even during high-density sales events. Margins are generous, pushing content away from the edges to focus the user's attention on the product gallery and purchase controls.

## Elevation & Depth

Depth is communicated through **ambient shadows** and **tonal layering**. This design system avoids heavy, dark shadows in favor of highly diffused, low-opacity (4-8%) shadows that make elements appear to float subtly above the background.

- **Level 0 (Base)**: Pure white background or light gray surface.
- **Level 1 (Cards)**: Subtle shadow to define product boundaries.
- **Level 2 (Dropdowns/Modals)**: Increased blur and slightly more opacity to pull the element forward.

Low-contrast outlines (#E5E5E5) are used on input fields and secondary containers to maintain a flat, modern aesthetic while providing enough structure for functional clarity.

## Shapes

The shape language is defined by **soft, approachable geometry**. UI elements use a base corner radius of 8px (0.5rem), which strikes a balance between the rigid precision of luxury brands and the friendly accessibility of modern e-commerce.

Larger components, such as marketing banners or primary containers, use an increased radius of 16px (1rem) to create a "containerized" look that feels modern and mobile-app inspired. Interactive elements like buttons and input fields remain consistent at 8px to ensure a unified tactile experience.

## Components

### Buttons
Primary buttons use the sophisticated orange background with white text, featuring 8px rounded corners. Secondary buttons use a ghost style with a neutral border and secondary text color.

### Product Cards
Cards are the cornerstone of this design system. They feature a white background, no visible border, and a subtle Level 1 shadow. The photography should always fill the top portion of the card, with a minimum 1:1 or 4:5 aspect ratio.

### Input Fields
Inputs use a minimal 1px border in a neutral gray. Upon focus, the border transitions to the primary orange with a soft 2px outer glow of the same color at 10% opacity.

### Chips & Badges
Small, rounded pills (Level 3 roundedness) are used for category filtering and product status (e.g., "New Arrival" or "Limited Stock"). These use low-saturation background tints of the primary or tertiary colors to remain informative but not distracting.

### Navigation
The header is kept lean with plenty of horizontal padding. Search bars are oversized with centered or left-aligned icons, emphasizing "speed to find."
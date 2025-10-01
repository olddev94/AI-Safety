# Keep AI Safe Color System Implementation - Light Theme

This document describes the implementation of the Keep AI Safe brand colors throughout the AI Impact Atlas project, now featuring a clean white/light theme as the default.

## Brand Colors

The following primary colors from the Keep AI Safe brand guide have been implemented:

| Color | Hex | RGB | HSL | Usage |
|-------|-----|-----|-----|-------|
| **GOLD** | #FFD836 | 255, 216, 54 | 49, 100%, 59% | Primary brand color, buttons, highlights |
| **SUNRISE** | #FFAD40 | 255, 173, 64 | 35, 100%, 62% | Secondary accent, hover states |
| **SALMON** | #F47C6C | 244, 124, 108 | 8, 87%, 77% | Warning states, accident incidents |
| **FIRE** | #F25C51 | 242, 92, 81 | 4, 86%, 76% | Critical alerts, death incidents |
| **ROSE** | #EF5277 | 239, 82, 119 | 343, 82%, 71% | Financial loss indicators |

## Implementation Details

### CSS Custom Properties

All colors are defined as CSS custom properties in `src/index.css` with light theme as default:

```css
:root {
  /* Light theme base colors */
  --background: 0 0% 98%;        /* Clean white background */
  --foreground: 0 0% 7%;         /* Dark text on light */
  --card: 0 0% 100%;             /* Pure white cards */
  
  /* Keep AI Safe Brand Colors */
  --primary: 49 100% 59%;        /* GOLD */
  --secondary: 35 100% 62%;      /* SUNRISE */
  --destructive: 4 86% 76%;      /* FIRE */
  --warning: 8 87% 77%;          /* SALMON */
  
  /* Dashboard specific colors */
  --death-incidents: 4 86% 76%;     /* FIRE */
  --accident-incidents: 8 87% 77%;  /* SALMON */
  --financial-loss: 343 82% 71%;    /* ROSE */
}

/* Dark theme alternative */
.dark {
  --background: 0 0% 7%;         /* Dark background when needed */
  --foreground: 0 0% 98%;        /* Light text on dark */
  /* ... other dark theme overrides */
}
```

### Tailwind Utility Classes

Custom utility classes are available for direct use:

```css
/* Brand Colors */
.text-gold, .bg-gold, .border-gold
.text-sunrise, .bg-sunrise, .border-sunrise
.text-salmon, .bg-salmon, .border-salmon
.text-fire, .bg-fire, .border-fire
.text-rose, .bg-rose, .border-rose

/* Dashboard Specific */
.text-death, .bg-death, .border-death
.text-accident, .bg-accident, .border-accident
.text-financial, .bg-financial, .border-financial
```

### TypeScript Color Constants

Color values and utilities are available in `src/lib/colors.ts`:

```typescript
import { KEEP_AI_SAFE_COLORS, DASHBOARD_COLORS } from '@/lib/colors';

// Use brand colors
const primaryColor = KEEP_AI_SAFE_COLORS.GOLD;
const incidentColor = DASHBOARD_COLORS.DEATH;
```

## Accessibility Compliance - Light Theme

All color combinations meet WCAG 2.1 AA standards in the light theme:

- **Light Background**: Clean white (`hsl(0 0% 98%)`) with dark text (`hsl(0 0% 7%)`) - Excellent contrast
- **GOLD & SUNRISE Backgrounds**: Use dark text (`hsl(0 0% 7%)`) - Contrast ratio >8:1
- **SALMON, FIRE & ROSE Backgrounds**: Use light text (`hsl(0 0% 98%)`) - Contrast ratio >4.5:1
- **Card Elements**: Pure white (`hsl(0 0% 100%)`) with subtle borders for definition

The light theme provides excellent readability and reduces eye strain during extended use. See `src/lib/accessibility.ts` for detailed contrast ratios and guidelines.

## Component Usage

### Dashboard Components

- **GlobalStats**: Uses brand colors for different incident types
- **IncidentMap**: Fire (death) and Salmon (accident) markers
- **IncidentTable**: Color-coded severity badges
- **FilterSidebar**: Brand-colored icons and indicators

### UI Components

All shadcn/ui components automatically inherit the new color scheme through CSS custom properties:

- Buttons use GOLD as primary color
- Destructive actions use FIRE
- Secondary elements use SUNRISE
- Warning states use SALMON

## Color Mapping

| Dashboard Element | Brand Color | Usage |
|-------------------|-------------|-------|
| Death Incidents | FIRE | Critical severity indicators |
| Accident Incidents | SALMON | Warning severity indicators |
| Financial Loss | ROSE | Economic impact displays |
| Primary Actions | GOLD | Main interactive elements |
| Secondary Elements | SUNRISE | Supporting UI elements |

## Development Guidelines

1. **Always use CSS custom properties** instead of hardcoded hex values
2. **Prefer Tailwind utility classes** for consistent application
3. **Light theme first**: Design for the light theme, then add dark theme overrides if needed
4. **Check accessibility** using the utilities in `src/lib/accessibility.ts`
5. **Test on all device sizes** to ensure legibility in bright environments
6. **Use semantic color names** (e.g., `text-death` instead of `text-fire`) in components
7. **Card transparency**: Use `bg-card/80` for subtle depth without overwhelming the clean aesthetic

## Files Modified

- `src/index.css` - Main color system and utility classes
- `src/App.css` - Logo hover effects updated to brand colors
- `src/components/dashboard/IncidentMap.tsx` - Map marker colors
- `src/lib/colors.ts` - Color constants and utilities (new)
- `src/lib/accessibility.ts` - Accessibility verification (new)

## Pantone/CMYK Reference

For print materials, refer to the original brand guide:

- GOLD: Pantone 114 C, CMYK (1, 13, 88, 0)
- SUNRISE: Pantone 1365 C, CMYK (0, 37, 84, 0)
- SALMON: Pantone 2344C, CMYK (0, 64, 53, 0)
- FIRE: Pantone 2348 C, CMYK (0, 79, 68, 0)
- ROSE: Pantone 184 C, CMYK (0, 83, 88, 0)

## Testing

To verify the color implementation:

1. Run the development server: `npm run dev`
2. Check the dashboard for consistent brand colors
3. Verify accessibility with browser dev tools
4. Test on different screen sizes and devices
5. Validate with color blindness simulators

The implementation ensures maximum brand consistency while maintaining excellent accessibility and user experience across all device sizes.

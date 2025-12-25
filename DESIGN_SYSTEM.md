# 🎨 Design System Documentation

This document outlines the design system used in the LearningShare application, based on **Neubrutalism** principles with custom theming support.

## Design Philosophy

### Neubrutalism

Our design embraces neubrutalism characteristics:

- **Bold borders** - Thick, high-contrast borders (2px)
- **Hard shadows** - Offset box shadows without blur
- **Vibrant colors** - Strong, contrasting color palette
- **Flat design** - Minimal gradients, bold blocks of color
- **Playful typography** - Bold, attention-grabbing text

### Principles

1. **Clarity** - Clear visual hierarchy and purpose
2. **Accessibility** - WCAG AA compliant colors and interactions
3. **Consistency** - Reusable patterns and components
4. **Responsiveness** - Mobile-first, adaptable layouts

---

## 🎨 Color Palette

### Theme System

The application supports three themes with CSS variables for dynamic theming:

#### Light Theme (Default)

```css
--bg-color: #fffefb; /* Page background - Warm white */
--surface-color: #ffffff; /* Card backgrounds - Pure white */
--primary-color: #ffb700; /* Primary actions - Bright yellow */
--primary-foreground: #000000; /* Text on primary - Black */
--secondary-color: #f8fafc; /* Secondary surfaces - Light gray */
--secondary-foreground: #0f172a; /* Text on secondary - Dark blue */
--border-color: #1a1a1a; /* Borders - Near black */
--text-main: #1a1a1a; /* Primary text - Near black */
--text-muted: #6b7280; /* Secondary text - Gray */
--card-bg: #fffbeb; /* Card background - Light yellow */
```

#### Dark Theme

```css
--bg-color: #1a1a1a; /* Page background - Dark gray */
--surface-color: #262626; /* Card backgrounds - Lighter dark */
--primary-color: #fbbf24; /* Primary actions - Amber */
--primary-foreground: #000000; /* Text on primary - Black */
--border-color: #ffffff; /* Borders - White */
--text-main: #ffffff; /* Primary text - White */
--text-muted: #a3a3a3; /* Secondary text - Light gray */
--card-bg: #262626; /* Card background - Same as surface */
```

#### Retro Theme

```css
--bg-color: #fdf6e3; /* Page background - Cream */
--surface-color: #eee8d5; /* Card backgrounds - Light tan */
--primary-color: #cb4b16; /* Primary actions - Rust orange */
--primary-foreground: #fffdf8; /* Text on primary - Off white */
--border-color: #657b83; /* Borders - Blue gray */
--text-main: #073642; /* Primary text - Dark cyan */
--text-muted: #93a1a1; /* Secondary text - Gray */
```

### Semantic Colors

| Purpose      | Light     | Dark                     | Description              |
| ------------ | --------- | ------------------------ | ------------------------ |
| Success BG   | `#dcfce7` | `rgba(21, 128, 61, 0.2)` | Success state background |
| Success Text | `#15803d` | `#4ade80`                | Success state text       |
| Error BG     | `#fef2f2` | `rgba(185, 28, 28, 0.2)` | Error state background   |
| Error Text   | `#b91c1c` | `#f87171`                | Error state text         |

---

## 📐 Spacing System

Based on a 4px base unit for consistency:

| Token     | Value | Usage                        |
| --------- | ----- | ---------------------------- |
| `0.25rem` | 4px   | Tiny gaps, icon spacing      |
| `0.5rem`  | 8px   | Small padding, tight spacing |
| `0.75rem` | 12px  | Compact elements             |
| `1rem`    | 16px  | Default spacing              |
| `1.5rem`  | 24px  | Section spacing              |
| `2rem`    | 32px  | Large spacing, card padding  |
| `3rem`    | 48px  | Extra large spacing          |

---

## 🔤 Typography

### Font Family

```css
--font-sans: 'Plus Jakarta Sans', 'Noto Sans JP', sans-serif;
```

- **Primary**: Plus Jakarta Sans (Latin characters)
- **Secondary**: Noto Sans JP (Japanese/Asian characters)
- **Fallback**: System sans-serif

### Type Scale

| Element   | Size            | Weight | Line Height | Usage                 |
| --------- | --------------- | ------ | ----------- | --------------------- |
| **H1**    | 2.5rem (40px)   | 800    | 1.2         | Page titles           |
| **H2**    | 2rem (32px)     | 700    | 1.3         | Section headings      |
| **H3**    | 1.5rem (24px)   | 700    | 1.4         | Subsection headings   |
| **H4**    | 1.25rem (20px)  | 600    | 1.5         | Card titles           |
| **Body**  | 1rem (16px)     | 400    | 1.5         | Main content          |
| **Small** | 0.875rem (14px) | 500    | 1.4         | Helper text, captions |
| **Tiny**  | 0.75rem (12px)  | 600    | 1.3         | Labels, tags          |

### Font Weights

- **Regular** (400) - Body text
- **Medium** (500) - Emphasized body text
- **Semi-Bold** (600) - Buttons, labels
- **Bold** (700) - Headings
- **Extra-Bold** (800) - Hero text, major headings

---

## 🎯 Component Styles

### Buttons

#### Variants

**Primary**

```css
background: var(--primary-color);
color: var(--primary-foreground);
border: 2px solid var(--border-color);
box-shadow: 4px 4px 0px 0px var(--border-color);
```

**Secondary**

```css
background: var(--secondary-color);
color: var(--secondary-foreground);
border: 2px solid var(--border-color);
box-shadow: 4px 4px 0px 0px var(--border-color);
```

**Outline**

```css
background: transparent;
color: var(--text-main);
border: 2px solid var(--border-color);
box-shadow: 4px 4px 0px 0px var(--border-color);
```

**Ghost**

```css
background: transparent;
color: var(--text-main);
border: none;
```

**Danger**

```css
background: var(--error-text);
color: white;
border: 2px solid var(--border-color);
box-shadow: 4px 4px 0px 0px var(--border-color);
```

#### Sizes

- **Small**: `padding: 0.5rem 1rem; font-size: 0.875rem;`
- **Medium**: `padding: 0.75rem 1.5rem; font-size: 1rem;`
- **Large**: `padding: 1rem 2rem; font-size: 1.125rem;`

#### States

**Hover**

```css
transform: translateY(-2px);
```

**Active**

```css
transform: translateY(0);
box-shadow: 2px 2px 0px 0px var(--border-color);
```

**Disabled**

```css
opacity: 0.5;
cursor: not-allowed;
```

### Cards

```css
background: var(--card-bg);
padding: 1.5rem;
border-radius: 12px;
border: 2px solid var(--border-color);
box-shadow: 4px 4px 0px 0px var(--border-color);
```

### Inputs

```css
background: var(--surface-color);
border: 2px solid var(--border-color);
border-radius: 8px;
padding: 0.75rem 1rem;
font-size: 1rem;
color: var(--text-main);
```

**Focus State**

```css
outline: 2px solid var(--primary-color);
outline-offset: 2px;
```

**Error State**

```css
border-color: var(--error-text);
```

---

## 🎭 Shadows

### Hard Shadows (Neubrutalism)

```css
--shadow-hard: 4px 4px 0px 0px #000000;
--shadow-hard-sm: 2px 2px 0px 0px #000000;
```

**In Dark Theme:**

```css
--shadow-hard: 4px 4px 0px 0px #ffffff;
--shadow-hard-sm: 2px 2px 0px 0px #ffffff;
```

No blur, pure offset shadows for that bold, flat aesthetic.

---

## 📏 Border Radius

| Token         | Value | Usage               |
| ------------- | ----- | ------------------- |
| `--radius-md` | 8px   | Inputs, small cards |
| `--radius-lg` | 12px  | Large cards, modals |

---

## 🎨 Z-Index Scale

Defined in `src/constants/ui.ts`:

```typescript
Z_INDEX: {
  BASE: 0,           // Default layer
  DROPDOWN: 100,     // Dropdowns, tooltips
  STICKY: 200,       // Sticky elements
  MODAL_BACKDROP: 900,
  MODAL: 1000,       // Modals, dialogs
  TOAST: 1100,       // Toast notifications
  TOOLTIP: 1200,     // Always on top
}
```

---

## ⚡ Animations & Transitions

### Durations

Defined in `src/constants/ui.ts`:

```typescript
ANIMATION: {
  FAST: 150,    // Micro-interactions (button hover)
  NORMAL: 300,  // Standard transitions (theme change)
  SLOW: 500,    // Complex animations (page transition)
}
```

### Standard Transitions

```css
transition: all 0.3s ease;
```

### Hover Interactions

```css
transform: translateY(-2px);
transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Breakpoints

Defined in `src/constants/ui.ts`:

```typescript
BREAKPOINTS: {
  MOBILE: 640,   // 0-640px
  TABLET: 768,   // 641-768px
  DESKTOP: 1024, // 769-1024px
  WIDE: 1280,    // 1025px+
}
```

### Usage Example

```css
@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 2rem;
  }
}
```

---

## 🧩 Component Usage Examples

### Button

```tsx
import { Button } from '@/components/ui';

// Primary button
<Button variant="primary" size="lg">
  Get Started
</Button>

// Loading state
<Button isLoading disabled>
  Saving...
</Button>

// Danger action
<Button variant="danger" onClick={handleDelete}>
  Delete Account
</Button>
```

### Input

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email Address"
  type="email"
  error={errors.email?.message}
  {...register('email')}
/>;
```

### Toast

```tsx
import { useToast } from '@/hooks';

const { showToast } = useToast();

// Success
showToast('Settings saved successfully!', 'success');

// Error with custom duration
showToast('Failed to upload file', 'error', 5000);

// Info
showToast('Your session will expire in 5 minutes', 'info');
```

### Loading

```tsx
import { Loading } from '@/components/ui';

// Fullscreen
<Loading fullScreen text="Loading your data..." />

// Inline small
<Loading size="sm" text="Uploading..." />
```

---

## ♿ Accessibility Guidelines

### Color Contrast

All color combinations meet WCAG AA standards:

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 against background

### Focus States

All interactive elements have visible focus indicators:

```css
outline: 2px solid var(--primary-color);
outline-offset: 2px;
```

### Keyboard Navigation

- Tab order follows visual layout
- All interactive elements are keyboard accessible
- Escape key closes modals/dialogs
- Enter/Space activates buttons

### ARIA Labels

Always provide labels for:

- Icon-only buttons
- Form inputs without visible labels
- Status updates
- Dynamic regions

```tsx
<button aria-label="Close dialog">
  <CloseIcon />
</button>

<div role="status" aria-live="polite">
  {updateMessage}
</div>
```

---

## 🎯 Best Practices

### Do's ✅

- Use CSS variables for all theme-specific values
- Follow the spacing scale consistently
- Provide hover/focus states for all interactive elements
- Use semantic HTML elements
- Add ARIA labels where needed
- Test with keyboard navigation
- Verify color contrast ratios

### Don'ts ❌

- Don't use pixel values directly (use CSS variables)
- Don't create custom shadows (use --shadow-hard)
- Don't bypass the spacing system
- Don't use blur on shadows (breaks neubrutalism aesthetic)
- Don't forget reduced motion support
- Don't omit focus indicators

---

## 🛠️ Implementing New Components

When creating new components:

1. **Use CSS Modules** for scoped styles
2. **Import variables** from `index.css`
3. **Follow variant pattern** (primary, secondary, etc.)
4. **Add accessibility** (ARIA, keyboard support)
5. **Support theming** (use CSS variables)
6. **Include hover states**
7. **Add error states** if applicable
8. **Wrap with React.memo** for performance
9. **Add TypeScript types**
10. **Export from barrel** (`index.ts`)

### Example Template

```tsx
import { memo } from 'react';
import clsx from 'clsx';
import styles from './NewComponent.module.css';

interface NewComponentProps {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const NewComponent = memo(
  ({
    variant = 'primary',
    disabled = false,
    className,
    children,
  }: NewComponentProps) => {
    return (
      <div
        className={clsx(
          styles.component,
          styles[variant],
          disabled && styles.disabled,
          className
        )}
        aria-disabled={disabled}
      >
        {children}
      </div>
    );
  }
);

NewComponent.displayName = 'NewComponent';
```

---

## 📚 Resources

- [Neubrutalism Design](https://hype4.academy/articles/design/neubrutalism-design)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Variables Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Plus Jakarta Sans Font](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

---

**Last Updated**: Dec 2025  
**Maintained by**: LearningShare Team

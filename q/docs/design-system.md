# QanDu Design System

This document provides guidelines for implementing QanDu's unified design language across the platform. The design system is inspired by the successful workspace components and should be used to create a cohesive user experience.

## Design Principles

1. **Minimal & Modern** - Clean, focused interfaces with modern aesthetics
2. **Contextual & Intelligent** - UI that adapts to user context and provides smart suggestions
3. **Subtle Animation** - Delightful but non-distracting motion to enhance usability
4. **Consistency** - Unified patterns that create a reliable, predictable experience

## Color System

### Primary Colors
- **Blue** - `#0066ff` (Primary brand color, used for CTAs, links, and active states)
- **Zinc/Gray** - Dark mode focused grayscale palette (Zinc-800 to Zinc-950 as base backgrounds)

### Accent Colors
- **Green** - `#10b981` (Success states, positive indicators)  
- **Pink** - `#ec4899` (Creative elements, highlights)
- **Amber** - `#f59e0b` (Warnings, attention elements)
- **Indigo** - `#6366f1` (Secondary accent, alternative highlights)

## Typography

- **Font Family**: System fonts (San Francisco on macOS/iOS, Segoe UI on Windows, Roboto on Android)
- **Base Size**: 16px (1rem)

### Hierarchy
- **Display/H1**: 3rem, bold
- **H2**: 2.25rem, bold
- **H3**: 1.5rem, semibold
- **H4**: 1.25rem, semibold
- **Body**: 1rem, normal
- **Small/Caption**: 0.875rem, normal

## Component Patterns

### Cards

Our card component uses a consistent style with subtle backdrop blur and border effects:

```jsx
<CardUnified variant="default">
  <CardUnifiedHeader>
    <CardUnifiedTitle>Card Title</CardUnifiedTitle>
    <CardUnifiedDescription>Optional description</CardUnifiedDescription>
  </CardUnifiedHeader>
  <CardUnifiedContent>
    Content goes here
  </CardUnifiedContent>
</CardUnified>
```

**Variants**:
- `default` - Standard card
- `active` - Highlighted active state (blue border)
- `interactive` - With hover effects for clickable cards

### Buttons

Unified button system with consistent styling across the application:

```jsx
<ButtonUnified>Default Button</ButtonUnified>
<ButtonUnified variant="secondary">Secondary Button</ButtonUnified>
<ButtonUnified variant="ghost">Ghost Button</ButtonUnified>
```

**Variants**:
- `default` - Blue primary action
- `secondary` - Dark gray secondary action 
- `ghost` - Text-only button for tertiary actions
- `blue-light` - Subtle blue background
- `zinc-light` - Subtle gray background
- `outline` - Border only
- `destructive` - Red for dangerous actions

**Sizes**:
- `default` - Standard button
- `sm` - Small button
- `lg` - Large button
- `icon` - Square icon button
- `icon-sm` - Small icon button

### Headers

Consistent page headers with breadcrumbs, icons, and action areas:

```jsx
<HeaderUnified
  title="Page Title"
  description="Optional subtitle for the page"
  icon={<Icon />}
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Current Page" }
  ]}
  actions={<ButtonUnified>Action</ButtonUnified>}
/>
```

## Layout Patterns

### Container
Standard container with consistent padding:
```jsx
<div className="container mx-auto py-4 px-6">
  Content
</div>
```

### Workspace Grid
Three-column grid for workspace cards:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <CardUnified key={item.id} variant="interactive">
      {/* Card content */}
    </CardUnified>
  ))}
</div>
```

### Split Layout
Content with optional sidebar:
```jsx
<div className="flex">
  <div className="flex-1 min-w-0">
    {/* Main content */}
  </div>
  {showSidebar && (
    <div className="w-80 border-l border-zinc-700">
      {/* Sidebar content */}
    </div>
  )}
</div>
```

## Common UI Patterns

### Entity Tags
Consistent styling for workspace entities:
```jsx
<span className="bg-blue-500/10 text-blue-400 rounded-md px-2 py-1 text-sm flex items-center">
  <Icon className="h-3 w-3 mr-1" />
  Entity Name
</span>
```

### Decorative Elements
Subtle decorative elements like the colorful blobs in workspace cards:
```jsx
<div className="relative">
  <CardUnifiedDecoration color="#3b82f6" />
  <CardUnified>
    {/* Card content */}
  </CardUnified>
</div>
```

### Context Panels
Expandable context panels for additional information:
```jsx
<div className={`border-l border-zinc-700 bg-zinc-800/50 w-80 transition-all duration-300 ${
  isExpanded ? 'translate-x-0' : 'translate-x-full'
}`}>
  Context panel content
</div>
```

## Animation Guidelines

- **Duration**: 300ms for standard transitions, 150ms for quick transitions
- **Easing**: Use cubic-bezier(0.4, 0, 0.2, 1) for most animations
- **Purpose**: Animations should provide feedback, guide attention, or reveal relationships

## Implementation Guidelines

1. **Import Design System Values**
   ```jsx
   import { colors, componentStyles } from '@/lib/design-system';
   ```

2. **Use Unified Components First**
   Always prefer unified components over crafting custom styles:
   ```jsx
   // Good
   <CardUnified variant="interactive">...</CardUnified>
   
   // Avoid
   <div className="custom-card">...</div>
   ```

3. **Extend, Don't Override**
   When customization is needed, extend the base styles using `cn()`:
   ```jsx
   <CardUnified className={cn(
     "my-custom-modifier"
   )}>...</CardUnified>
   ```

4. **Match Workspace Aesthetic**
   When creating new components, reference the workspace layout as the design ideal:
   - Dark backgrounds with subtle gradient
   - Light borders for separation
   - Generous spacing and padding
   - Subtle blue accents for interactivity 
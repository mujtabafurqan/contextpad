# ContextPad Style Guide

## Design Philosophy
Clean, modern, conversational interface. Minimal borders, subtle backgrounds, and focus on content over chrome. Think "conversation-first" rather than "application-first".

## Color Palette
```css
/* color palette */
Primary: bg-blue-500, text-blue-600, border-blue-100
Background: bg-white, bg-gray-25, bg-gray-50
Text: text-gray-900, text-gray-700, text-gray-500
Subtle Borders: border-gray-100, border-gray-150
Accents: bg-blue-25, bg-gray-25
Interactive: hover:bg-gray-50, hover:bg-blue-50
Focus: ring-blue-200, border-blue-300
```

## Layout Standards

### Spacing
```css
/* More generous, breathing room */
Panels: p-6 (24px padding)
Sections: mb-8 (32px bottom margin)  
Elements: mb-4 (16px between elements)
Small gaps: gap-3 (12px)
Medium gaps: gap-6 (24px)
Large gaps: gap-8 (32px)
```

### Typography
```css
/* Softer, more readable typography */
Page Title: text-2xl font-medium text-gray-900
Panel Headers: text-xl font-medium text-gray-800
Section Headers: text-lg font-medium text-gray-800
Labels: text-sm font-medium text-gray-700
Body Text: text-base text-gray-700
Helper Text: text-sm text-gray-500
Small Text: text-sm text-gray-400
```

### Buttons
```css
/* buttons - more subtle, less corporate */

/* Primary Button */
class="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"

/* Secondary Button */
class="px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-25 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all duration-200"

/* Toggle Button (Active) */
class="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-medium"

/* Toggle Button (Inactive) */
class="px-3 py-2 bg-white text-gray-600 rounded-lg border border-gray-150 hover:bg-gray-25 hover:border-gray-200 transition-all duration-200"

/* Minimal Button (for less important actions) */
class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200"
```

### Form Elements
```css
/* Softer, more approachable form styling */

/* Text Areas */
class="w-full p-4 bg-white border border-gray-150 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none transition-all duration-200 text-base"

/* Input Fields */
class="px-4 py-3 bg-white border border-gray-150 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200"

/* Labels */
class="block text-sm font-medium text-gray-700 mb-2"

/* Helper Text */
class="text-sm text-gray-500 mt-2"
```

### Panels & Containers
```css
/* Minimal, content-focused containers */

/* Main Panels */
class="bg-white h-full"

/* Panel Headers - no heavy borders */
class="px-6 py-4 border-b border-gray-100 flex items-center justify-between"

/* Content Areas */
class="p-6 h-full overflow-auto"

/* Dividers/Separators */
class="w-px bg-gray-150 hover:bg-blue-200 cursor-col-resize transition-colors duration-200"

/* Cards/Sections */
class="bg-white rounded-xl border border-gray-100 p-6"
```

## Component Templates

### Panel Header Template
```jsx
<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
  <h2 className="text-xl font-medium text-gray-800">{title}</h2>
  <div className="flex items-center gap-3">
    {/* Buttons go here */}
  </div>
</div>
```

### Button Group Template
```jsx
<div className="flex items-center gap-2">
  <button className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-medium">
    Active
  </button>
  <button className="px-3 py-2 bg-white text-gray-600 rounded-lg border border-gray-150 hover:bg-gray-25 transition-all duration-200">
    Inactive
  </button>
</div>
```

### Form Section Template
```jsx
<div className="mb-8">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    {label}
  </label>
  <textarea 
    className="w-full p-4 bg-white border border-gray-150 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none transition-all duration-200 text-base"
    rows="6"
    placeholder="Add your context here..."
  />
  <div className="text-sm text-gray-500 mt-2">
    {helperText}
  </div>
</div>
```

### Context Section Template
```jsx
<div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
  <div className="flex items-center gap-2 mb-3">
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
  </div>
  <div className="space-y-4">
    {/* Content */}
  </div>
</div>
```

## Icons & Visual Elements

### Use Lucide React Icons (16px default)
```jsx
import { Edit3, Eye, MoreHorizontal, Plus, X } from 'lucide-react'

/* Icon in buttons */
<button className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg">
  <Edit3 size={16} />
  Edit
</button>

/* Icon-only button */
<button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg">
  <MoreHorizontal size={16} />
</button>
```

### Character Counters
```jsx
/* Green: under 20k */
<div className="flex items-center gap-1">
  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
  <span className="text-sm text-green-600">1,234 characters</span>
</div>

/* Yellow: 20k-40k */
<div className="flex items-center gap-1">
  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
  <span className="text-sm text-yellow-600">25,678 characters</span>
</div>

/* Red: over 40k */
<div className="flex items-center gap-1">
  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
  <span className="text-sm text-red-600">45,123 characters</span>
</div>
```

## Mobile Responsive Rules

### Breakpoints
```css
/* Mobile First - same as before */
Mobile: Default (no prefix)
Tablet: md: (768px+)
Desktop: lg: (1024px+)
```

### Mobile Adaptations
```css
/* More generous mobile spacing */
class="p-4 md:p-6"
class="gap-4 md:gap-6"
class="text-lg md:text-xl"
```

## Layout Example
```jsx
/* overall layout */
<div className="h-screen bg-gray-25 flex flex-col">
  {/* Header - minimal, clean */}
  <header className="bg-white border-b border-gray-100 px-6 py-4">
    <h1 className="text-2xl font-medium text-gray-900">ContextPad</h1>
  </header>
  
  {/* Main Content */}
  <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
    {/* Context Panel */}
    <div className="w-full md:w-1/2 bg-white flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-medium text-gray-800">Context</h2>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {/* Content with cards */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-medium text-gray-800">Project Context</h3>
          </div>
          {/* Context content */}
        </div>
      </div>
    </div>
    
    {/* Subtle divider */}
    <div className="w-px bg-gray-150"></div>
    
    {/* Editor Panel */}
    <div className="w-full md:w-1/2 bg-white flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-800">Editor</h2>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-medium flex items-center gap-2">
            <Eye size={16} />
            Preview
          </button>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {/* Editor content */}
      </div>
    </div>
  </div>
</div>
```

## IMPORTANT RULES FOR CLAUDE CODE
1. **ALWAYS use these exact Tailwind classes** - don't create custom CSS
2. **NO arbitrary values** like `w-[45%]` - use standard Tailwind
3. **Include hover and focus states** on all interactive elements
4. **Use the component templates** above as starting points
5. **Add proper spacing** with the specified margin/padding classes
6. **Make everything touch-friendly** (44px minimum touch targets)
7. **Use rounded-xl for containers** (12px border radius)
8. **Use rounded-lg for buttons** (8px border radius)
9. **Minimal borders** - only border-gray-100 and border-gray-150
10. **Generous padding** - p-6 for main areas, p-4 for smaller elements
11. **Subtle shadows** - avoid heavy shadows, use subtle borders instead
12. **Transition everything** - add transition-all duration-200 to interactive elements
13. **Content-first** - less chrome, more focus on the actual content
14. **Breathing room** - use gap-6 and mb-8 for generous spacing

## When to Use Each Style

### Blue Accents
- Primary actions (Submit, Save)
- Active states
- Focus indicators
- Accent dots for sections

### Gray Backgrounds
- App background: bg-gray-25
- Subtle emphasis: bg-gray-50
- Cards/sections: bg-white with border

### Borders
- Very subtle: border-gray-100
- Form elements: border-gray-150
- Interactive hover: border-gray-200
# ContextPad Architecture

## Overview
ContextPad is a web-based documentation editor that combines persistent context with AI-assisted writing. The architecture is designed to start simple but scale gracefully as features are added.

## Current Architecture (Phase 1)

### Current Implementation Status
- ✅ Basic two-panel layout (Context | Editor)
- ✅ Draggable panel resize with 20%-80% constraints
- ✅ Responsive design with mobile support
- ✅ Zustand state management for UI state
- ✅ UI enhancements (character counters, clear buttons, auto-resize)
- ✅ CodeMirror 6 integration for enhanced markdown editing
- 🔄 Service layer components (planned)
- 🔄 AI integration (planned)
- 🔄 Storage services (planned)

### System Diagram
```
┌─────────────────────────────────────┐
│           Frontend App              │
├─────────────────────────────────────┤
│  UI Layer (React Components)       │
│  ├─ Context Panel (implemented)    │
│  ├─ Editor Panel (implemented)     │
│  ├─ Diff Viewer (planned)          │
│  └─ Export Tools (planned)         │
├─────────────────────────────────────┤
│  Service Layer (Backend-Ready)     │
│  ├─ DocumentService (planned)      │
│  ├─ AIService (planned)            │
│  ├─ StorageService (planned)       │
│  └─ ExportService (planned)        │
├─────────────────────────────────────┤
│  Storage Layer                     │
│  ├─ LocalStorage (planned)         │
│  └─ API Client (future)            │
└─────────────────────────────────────┘
```

### Current Layout Structure
```
┌─────────────────────────────────┐
│          Header                 │
├─────────────────────────────────┤
│  Context Panel ║│ Editor Panel  │
│   (20%-80%)    ║│  (20%-80%)    │
│                ║│               │
│  - Persistent  ║│ - Markdown    │
│    context     ║│   editor      │
│  - Temporary   ║│ - Content     │
│    context     ║│   area        │
│                ║│               │
└─────────────────────────────────┘
      ║│ = Draggable divider

### Data Flow
```
Frontend → LocalStorage
         → AI APIs (OpenAI/Anthropic)
```

## Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Editor**: CodeMirror 6 with markdown language support
- **Markdown**: marked.js (future integration)
- **Diff Engine**: jsdiff (planned)
- **State Management**: Zustand
- **Testing**: Playwright for visual testing
- **Deployment**: Vercel

### Storage & APIs
- **Local Storage**: Enhanced localStorage for documents and context
- **AI Integration**: Direct OpenAI API calls (user's API key)
- **Future Backend**: RESTful API with database

## Core Components

### 1. UI Layer Components
- **Editor Component**: CodeMirror-based markdown editor with syntax highlighting
- **Context Panel**: Dual-area context management (persistent + temporary)
- **Diff Viewer**: GitHub-style change visualization and acceptance
- **Export Tools**: Multiple format export (markdown, HTML, clipboard)

### 2. Service Layer
- **DocumentService**: Document CRUD, auto-save, versioning
- **AIService**: AI API integration, prompt building, response parsing
- **StorageService**: Abstracted storage interface (localStorage → API)
- **ExportService**: Multi-format document export capabilities

### 3. Storage Layer
- **LocalStorage**: Browser-based persistence with structured data
- **Future API Client**: RESTful backend integration ready

## Data Models

### Document Structure
```typescript
interface Document {
  id: string;
  title: string;
  content: string; // Markdown
  lastModified: Date;
  wordCount: number;
}
```

### Context Structure
```typescript
interface Context {
  persistent: {
    content: string;
    template: string;
    lastModified: Date;
  };
  temporary: {
    content: string;
  };
}
```

### Enhancement Structure
```typescript
interface Enhancement {
  original: string;
  enhanced: string;
  changes: Change[];
}

interface Change {
  type: 'addition' | 'deletion' | 'modification';
  position: number;
  content: string;
  accepted: boolean;
}
```

## Design Principles

### 1. Backend-Ready Architecture
All services use interfaces that can swap between local and remote implementations without UI changes.

### 2. Local-First Approach
Core functionality works entirely offline. Backend features are additive, not required.

### 3. Progressive Enhancement
Start with essential features, add complexity only when validated by user needs.

### 4. Component Isolation
Each major feature is a separate module with well-defined interfaces for easy testing and modification.

## Future Migration Path

### Phase 2: Hybrid (Team Features)
- Add simple backend for document sharing
- Maintain local storage as primary
- Introduce user authentication

### Phase 3: Full Backend (Collaboration)
- Real-time collaborative editing
- Team workspaces and permissions
- Advanced AI features and cost management

## Development Guidelines

### Project Structure
```
src/
├── components/          # React UI components
├── services/           # Business logic services
├── types/              # TypeScript interfaces
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── stores/             # Zustand state stores
```

### Key Decisions
- **TypeScript**: Mandatory for maintainability
- **Service Abstraction**: All external dependencies behind interfaces
- **Component Composition**: Small, focused components over large ones
- **State Management**: Zustand for simple, scalable state
- **Testing Strategy**: Unit tests for services, integration tests for user flows

## Performance Considerations
- **Lazy Loading**: Load AI features only when needed
- **Debounced Operations**: Auto-save and real-time preview
- **Memory Management**: Limit stored document history
- **Bundle Optimization**: Code splitting for optional features

This architecture enables rapid development while maintaining a clear path to enterprise-scale features.

## CodeMirror 6 Integration

### Implementation Details
ContextPad now uses CodeMirror 6 for the main markdown editor, providing enhanced editing capabilities while maintaining the clean design aesthetic.

### Architecture
- **useCodeMirror Hook**: Custom React hook managing editor lifecycle, state synchronization, and extensions
- **CodeMirrorEditor Component**: Wrapper component providing React interface with proper TypeScript types
- **State Synchronization**: Two-way binding between Zustand store and CodeMirror state
- **Theme Integration**: Custom theme matching ContextPad's Tailwind CSS design system

### Features Implemented

#### Phase 1: Basic Integration ✅
- **Markdown Syntax Highlighting**: Full markdown language support with syntax highlighting
- **Responsive Design**: Optimized for both desktop and mobile viewports
- **State Preservation**: Content state managed through existing Zustand store
- **Character Counting**: Integration with existing character counter components
- **Clear Button**: Seamless integration with existing clear functionality

#### Phase 2: Enhanced Features ✅
- **Advanced Syntax Highlighting**: Custom theme matching ContextPad's design system
- **Search & Replace**: Built-in search functionality with keyboard shortcuts (Ctrl+F)
- **Line Numbers Toggle**: User-controllable line numbers display
- **Code Folding**: Collapsible markdown sections for better organization
- **Selection Highlighting**: Matching selection highlighting throughout document
- **Active Line Highlighting**: Visual indicator for current editing line

#### Phase 3: Polish & Testing ✅
- **Enhanced Theme System**: Professional light theme with proper color coding
- **Keyboard Shortcuts**: Full editor command support (Ctrl+Z, Ctrl+Y, Ctrl+F, etc.)
- **History Management**: Advanced undo/redo with proper state tracking
- **Bracket Matching**: Automatic matching for markdown syntax elements
- **Responsive Controls**: UI toggles for editor preferences

### Technical Implementation
```typescript
// Core packages used:
- codemirror: ^6.0.2
- @codemirror/lang-markdown: ^6.3.3
- @codemirror/state: ^6.5.2
- @codemirror/view: ^6.38.1
- @codemirror/commands: ^6.8.1
- @codemirror/search: ^6.5.11
- @codemirror/language: ^6.11.2
- @codemirror/fold: ^0.19.4
- @codemirror/autocomplete: ^6.18.6
- @lezer/highlight: ^1.2.1
```

### User Interface Controls
- **Line Numbers Toggle**: Checkbox control in editor section
- **Code Folding Toggle**: Checkbox control in editor section
- **Search Panel**: Accessible via Ctrl+F keyboard shortcut
- **Enhanced Clear Button**: Integrated with existing UI patterns

### Integration Strategy
- **Minimal Disruption**: Only replaced main editor textarea, preserving context panel textareas
- **Feature Preservation**: All existing functionality (character counters, clear buttons) maintained
- **Performance**: CodeMirror 6's efficient rendering for large documents
- **Accessibility**: Maintains focus management and keyboard navigation

### Visual Testing
The integration has been validated through comprehensive Playwright visual tests:

#### Phase 1 Testing ✅
- ✅ UI consistency across desktop and mobile viewports
- ✅ Character counter integration works correctly
- ✅ Clear button functionality preserved
- ✅ Edit/Preview mode switching functions properly
- ✅ Content state synchronization works as expected

#### Phase 2/3 Enhanced Testing ✅
- ✅ **Search functionality**: Ctrl+F opens search panel with highlighting
- ✅ **Line numbers toggle**: UI control enables/disables line numbers
- ✅ **Syntax highlighting**: Markdown elements properly styled
- ✅ **Code folding**: Gutter controls available for section folding
- ✅ **Enhanced theme**: Professional appearance matching design system
- ✅ **8 screenshots captured** demonstrating all enhanced features
- ✅ **Desktop-focused testing** (mobile responsiveness deferred as requested)

## FormattingToolbar Integration

### Implementation Details
ContextPad now includes a comprehensive formatting toolbar positioned above the CodeMirror editor, providing Word/Confluence-style markdown formatting controls.

### Architecture
- **FormattingToolbar Component**: React component with 11 formatting actions grouped logically
- **Action Integration**: Direct integration with CodeMirror EditorView for real-time text manipulation
- **Keyboard Shortcuts**: Consistent keyboard shortcuts matching industry standards
- **Visual Design**: Follows STYLE_GUIDE.md patterns with proper spacing and hover states

### Features Implemented

#### Formatting Actions ✅
- **Text Formatting Group**: Bold (Ctrl+B), Italic (Ctrl+I), Code (Ctrl+`), Strikethrough
- **Headings Group**: H1 (Ctrl+1), H2 (Ctrl+2), H3 (Ctrl+3)
- **Lists & Structure Group**: Bullet List (Ctrl+Shift+8), Numbered List (Ctrl+Shift+7), Blockquote, Horizontal Rule

#### Technical Implementation
```typescript
// Core functionality:
- wrapText(): Wraps selected text or inserts placeholder
- formatLine(): Converts current line to specific format
- insertText(): Inserts text at cursor position
- Keyboard shortcuts integrated via CodeMirror keymap
```

#### User Experience
- **Smart Text Handling**: Wraps selected text or inserts placeholders with proper selection
- **Line Format Conversion**: Automatically removes existing prefixes before applying new ones
- **Visual Feedback**: Hover states and tooltips showing keyboard shortcuts
- **Focus Management**: Maintains editor focus after formatting actions

### Integration Strategy
- **Container Layout**: Toolbar and editor wrapped in bordered container for unified appearance
- **Theme Coordination**: Editor theme updated to work seamlessly with toolbar container
- **State Synchronization**: EditorView exposed through component ref for external toolbar access

### Future Enhancements
- **Active State Detection**: Visual indication of current formatting state
- **Auto-completion**: Enhanced markdown and content suggestions
- **Vim keybindings**: Optional vim mode for power users
- **Dark theme**: Theme switching capability (light/dark modes)
- **Mobile optimization**: Enhanced mobile editing experience
- **Advanced search**: Regular expression and case-sensitive search options
- **Export options**: Direct export from editor to various formats

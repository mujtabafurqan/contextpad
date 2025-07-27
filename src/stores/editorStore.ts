import { create } from 'zustand';

export type EditorMode = 'edit' | 'preview';

interface EditorState {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  toggleMode: () => void;
  // Panel resize state
  contextPanelWidth: number;
  editorPanelWidth: number;
  setContextPanelWidth: (width: number) => void;
  isResizing: boolean;
  setIsResizing: (resizing: boolean) => void;
  // Content state
  projectContext: string;
  temporaryNotes: string;
  editorContent: string;
  setProjectContext: (content: string) => void;
  setTemporaryNotes: (content: string) => void;
  setEditorContent: (content: string) => void;
  clearProjectContext: () => void;
  clearTemporaryNotes: () => void;
  clearEditorContent: () => void;
  // Editor preferences
  showLineNumbers: boolean;
  setShowLineNumbers: (show: boolean) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  mode: 'edit',
  setMode: (mode) => set({ mode }),
  toggleMode: () => set({ mode: get().mode === 'edit' ? 'preview' : 'edit' }),
  // Panel resize state - default 50/50 split
  contextPanelWidth: 50,
  editorPanelWidth: 50,
  setContextPanelWidth: (width) => {
    const clampedWidth = Math.max(20, Math.min(80, width));
    set({ 
      contextPanelWidth: clampedWidth,
      editorPanelWidth: 100 - clampedWidth 
    });
  },
  isResizing: false,
  setIsResizing: (resizing) => set({ isResizing: resizing }),
  // Content state
  projectContext: '',
  temporaryNotes: '',
  editorContent: `# Welcome to ContextPad

This is your markdown editor with **bold**, *italic*, and \`inline code\` support.

## Testing Complex Formatting

Here are some complex formatting tests:

- **Bold text** should work correctly
- *Italic text* should work correctly  
- \`inline code\` should render properly
- ***Bold and italic together***
- **Bold with \`code inside\`**
- *Italic with \`code inside\`*

### Code Examples

Inline code: \`console.log('hello')\`

Code block:
\`\`\`javascript
function test() {
  return "Hello World";
}
\`\`\`

## Sticky Toolbar Test

This content is designed to test the sticky formatting toolbar. The toolbar should remain visible when you scroll through this long document.

### Section 1: Formatting Features

The ContextPad editor now includes:

1. **Sticky Formatting Toolbar** - Stays at the top while scrolling
2. **Reorganized Header** - Line numbers toggle moved to header
3. **Always-on Code Folding** - No need for a checkbox
4. **Clean Interface** - Removed redundant labels

### Section 2: More Content

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

#### Subsection A
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

#### Subsection B
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.

### Section 3: Testing Scrolling

The formatting toolbar should remain fixed at the top of the editor area as you scroll through this content. Try using the formatting buttons while scrolled down to verify they work correctly.

\`\`\`python
def sticky_toolbar_test():
    """
    This code block tests that syntax highlighting
    and code folding work correctly with the new layout.
    """
    features = [
        "Sticky toolbar",
        "Clean header",
        "Always-on folding",
        "Better UX"
    ]
    return features
\`\`\`

### Section 4: Final Testing

More content here to ensure we have enough to scroll through and properly test the sticky toolbar functionality.

**Try switching to Preview mode to see the rendering!**`,
  setProjectContext: (content) => set({ projectContext: content }),
  setTemporaryNotes: (content) => set({ temporaryNotes: content }),
  setEditorContent: (content) => set({ editorContent: content }),
  clearProjectContext: () => set({ projectContext: '' }),
  clearTemporaryNotes: () => set({ temporaryNotes: '' }),
  clearEditorContent: () => set({ editorContent: '' }),
  // Editor preferences
  showLineNumbers: false,
  setShowLineNumbers: (show) => set({ showLineNumbers: show }),
}));
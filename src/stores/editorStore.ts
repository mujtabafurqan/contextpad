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
  enableFolding: boolean;
  setShowLineNumbers: (show: boolean) => void;
  setEnableFolding: (enable: boolean) => void;
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

**Try switching to Preview mode to see the rendering!**`,
  setProjectContext: (content) => set({ projectContext: content }),
  setTemporaryNotes: (content) => set({ temporaryNotes: content }),
  setEditorContent: (content) => set({ editorContent: content }),
  clearProjectContext: () => set({ projectContext: '' }),
  clearTemporaryNotes: () => set({ temporaryNotes: '' }),
  clearEditorContent: () => set({ editorContent: '' }),
  // Editor preferences
  showLineNumbers: false,
  enableFolding: true,
  setShowLineNumbers: (show) => set({ showLineNumbers: show }),
  setEnableFolding: (enable) => set({ enableFolding: enable }),
}));
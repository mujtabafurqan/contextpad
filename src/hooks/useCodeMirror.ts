import { useEffect, useRef, useCallback, useMemo } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, ViewUpdate } from '@codemirror/view';
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands';
import { searchKeymap } from '@codemirror/search';
import { markdown } from '@codemirror/lang-markdown';
import { foldGutter, indentOnInput, bracketMatching, foldKeymap } from '@codemirror/language';
import { highlightActiveLineGutter, highlightActiveLine } from '@codemirror/view';
import { contextPadTheme } from '../themes/editorThemes';

// Note: Formatting commands moved to FormattingToolbar component
// to avoid duplication and ensure consistent behavior

interface UseCodeMirrorOptions {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string | undefined;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  enableFolding?: boolean;
}

export function useCodeMirror({
  value,
  onChange,
  placeholder = '',
  readOnly = false,
  showLineNumbers = false,
  enableFolding = true
}: UseCodeMirrorOptions) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const isUpdatingRef = useRef(false);
  const onChangeRef = useRef(onChange);

  // Update the onChange ref when it changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Create editor extensions
  const extensions = useMemo(() => {
    const baseExtensions = [
      // Core markdown support
      markdown(),
      
      // Enhanced theme with syntax highlighting
      ...contextPadTheme.extensions,
      
      // History support for undo/redo
      history(),
      
      // Line wrapping for long lines
      EditorView.lineWrapping,
      
      // Keyboard shortcuts
      keymap.of([
        ...defaultKeymap, 
        ...historyKeymap,
        ...searchKeymap,
        ...(enableFolding ? foldKeymap : [])
      ]),
      
      // Language features
      indentOnInput(),
      bracketMatching(),
      
      // Keep active line highlighting but remove selection match highlighting
      highlightActiveLine(),
      
      // Read-only state
      EditorState.changeFilter.of(() => !readOnly),
      EditorView.editable.of(!readOnly),
    ];

    // Optional line numbers
    if (showLineNumbers) {
      baseExtensions.push(
        lineNumbers(),
        highlightActiveLineGutter()
      );
    }

    // Optional code folding
    if (enableFolding) {
      baseExtensions.push(foldGutter());
    }

    // Placeholder handling
    if (placeholder) {
      baseExtensions.push(
        EditorView.domEventHandlers({
          focus: (_event, view) => {
            if (!view.state.doc.length && placeholder) {
              view.dom.setAttribute('data-placeholder', placeholder);
            }
          },
          blur: (_event, view) => {
            view.dom.removeAttribute('data-placeholder');
          }
        })
      );
    }

    return baseExtensions;
  }, [readOnly, placeholder, showLineNumbers, enableFolding]);

  // Handle content changes - stable callback using ref
  const onDocumentChange = useCallback((update: ViewUpdate) => {
    if (update.docChanged && !isUpdatingRef.current) {
      const newValue = update.state.doc.toString();
      onChangeRef.current(newValue);
    }
  }, []); // No dependencies - uses ref

  // Initialize editor (only once or when extensions change)
  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: value,
      extensions: [
        ...extensions,
        EditorView.updateListener.of(onDocumentChange)
      ]
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // NOTE: We intentionally don't include 'value' in dependencies to avoid
    // recreating the editor on every content change (which would lose focus)
    // Content updates are handled separately in the next useEffect
  }, [extensions, onDocumentChange]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== value) {
      isUpdatingRef.current = true;
      
      const transaction = viewRef.current.state.update({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value
        }
      });
      
      viewRef.current.dispatch(transaction);
      isUpdatingRef.current = false;
    }
  }, [value]);

  // Focus method
  const focus = useCallback(() => {
    if (viewRef.current) {
      viewRef.current.focus();
    }
  }, []);

  // Get current character count
  const getCharacterCount = useCallback(() => {
    if (viewRef.current) {
      return viewRef.current.state.doc.length;
    }
    return 0;
  }, []);

  // Get editor view for external access
  const getEditorView = useCallback(() => {
    return viewRef.current;
  }, []);

  return {
    editorRef,
    focus,
    getCharacterCount,
    getEditorView,
    editorView: viewRef.current
  };
}
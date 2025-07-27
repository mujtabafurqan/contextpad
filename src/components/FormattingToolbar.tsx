import React, { useCallback, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Code, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Minus 
} from 'lucide-react';
import type { EditorView } from '@codemirror/view';
import type { CodeMirrorEditorRef } from './CodeMirrorEditor';

interface FormattingToolbarProps {
  editorRef: React.RefObject<CodeMirrorEditorRef | null>;
}

interface FormattingAction {
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  action: (view: EditorView) => void;
  isActive?: (view: EditorView) => boolean;
  type: 'wrap' | 'line' | 'insert';
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({ editorRef }) => {
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});

  // Helper function to detect if text is already formatted with precise matching
  const isTextFormatted = useCallback((text: string, before: string, after: string = before): boolean => {
    if (!text.startsWith(before) || !text.endsWith(after) || text.length <= before.length + after.length) {
      return false;
    }
    
    // Additional check for bold vs italic distinction
    if (before === '*' && after === '*') {
      // For italic, make sure it's not actually bold formatting
      return text.startsWith('*') && text.endsWith('*') && !text.startsWith('**') && !text.endsWith('**');
    } else if (before === '**' && after === '**') {
      // For bold, ensure it starts and ends with exactly **
      return text.startsWith('**') && text.endsWith('**');
    }
    
    // For other formats, use simple matching
    return true;
  }, []);

  // Helper function to detect surrounding formatting with precise boundary checking
  const getSurroundingFormat = useCallback((view: EditorView, before: string, after: string = before) => {
    const { state } = view;
    const { from, to } = state.selection.main;
    const beforeStart = Math.max(0, from - before.length);
    const afterEnd = Math.min(state.doc.length, to + after.length);
    
    const beforeText = state.doc.sliceString(beforeStart, from);
    const afterText = state.doc.sliceString(to, afterEnd);
    
    // For precise detection, we need to check boundaries more carefully
    // This prevents italic (*) from matching inside bold (**)
    let hasBefore = false;
    let hasAfter = false;
    
    if (beforeText.endsWith(before)) {
      // Additional check for bold vs italic distinction
      if (before === '*' && beforeText.length >= 2 && beforeText.endsWith('**')) {
        // Don't match single * if we're actually inside **
        hasBefore = false;
      } else if (before === '**' && beforeText.endsWith('**')) {
        hasBefore = true;
      } else if (before === '*' && beforeText.endsWith('*') && !beforeText.endsWith('**')) {
        hasBefore = true;
      } else if (before !== '*' && before !== '**') {
        hasBefore = true;
      }
    }
    
    if (afterText.startsWith(after)) {
      // Additional check for bold vs italic distinction
      if (after === '*' && afterText.length >= 2 && afterText.startsWith('**')) {
        // Don't match single * if we're actually inside **
        hasAfter = false;
      } else if (after === '**' && afterText.startsWith('**')) {
        hasAfter = true;
      } else if (after === '*' && afterText.startsWith('*') && !afterText.startsWith('**')) {
        hasAfter = true;
      } else if (after !== '*' && after !== '**') {
        hasAfter = true;
      }
    }
    
    return {
      hasBefore,
      hasAfter,
      beforeStart,
      afterEnd
    };
  }, []);

  // Smart wrap function with toggle functionality
  const wrapText = useCallback((view: EditorView, before: string, after: string = before) => {
    const { state } = view;
    const { from, to } = state.selection.main;
    const selectedText = state.doc.sliceString(from, to);
    
    if (selectedText) {
      // Check if selected text is already formatted
      if (isTextFormatted(selectedText, before, after)) {
        // Remove formatting
        const unwrapped = selectedText.slice(before.length, -after.length);
        view.dispatch({
          changes: { from, to, insert: unwrapped },
          selection: { anchor: from, head: from + unwrapped.length }
        });
      } else {
        // Check if selection is surrounded by formatting
        const surrounding = getSurroundingFormat(view, before, after);
        if (surrounding.hasBefore && surrounding.hasAfter) {
          // Remove surrounding formatting
          view.dispatch({
            changes: [
              { from: surrounding.beforeStart, to: from, insert: '' },
              { from: to - before.length, to: surrounding.afterEnd - before.length, insert: '' }
            ],
            selection: { anchor: from - before.length, head: to - before.length }
          });
        } else {
          // Add formatting
          const replacement = `${before}${selectedText}${after}`;
          view.dispatch({
            changes: { from, to, insert: replacement },
            selection: { anchor: from, head: from + replacement.length }
          });
        }
      }
    } else {
      // No selection - check cursor position
      const surrounding = getSurroundingFormat(view, before, after);
      if (surrounding.hasBefore && surrounding.hasAfter) {
        // Cursor is between formatting markers - remove them
        view.dispatch({
          changes: [
            { from: surrounding.beforeStart, to: from, insert: '' },
            { from: to - before.length, to: surrounding.afterEnd - before.length, insert: '' }
          ],
          selection: { anchor: from - before.length }
        });
      } else {
        // Insert formatting markers with cursor positioned inside
        const replacement = `${before}${after}`;
        view.dispatch({
          changes: { from, insert: replacement },
          selection: { anchor: from + before.length }
        });
      }
    }
    view.focus();
  }, [isTextFormatted, getSurroundingFormat]);

  // Smart format line function with toggle functionality
  const formatLine = useCallback((view: EditorView, prefix: string, placeholder?: string) => {
    const { state } = view;
    const { from } = state.selection.main;
    const line = state.doc.lineAt(from);
    const lineText = line.text;
    
    // Check if line already has the same prefix (toggle functionality)
    if (lineText.startsWith(prefix)) {
      // Remove the prefix (toggle off)
      const cleanText = lineText.slice(prefix.length);
      view.dispatch({
        changes: { from: line.from, to: line.to, insert: cleanText },
        selection: { anchor: line.from + cleanText.length }
      });
    } else {
      // Remove any existing prefix first
      const prefixes = ['# ', '## ', '### ', '- ', '> '];
      let cleanText = lineText;
      for (const p of prefixes) {
        if (lineText.startsWith(p)) {
          cleanText = lineText.slice(p.length);
          break;
        }
      }
      
      // Remove numbered list prefix
      const numberedListMatch = lineText.match(/^\d+\.\s/);
      if (numberedListMatch) {
        cleanText = lineText.slice(numberedListMatch[0].length);
      }
      
      // Add new prefix
      const newText = placeholder && !cleanText.trim() ? 
        `${prefix}${placeholder}` : 
        `${prefix}${cleanText}`;
      
      view.dispatch({
        changes: { from: line.from, to: line.to, insert: newText },
        selection: { anchor: line.from + newText.length }
      });
    }
    view.focus();
  }, []);

  // Helper function to insert text at cursor
  const insertText = useCallback((view: EditorView, text: string) => {
    const { state } = view;
    const { from } = state.selection.main;
    
    view.dispatch({
      changes: { from, insert: `\n${text}\n` },
      selection: { anchor: from + text.length + 2 }
    });
    view.focus();
  }, []);

  // Active state detection functions
  const isWrapActive = useCallback((view: EditorView, before: string, after: string = before): boolean => {
    const { state } = view;
    const { from, to } = state.selection.main;
    
    if (from !== to) {
      // Check if selected text is formatted
      const selectedText = state.doc.sliceString(from, to);
      return isTextFormatted(selectedText, before, after);
    } else {
      // Check if cursor is surrounded by formatting
      const surrounding = getSurroundingFormat(view, before, after);
      return surrounding.hasBefore && surrounding.hasAfter;
    }
  }, [isTextFormatted, getSurroundingFormat]);

  const isLineActive = useCallback((view: EditorView, prefix: string): boolean => {
    const { state } = view;
    const { from } = state.selection.main;
    const line = state.doc.lineAt(from);
    return line.text.startsWith(prefix);
  }, []);


  // Define formatting actions
  const formattingActions: FormattingAction[] = [
    {
      icon: <Bold size={16} />,
      label: 'Bold',
      shortcut: 'Ctrl+B',
      action: (view) => wrapText(view, '**'),
      type: 'wrap'
    },
    {
      icon: <Italic size={16} />,
      label: 'Italic', 
      shortcut: 'Ctrl+I',
      action: (view) => wrapText(view, '*'),
      type: 'wrap'
    },
    {
      icon: <Code size={16} />,
      label: 'Code',
      shortcut: 'Ctrl+`',
      action: (view) => wrapText(view, '`'),
      type: 'wrap'
    },
    {
      icon: <Strikethrough size={16} />,
      label: 'Strikethrough',
      shortcut: '',
      action: (view) => wrapText(view, '~~'),
      type: 'wrap'
    },
    {
      icon: <Heading1 size={16} />,
      label: 'Heading 1',
      shortcut: 'Ctrl+1',
      action: (view) => formatLine(view, '# ', 'Heading 1'),
      type: 'line'
    },
    {
      icon: <Heading2 size={16} />,
      label: 'Heading 2',
      shortcut: 'Ctrl+2',
      action: (view) => formatLine(view, '## ', 'Heading 2'),
      type: 'line'
    },
    {
      icon: <Heading3 size={16} />,
      label: 'Heading 3',
      shortcut: 'Ctrl+3',
      action: (view) => formatLine(view, '### ', 'Heading 3'),
      type: 'line'
    },
    {
      icon: <List size={16} />,
      label: 'Bullet List',
      shortcut: 'Ctrl+Shift+8',
      action: (view) => formatLine(view, '- ', 'List item'),
      type: 'line'
    },
    {
      icon: <ListOrdered size={16} />,
      label: 'Numbered List',
      shortcut: 'Ctrl+Shift+7',
      action: (view) => formatLine(view, '1. ', 'List item'),
      type: 'line'
    },
    {
      icon: <Quote size={16} />,
      label: 'Blockquote',
      shortcut: '',
      action: (view) => formatLine(view, '> ', 'Blockquote'),
      type: 'line'
    },
    {
      icon: <Minus size={16} />,
      label: 'Horizontal Rule',
      shortcut: '',
      action: (view) => insertText(view, '---'),
      type: 'insert'
    }
  ];

  const handleActionClick = useCallback((action: FormattingAction) => {
    const editorView = editorRef.current?.getEditorView();
    if (editorView) {
      action.action(editorView);
      // Update active states after action
      setTimeout(() => {
        if (editorView) {
          try {
            const newActiveStates = {
              bold: isWrapActive(editorView, '**'),
              italic: isWrapActive(editorView, '*'),
              code: isWrapActive(editorView, '`'),
              strikethrough: isWrapActive(editorView, '~~'),
              h1: isLineActive(editorView, '# '),
              h2: isLineActive(editorView, '## '),
              h3: isLineActive(editorView, '### '),
              bulletList: isLineActive(editorView, '- '),
              numberedList: isLineActive(editorView, '1. ') || /^\d+\.\s/.test(editorView.state.doc.lineAt(editorView.state.selection.main.from).text),
              blockquote: isLineActive(editorView, '> ')
            };
            setActiveStates(newActiveStates);
          } catch (error) {
            console.debug('Button click active state update error:', error);
          }
        }
      }, 10);
    }
  }, [editorRef, isWrapActive, isLineActive]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const editorView = editorRef.current?.getEditorView();
      if (!editorView) return;

      // Check if the editor is focused
      if (!editorView.hasFocus) return;

      let actionTaken = false;

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'b':
            event.preventDefault();
            wrapText(editorView, '**');
            actionTaken = true;
            break;
          case 'i':
            event.preventDefault();
            wrapText(editorView, '*');
            actionTaken = true;
            break;
          case '`':
            event.preventDefault();
            wrapText(editorView, '`');
            actionTaken = true;
            break;
          case '1':
            event.preventDefault();
            formatLine(editorView, '# ', 'Heading 1');
            actionTaken = true;
            break;
          case '2':
            event.preventDefault();
            formatLine(editorView, '## ', 'Heading 2');
            actionTaken = true;
            break;
          case '3':
            event.preventDefault();
            formatLine(editorView, '### ', 'Heading 3');
            actionTaken = true;
            break;
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
        switch (event.key) {
          case '*':
          case '8':
            event.preventDefault();
            formatLine(editorView, '- ', 'List item');
            actionTaken = true;
            break;
          case '&':
          case '7':
            event.preventDefault();
            formatLine(editorView, '1. ', 'List item');
            actionTaken = true;
            break;
        }
      }

      // Update active states after keyboard action
      if (actionTaken) {
        setTimeout(() => {
          const editorView = editorRef.current?.getEditorView();
          if (editorView) {
            try {
              const newActiveStates = {
                bold: isWrapActive(editorView, '**'),
                italic: isWrapActive(editorView, '*'),
                code: isWrapActive(editorView, '`'),
                strikethrough: isWrapActive(editorView, '~~'),
                h1: isLineActive(editorView, '# '),
                h2: isLineActive(editorView, '## '),
                h3: isLineActive(editorView, '### '),
                bulletList: isLineActive(editorView, '- '),
                numberedList: isLineActive(editorView, '1. ') || /^\d+\.\s/.test(editorView.state.doc.lineAt(editorView.state.selection.main.from).text),
                blockquote: isLineActive(editorView, '> ')
              };
              setActiveStates(newActiveStates);
            } catch (error) {
              console.debug('Keyboard shortcut active state update error:', error);
            }
          }
        }, 10);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editorRef, wrapText, formatLine, isWrapActive, isLineActive]);

  // Update active states when cursor moves or content changes
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const updateStates = () => {
      const editorView = editorRef.current?.getEditorView();
      if (!editorView) return;

      try {
        const newActiveStates = {
          bold: isWrapActive(editorView, '**'),
          italic: isWrapActive(editorView, '*'),
          code: isWrapActive(editorView, '`'),
          strikethrough: isWrapActive(editorView, '~~'),
          h1: isLineActive(editorView, '# '),
          h2: isLineActive(editorView, '## '),
          h3: isLineActive(editorView, '### '),
          bulletList: isLineActive(editorView, '- '),
          numberedList: isLineActive(editorView, '1. ') || /^\d+\.\s/.test(editorView.state.doc.lineAt(editorView.state.selection.main.from).text),
          blockquote: isLineActive(editorView, '> ')
        };

        setActiveStates(newActiveStates);
      } catch (error) {
        // Silently handle errors when editor is being destroyed/recreated
        console.debug('Active state update error:', error);
      }
    };

    // Handle focus events to ensure states update when editor regains focus
    const handleFocus = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateStates, 10);
    };

    // Handle click events for immediate updates
    const handleClick = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateStates, 10);
    };

    // Handle key events for cursor movement
    const handleKeyUp = (event: KeyboardEvent) => {
      // Only update for navigation keys and modifier keys
      if (event.key.startsWith('Arrow') || event.key === 'Home' || event.key === 'End' || 
          event.key === 'PageUp' || event.key === 'PageDown' || event.ctrlKey || event.metaKey) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateStates, 10);
      }
    };

    // Set up event listeners
    const addEventListeners = () => {
      const editorView = editorRef.current?.getEditorView();
      if (editorView && editorView.dom) {
        editorView.dom.addEventListener('focus', handleFocus);
        editorView.dom.addEventListener('click', handleClick);
        editorView.dom.addEventListener('keyup', handleKeyUp);
        
        // Also listen on document for global key events when editor is focused
        document.addEventListener('keyup', handleKeyUp);
        
        // Initial update
        updateStates();
      }
    };

    // Remove event listeners
    const removeEventListeners = () => {
      const editorView = editorRef.current?.getEditorView();
      if (editorView && editorView.dom) {
        editorView.dom.removeEventListener('focus', handleFocus);
        editorView.dom.removeEventListener('click', handleClick);
        editorView.dom.removeEventListener('keyup', handleKeyUp);
      }
      document.removeEventListener('keyup', handleKeyUp);
    };

    // Try to add listeners immediately
    addEventListeners();

    // Also try again after a short delay to handle editor remounting
    timeoutId = setTimeout(() => {
      addEventListeners();
    }, 100);

    // Set up a polling interval as a fallback for when events don't fire
    const intervalId = setInterval(() => {
      const editorView = editorRef.current?.getEditorView();
      if (editorView && editorView.hasFocus) {
        updateStates();
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      removeEventListeners();
    };
  }, [editorRef, isWrapActive, isLineActive]);

  // Get active state for a button by index
  const getActiveState = (index: number): boolean => {
    const actionKeys = ['bold', 'italic', 'code', 'strikethrough', 'h1', 'h2', 'h3', 'bulletList', 'numberedList', 'blockquote'];
    return activeStates[actionKeys[index]] || false;
  };

  return (
    <div className="border-b border-gray-100 bg-white px-4 py-2">
      <div className="flex items-center gap-1">
        {/* Text Formatting Group */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-100">
          {formattingActions.slice(0, 4).map((action, index) => {
            const isActive = getActiveState(index);
            return (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ''}`}
                disabled={false}
              >
                {action.icon}
              </button>
            );
          })}
        </div>

        {/* Headings Group */}
        <div className="flex items-center gap-1 px-3 border-r border-gray-100">
          {formattingActions.slice(4, 7).map((action, index) => {
            const isActive = getActiveState(index + 4);
            return (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ''}`}
                disabled={false}
              >
                {action.icon}
              </button>
            );
          })}
        </div>

        {/* Lists and Structure Group */}
        <div className="flex items-center gap-1 px-3">
          {formattingActions.slice(7).map((action, index) => {
            const isActive = getActiveState(index + 7);
            return (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                title={`${action.label}${action.shortcut ? ` (${action.shortcut})` : ''}`}
                disabled={false}
              >
                {action.icon}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
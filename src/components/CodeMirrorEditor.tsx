import { forwardRef, useImperativeHandle } from 'react';
import { useCodeMirror } from '../hooks/useCodeMirror';

interface CodeMirrorEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string | undefined;
  readOnly?: boolean;
  className?: string;
  showLineNumbers?: boolean;
  enableFolding?: boolean;
}

export interface CodeMirrorEditorRef {
  focus: () => void;
  getCharacterCount: () => number;
  getEditorView: () => import('@codemirror/view').EditorView | null;
}

export const CodeMirrorEditor = forwardRef<CodeMirrorEditorRef, CodeMirrorEditorProps>(
  ({ 
    value, 
    onChange, 
    placeholder, 
    readOnly = false, 
    className = '', 
    showLineNumbers = false,
    enableFolding = true
  }, ref) => {
    const { editorRef, focus, getCharacterCount, getEditorView } = useCodeMirror({
      value,
      onChange,
      placeholder,
      readOnly,
      showLineNumbers,
      enableFolding
    });

    useImperativeHandle(ref, () => ({
      focus,
      getCharacterCount,
      getEditorView
    }), [focus, getCharacterCount, getEditorView]);

    return (
      <div 
        ref={editorRef} 
        className={`codemirror-wrapper ${className}`}
        style={{
          // Ensure the editor takes full width and maintains consistent styling
          width: '100%'
        }}
      />
    );
  }
);

CodeMirrorEditor.displayName = 'CodeMirrorEditor';
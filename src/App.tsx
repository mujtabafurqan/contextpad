import { useEditorStore } from './stores/editorStore';
import { Edit3, Eye } from 'lucide-react';
import { useRef, useCallback, useMemo } from 'react';
import { CharacterCounter } from './components/CharacterCounter';
import { ClearButton } from './components/ClearButton';
import { useAutoResize } from './hooks/useAutoResize';
import { CodeMirrorEditor } from './components/CodeMirrorEditor';
import type { CodeMirrorEditorRef } from './components/CodeMirrorEditor';
import { FormattingToolbar } from './components/FormattingToolbar';
import { marked } from 'marked';

function App() {
  const { 
    mode, 
    toggleMode, 
    contextPanelWidth, 
    editorPanelWidth, 
    setContextPanelWidth, 
    isResizing, 
    setIsResizing,
    projectContext,
    temporaryNotes,
    editorContent,
    setProjectContext,
    setTemporaryNotes,
    setEditorContent,
    clearProjectContext,
    clearTemporaryNotes,
    clearEditorContent,
    showLineNumbers,
    enableFolding,
    setShowLineNumbers,
    setEnableFolding
  } = useEditorStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const codeMirrorRef = useRef<CodeMirrorEditorRef>(null);

  // Auto-resize hooks for textareas (context panels only)
  const projectContextResize = useAutoResize({ minHeight: 120, maxHeight: 400 });
  const temporaryNotesResize = useAutoResize({ minHeight: 80, maxHeight: 300 });

  // Configure marked for safe HTML rendering with enhanced code support
  const configureMarked = useCallback(() => {
    const renderer = new marked.Renderer();
    
    // Custom renderer for code blocks to ensure proper styling
    renderer.code = function({ text, lang }: { text: string; lang?: string }) {
      const language = lang || '';
      return `<pre class="bg-gray-100 border border-gray-200 rounded-lg p-4 overflow-x-auto"><code class="${language ? `language-${language}` : ''}">${text}</code></pre>`;
    };
    
    // Custom renderer for inline code to ensure proper styling
    renderer.codespan = function({ text }: { text: string }) {
      return `<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">${text}</code>`;
    };

    marked.setOptions({
      breaks: true,
      gfm: true,
      renderer: renderer,
    });
  }, []);

  // Render markdown to HTML
  const renderedMarkdown = useMemo(() => {
    configureMarked();
    try {
      return marked.parse(editorContent || '# Welcome to ContextPad\n\nStart writing markdown content in the editor to see it rendered here!');
    } catch {
      return '<p>Error rendering markdown</p>';
    }
  }, [editorContent, configureMarked]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setContextPanelWidth(newWidth);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [setContextPanelWidth, setIsResizing]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header - minimal, clean */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-2xl font-medium text-gray-900">ContextPad</h1>
      </header>
      
      {/* Main Content */}
      <div 
        ref={containerRef}
        className="flex-1 flex flex-col md:flex-row overflow-hidden"
      >
        {/* Context Panel */}
        <div 
          className="bg-white flex flex-col"
          style={{ width: `${contextPanelWidth}%` }}
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-800">Context</h2>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {/* Project Context Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-medium text-gray-800">Project Context</h3>
                </div>
                <ClearButton 
                  onClear={clearProjectContext}
                  disabled={!projectContext}
                />
              </div>
              <div className="space-y-4">
                <textarea 
                  ref={projectContextResize.textareaRef}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none transition-all duration-200 text-base"
                  placeholder="Add relevant background information, templates, or reference materials that will help guide your AI-assisted writing..."
                  value={projectContext}
                  onChange={(e) => {
                    setProjectContext(e.target.value);
                    projectContextResize.handleChange(e);
                  }}
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Context content will be stored and persist across sessions.
                  </div>
                  <CharacterCounter count={projectContext.length} />
                </div>
              </div>
            </div>
            
            {/* Temporary Notes Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-medium text-gray-800">Temporary Notes</h3>
                </div>
                <ClearButton 
                  onClear={clearTemporaryNotes}
                  disabled={!temporaryNotes}
                />
              </div>
              <div className="space-y-4">
                <textarea 
                  ref={temporaryNotesResize.textareaRef}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none transition-all duration-200 text-base"
                  placeholder="Add temporary context for this session..."
                  value={temporaryNotes}
                  onChange={(e) => {
                    setTemporaryNotes(e.target.value);
                    temporaryNotesResize.handleChange(e);
                  }}
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Temporary notes for this editing session.
                  </div>
                  <CharacterCounter count={temporaryNotes.length} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle divider */}
        <div 
          className={`w-px bg-gray-200 hover:bg-blue-200 cursor-col-resize transition-colors duration-200 ${
            isResizing ? 'bg-blue-300' : ''
          }`}
          onMouseDown={handleMouseDown}
          style={{ userSelect: 'none' }}
        />
        
        {/* Editor Panel */}
        <div 
          className="bg-white flex flex-col"
          style={{ width: `${editorPanelWidth}%` }}
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-800">Editor</h2>
            <div className="flex items-center gap-2">
              <ClearButton 
                onClear={clearEditorContent}
                disabled={!editorContent}
              />
              <button
                onClick={() => mode !== 'edit' && toggleMode()}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  mode === 'edit'
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                <Edit3 size={16} />
                Edit
              </button>
              <button
                onClick={() => mode !== 'preview' && toggleMode()}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  mode === 'preview'
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                <Eye size={16} />
                Preview
              </button>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {mode === 'edit' ? (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Markdown Content
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showLineNumbers}
                        onChange={(e) => setShowLineNumbers(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Show line numbers</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableFolding}
                        onChange={(e) => setEnableFolding(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Enable code folding</span>
                    </label>
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <FormattingToolbar editorRef={codeMirrorRef} />
                    <CodeMirrorEditor
                      ref={codeMirrorRef}
                      value={editorContent}
                      onChange={setEditorContent}
                      placeholder="# Start writing your markdown here...

## This is a heading

Write your content with **bold text**, *italic text*, and [links](https://example.com).

- Bullet points
- Are supported
- Along with other markdown features"
                      className="transition-all duration-200"
                      showLineNumbers={showLineNumbers}
                      enableFolding={enableFolding}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-gray-500">
                    Use markdown syntax for formatting. Switch to Preview to see the rendered output.
                  </div>
                  <CharacterCounter count={editorContent.length} />
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="bg-white border border-gray-200 rounded-xl p-6 overflow-auto">
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
                  />
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  This preview shows how your markdown will be rendered.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

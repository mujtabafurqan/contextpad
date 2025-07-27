import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// Enhanced light theme matching ContextPad design system
const contextPadLightTheme = EditorView.theme({
  '&': {
    fontSize: '16px',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
  '.cm-content': {
    padding: '16px',
    minHeight: '400px',
    lineHeight: '1.6',
    color: 'rgb(17, 24, 39)', // gray-900
  },
  '.cm-focused': {
    outline: 'none',
  },
  '.cm-editor': {
    border: 'none',
    backgroundColor: 'white',
  },
  '.cm-editor.cm-focused': {
    outline: 'none',
  },
  '.cm-scroller': {
    scrollBehavior: 'smooth',
  },
  '.cm-placeholder': {
    color: 'rgb(156, 163, 175)', // gray-400
  },
  '.cm-gutters': {
    backgroundColor: 'rgb(249, 250, 251)', // gray-50
    color: 'rgb(107, 114, 128)', // gray-500
    border: 'none',
    borderTopLeftRadius: '12px',
    borderBottomLeftRadius: '12px',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgb(243, 244, 246)', // gray-100
  },
  '.cm-activeLine': {
    backgroundColor: 'rgb(249, 250, 251)', // gray-50
  },
  '.cm-selectionBackground, ::selection': {
    backgroundColor: 'rgb(219, 234, 254)', // blue-100
  },
  '.cm-searchMatch': {
    backgroundColor: 'rgb(254, 249, 195)', // yellow-100
    outline: '1px solid rgb(251, 191, 36)', // yellow-400
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: 'rgb(254, 240, 138)', // yellow-200
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'rgb(243, 244, 246)', // gray-100
    border: '1px solid rgb(209, 213, 219)', // gray-300
    color: 'rgb(75, 85, 99)', // gray-600
    borderRadius: '4px',
    padding: '2px 6px',
  }
}, { dark: false });

// Light syntax highlighting matching ContextPad style - consistent text colors
const contextPadLightHighlight = HighlightStyle.define([
  { tag: t.heading, color: 'rgb(17, 24, 39)', fontWeight: '600' }, // gray-900, font-semibold
  { tag: t.heading1, color: 'rgb(17, 24, 39)', fontWeight: '600', fontSize: '1.875rem' }, // text-3xl
  { tag: t.heading2, color: 'rgb(17, 24, 39)', fontWeight: '500', fontSize: '1.5rem' }, // same color, different weight
  { tag: t.heading3, color: 'rgb(17, 24, 39)', fontWeight: '500', fontSize: '1.25rem' }, // same color, different weight
  { tag: t.strong, color: 'rgb(17, 24, 39)', fontWeight: '600' }, // gray-900, font-semibold
  { tag: t.emphasis, color: 'rgb(17, 24, 39)', fontStyle: 'italic' }, // same color as text
  { tag: t.link, color: 'rgb(17, 24, 39)', textDecoration: 'underline' }, // same color, just underlined
  { tag: t.url, color: 'rgb(17, 24, 39)', textDecoration: 'underline' }, // same color, just underlined
  { tag: t.monospace, color: 'rgb(17, 24, 39)', backgroundColor: 'rgb(249, 250, 251)', padding: '2px 4px', borderRadius: '4px' }, // same color, subtle gray background
  { tag: t.quote, color: 'rgb(17, 24, 39)', fontStyle: 'italic', borderLeft: '4px solid rgb(209, 213, 219)', paddingLeft: '12px', marginLeft: '4px' }, // same color, gray border
  { tag: t.list, color: 'rgb(17, 24, 39)', fontWeight: '400' }, // same color as regular text
  { tag: t.meta, color: 'rgb(17, 24, 39)' }, // same color as regular text
  { tag: t.comment, color: 'rgb(17, 24, 39)', fontStyle: 'italic' }, // same color, just italic
]);

export interface EditorTheme {
  name: string;
  extensions: Extension[];
}

export const contextPadTheme: EditorTheme = {
  name: 'ContextPad Light',
  extensions: [
    contextPadLightTheme,
    syntaxHighlighting(contextPadLightHighlight)
  ]
};
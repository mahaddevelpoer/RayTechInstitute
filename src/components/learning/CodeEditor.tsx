'use client';
import { useMemo } from 'react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { php } from '@codemirror/lang-php';
import { useTheme } from '@/hooks/useTheme';
import type { BrowserRuntime } from '@/types/learning';

export function CodeEditor({ language, code, onChange, onExplainLine, onActiveLine }: { language: BrowserRuntime; code: string; onChange: (code: string) => void; onExplainLine?: (line: string, number: number) => void; onActiveLine?: (line: string, number: number) => void }) {
  const { theme } = useTheme();
  const extensions = useMemo(() => [({ html, css, javascript, python, php })[language](),EditorView.domEventHandlers({dblclick(event,view){const pos=view.posAtCoords({x:event.clientX,y:event.clientY});if(pos!==null){const line=view.state.doc.lineAt(pos);onExplainLine?.(line.text,line.number);}return false;},keydown(event,view){if(event.altKey&&event.key==='Enter'){event.preventDefault();const line=view.state.doc.lineAt(view.state.selection.main.head);onExplainLine?.(line.text,line.number);return true;}return false;}})], [language,onExplainLine]);
  return <CodeMirror value={code} height="100%" className="learning-code-editor" theme={theme} extensions={extensions} onChange={onChange} onUpdate={update=>{if(update.docChanged||update.selectionSet){const line=update.state.doc.lineAt(update.state.selection.main.head);onActiveLine?.(line.text,line.number);}}} aria-label={`${language} code editor`} basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: true }} />;
}

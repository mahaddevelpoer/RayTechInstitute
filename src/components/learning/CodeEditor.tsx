'use client';
import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { php } from '@codemirror/lang-php';
import { useTheme } from '@/hooks/useTheme';
import type { BrowserRuntime } from '@/types/learning';

export function CodeEditor({ language, code, onChange }: { language: BrowserRuntime; code: string; onChange: (code: string) => void }) {
  const { theme } = useTheme();
  const extensions = useMemo(() => [({ html, css, javascript, python, php })[language]()], [language]);
  return <CodeMirror value={code} height="100%" className="learning-code-editor" theme={theme} extensions={extensions} onChange={onChange} aria-label={`${language} code editor`} basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: true }} />;
}

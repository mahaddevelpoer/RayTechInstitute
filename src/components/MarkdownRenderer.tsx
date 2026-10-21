"use client";

import React from "react";
import { articleSections } from "@/utils/editorial";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sanitizeUrl } from "@/utils/security";
import { codiSentencePlugin } from '@/lib/learning/codi-sentences';

interface MarkdownRendererProps {
  content: string;
  practiceLanguage?: string;
  onTryCode?: (code: string) => void;
  narration?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  practiceLanguage,
  onTryCode,
  narration = false,
}) => {
  const sections = articleSections(content);
  const headingId = (line?: number) =>
    sections.find((s) => s.line === line)?.id;
  return (
    <div className="markdown-article text-slate-800 leading-relaxed space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={narration ? [codiSentencePlugin] : []}
        components={{
          h1: ({ children, node }) => (
            <h2
              id={headingId(node?.position?.start.line)}
              className="text-2xl sm:text-3xl font-bold text-navy-900 mt-6 mb-3 border-b border-slate-200 pb-2"
            >
              {children}
            </h2>
          ),
          h2: ({ children, node }) => (
            <h2
              id={headingId(node?.position?.start.line)}
              className="text-xl sm:text-2xl font-bold text-navy-900 mt-6 mb-3 border-b border-slate-200 pb-2"
            >
              {children}
            </h2>
          ),
          h3: ({ children, node }) => (
            <h3
              id={headingId(node?.position?.start.line)}
              className="text-lg font-bold text-navy-800 mt-5 mb-2"
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 space-y-1.5 text-sm text-slate-700 mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 space-y-1.5 text-sm text-slate-700 mb-4">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="p-4 bg-navy-50 border-l-4 border-navy-600 rounded-r text-sm text-slate-700 italic my-4">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-200 bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold text-slate-800 border-b border-slate-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-slate-700 border-b border-slate-100">
              {children}
            </td>
          ),
          a: ({ href, children }) => {
            const safeHref = sanitizeUrl(href);
            const isExternal = /^https?:\/\//i.test(safeHref);
            return (
              <a
                href={safeHref || undefined}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-navy-600 hover:text-navy-800 font-semibold underline underline-offset-2 transition-colors"
              >
                {children}
              </a>
            );
          },
          code: ({ children, className }) => (
            <code className={`${className || ''} px-1.5 py-0.5 rounded bg-slate-100 text-navy-800 font-mono text-xs border border-slate-200`}>
              {children}
            </code>
          ),
          pre: ({ children }) => {
            const child = React.Children.toArray(children).find(React.isValidElement) as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined;
            const tag = child?.props.className?.match(/language-([a-z0-9-]+)/i)?.[1]?.toLowerCase();
            const text = typeof child?.props.children === 'string' ? child.props.children.replace(/\n$/, '') : '';
            if (tag === 'hint' || tag === 'solution') return <details className="my-4 rounded-md border border-slate-300 bg-slate-50 p-4"><summary className="min-h-12 cursor-pointer font-semibold">{tag === 'hint' ? 'Show hint' : 'Show solution'}</summary><div className="whitespace-pre-wrap break-words pt-3 text-sm">{text}</div></details>;
            const language = ({ py: 'python', python: 'python', js: 'javascript', javascript: 'javascript', html: 'html', css: 'css', php: 'php' } as Record<string, string>)[tag || ''];
            return <div className="my-4 min-w-0 rounded-lg border border-slate-800 bg-slate-900 text-slate-100">
              {onTryCode && language && language === practiceLanguage && text.trim() && text.length <= 20000 && <div className="flex justify-end border-b border-slate-700 px-3 py-2"><button type="button" className="min-h-12 rounded-md border border-slate-500 px-3 text-sm font-semibold text-white hover:bg-slate-700" onClick={() => onTryCode(text)}>Try this example</button></div>}
              <pre className="m-0 overflow-x-auto p-4 text-xs font-mono"><code className="block whitespace-pre font-mono text-inherit">{narration && text ? text.split('\n').map((line,index)=><React.Fragment key={index}>{index>0?'\n':''}{line.trim()?<button type="button" className="codi-sentence codi-code-sentence" data-codi-text={line.trim()} title="Read this code line with Codi">{line}</button>:line}</React.Fragment>) : text || children}</code></pre>
            </div>;
          },
          hr: () => <hr className="my-6 border-slate-200" />,
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

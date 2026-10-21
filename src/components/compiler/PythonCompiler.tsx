"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Terminal,
  Play,
  RotateCcw,
  Minus,
  X,
  Move,
  Loader2,
  Maximize2,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { loadRuntimeAssets } from "@/lib/learning/runtime-assets";

interface PythonCompilerProps {
  initialCode?: string;
  autoOpen?: boolean;
}

export const PythonCompiler: React.FC<PythonCompilerProps> = ({
  initialCode = '# Write or paste Python code here\nprint("Welcome to RayTech Python Compiler!")\n\nfor i in range(1, 6):\n    print(f"Step {i}: Square is {i**2}")\n',
  autoOpen = false,
}) => {
  const { theme } = useTheme();
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const activeRun = useRef("");
  const outputText = useRef("");
  const runTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [stdin, setStdin] = useState("");
  const [isMinimized, setIsMinimized] = useState(true);
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>(
    'Console idle. Click "Run Code" to compile.',
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [engineStatus, setEngineStatus] = useState<string>(
    "Preparing isolated Python sandbox",
  );

  // Dragging state: top/left coordinates keep the panel inside the viewport.
  const [position, setPosition] = useState({ x: 80, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({ width: 560, height: 560 });
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    width: 560,
    height: 560,
  });

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      if (autoOpen) {
        setIsMinimized(false);
      }
    }
  }, [initialCode, autoOpen]);

  const stopCode = useCallback((message = "Execution stopped. Your code is preserved.") => {
    activeRun.current = "";
    frameRef.current?.contentWindow?.postMessage({ type: "stop" }, "*");
    if (runTimer.current) clearTimeout(runTimer.current);
    setIsRunning(false);
    setEngineStatus("Python sandbox ready");
    setOutput(message);
  }, []);

  useEffect(() => {
    const target = frameRef.current?.contentWindow;
    const receive = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow || !activeRun.current || event.data?.runId !== activeRun.current) return;
      if (event.data.type === "executing") {
        if (runTimer.current) clearTimeout(runTimer.current);
        setEngineStatus("Running Python");
        runTimer.current = setTimeout(() => stopCode("Stopped after the 10-second execution limit. Check for an infinite loop."), 10000);
      } else if (event.data.type === "output") {
        outputText.current = (outputText.current + String(event.data.text).slice(0, 20000)).slice(0, 20000);
        setOutput(outputText.current);
      } else if (event.data.type === "done") {
        if (runTimer.current) clearTimeout(runTimer.current);
        activeRun.current = "";
        setIsRunning(false);
        setEngineStatus("Python sandbox ready");
        const detail = typeof event.data.text === "string" ? event.data.text.slice(0, 4000) : "";
        setOutput(outputText.current + (detail ? `${outputText.current ? "\n" : ""}${detail}` : outputText.current ? "" : "Finished with no printed output."));
      }
    };
    window.addEventListener("message", receive);
    return () => {
      window.removeEventListener("message", receive);
      activeRun.current = "";
      target?.postMessage({ type: "stop" }, "*");
      if (runTimer.current) clearTimeout(runTimer.current);
    };
  }, [stopCode]);
  useEffect(() => {
    if (isMinimized && activeRun.current) stopCode();
  }, [isMinimized, stopCode]);

  // Pointer input supports mouse, touch and pen. Header controls are excluded
  // so clicking Minimize/Close never moves the panel.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      const maxX = Math.max(
        8,
        window.innerWidth - Math.min(size.width, window.innerWidth - 16) - 8,
      );
      const maxY = Math.max(
        8,
        window.innerHeight - Math.min(size.height, window.innerHeight - 16) - 8,
      );

      // Natural direction: cursor right -> window moves right, cursor down -> window moves down
      const newX = Math.min(
        Math.max(10, dragStartRef.current.posX + deltaX),
        maxX,
      );
      const newY = Math.min(
        Math.max(10, dragStartRef.current.posY + deltaY),
        maxY,
      );

      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, size.width, size.height]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isResizing) return;
      const minWidth = Math.min(320, Math.max(240, window.innerWidth - 16));
      const minHeight = Math.min(360, Math.max(240, window.innerHeight - 16));
      const maxWidth = Math.max(minWidth, window.innerWidth - 16);
      const maxHeight = Math.max(minHeight, window.innerHeight - 16);
      setSize({
        width: Math.min(
          maxWidth,
          Math.max(
            minWidth,
            resizeStartRef.current.width +
              event.clientX -
              resizeStartRef.current.mouseX,
          ),
        ),
        height: Math.min(
          maxHeight,
          Math.max(
            minHeight,
            resizeStartRef.current.height +
              event.clientY -
              resizeStartRef.current.mouseY,
          ),
        ),
      });
    };

    const handlePointerUp = () => setIsResizing(false);
    if (isResizing) {
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isResizing]);

  useEffect(() => {
    const keepInViewport = () => {
      const maxX = Math.max(
        8,
        window.innerWidth - Math.min(size.width, window.innerWidth - 16) - 8,
      );
      const maxY = Math.max(
        8,
        window.innerHeight - Math.min(size.height, window.innerHeight - 16) - 8,
      );
      setPosition((current) => ({
        x: Math.min(Math.max(8, current.x), maxX),
        y: Math.min(Math.max(8, current.y), maxY),
      }));
    };
    keepInViewport();
    window.addEventListener("resize", keepInViewport);
    return () => window.removeEventListener("resize", keepInViewport);
  }, [size.width, size.height]);

  useEffect(() => {
    if (isMinimized) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMinimized(true);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMinimized]);

  const handleResizeStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    resizeStartRef.current = {
      mouseX: event.clientX,
      mouseY: event.clientY,
      width: size.width,
      height: size.height,
    };
    setIsResizing(true);
  };

  const handleResizeKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    const directions: Record<string, { width: number; height: number }> = {
      ArrowRight: { width: 1, height: 0 },
      ArrowLeft: { width: -1, height: 0 },
      ArrowDown: { width: 0, height: 1 },
      ArrowUp: { width: 0, height: -1 },
    };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const step = event.shiftKey ? 50 : 10;
    const minWidth = Math.min(320, Math.max(240, window.innerWidth - 16));
    const minHeight = Math.min(360, Math.max(240, window.innerHeight - 16));
    const maxWidth = Math.max(minWidth, window.innerWidth - 16);
    const maxHeight = Math.max(minHeight, window.innerHeight - 16);
    setSize((current) => ({
      width: Math.min(
        maxWidth,
        Math.max(minWidth, current.width + direction.width * step),
      ),
      height: Math.min(
        maxHeight,
        Math.max(minHeight, current.height + direction.height * step),
      ),
    }));
  };

  const handleRunCode = async () => {
    if (activeRun.current || !isEngineReady || !frameRef.current?.contentWindow) return;
    if (code.length > 20000 || stdin.length > 10000) {
      setOutput("Use at most 20,000 code characters and 10,000 input characters per run.");
      return;
    }
    const id = crypto.randomUUID();
    activeRun.current = id;
    outputText.current = "";
    setIsRunning(true);
    setEngineStatus("Preparing Python. First run downloads the interpreter.");
    setOutput("Preparing Python...");
    runTimer.current = setTimeout(() => stopCode("Runtime loading timed out. Check your connection and try again."), 90000);
    try {
      const runtime = await loadRuntimeAssets("python");
      if (activeRun.current !== id) return;
      frameRef.current?.contentWindow?.postMessage({ type: "run", language: "python", code, stdin, runId: id, ...runtime }, "*");
    } catch {
      if (activeRun.current === id) stopCode("Python could not download. Check your connection and select Run Code to retry.");
    }
  };

  const handleReset = () => {
    if (activeRun.current) stopCode();
    setCode(initialCode);
    setStdin("");
    setOutput("Code reset to default.");
  };

  // Keep the opaque sandbox mounted while minimizing so message identity remains stable.
  const sandbox = <iframe key="python-sandbox" ref={frameRef} title="Isolated Python execution sandbox" sandbox="allow-scripts" src="/learning-wasm-frame.html" className="hidden" onLoad={() => { if (activeRun.current) stopCode("Python sandbox reloaded. Select Run Code to try again."); setIsEngineReady(true); setEngineStatus("Python sandbox ready"); }} />;

  // Minimized Trigger Button
  if (isMinimized) {
    return (
      <>{sandbox}<div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setIsMinimized(false);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-navy-600 hover:bg-navy-700 text-white font-bold text-xs rounded-lg shadow-lg border-2 border-white transition-all transform hover:scale-105"
          title="Open Python Compiler"
          aria-label="Open Python Compiler"
        >
          <Terminal className="w-4 h-4" />
          <span>Python Compiler</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div></>
    );
  }

  // Expanded Window - Dynamic Theme Responsive
  const isDark = theme === "dark";

  return (
    <>{sandbox}<div
      role="dialog"
      aria-label="RayTech Python compiler"
      style={{
        position: "fixed",
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: "min(320px, calc(100vw - 1rem))",
        minHeight: "min(360px, calc(100dvh - 1rem))",
        maxWidth: "calc(100vw - 1rem)",
        maxHeight: "calc(100dvh - 1rem)",
        zIndex: 60,
      }}
      className={`relative rounded-xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
        isDark
          ? "bg-slate-900 border-slate-700 text-slate-100"
          : "bg-white border-slate-300 text-slate-800"
      }`}
    >
      {/* Draggable Header */}
      <div
        onPointerDown={handlePointerDown}
        className={`px-4 py-2.5 border-b flex items-center justify-between cursor-move select-none touch-none ${
          isDark
            ? "bg-slate-800 border-slate-700 text-white"
            : "bg-navy-700 border-navy-800 text-white"
        }`}
      >
        <div className="flex items-center gap-2">
          <Move className="w-3.5 h-3.5 opacity-70" />
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold tracking-wide">
            Python 3.11 Compiler
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-semibold">
            In-Browser Wasm
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMinimized(true)}
            className="min-h-12 min-w-12 p-2 hover:bg-white/20 rounded text-white transition-colors"
            title="Minimize"
            aria-label="Minimize Python compiler"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="min-h-12 min-w-12 p-2 hover:bg-red-500 rounded text-white transition-colors"
            title="Close"
            aria-label="Close Python compiler"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Sub-Bar */}
      <div
        className={`px-3 py-2 border-b flex items-center justify-between text-xs ${
          isDark
            ? "bg-slate-850 border-slate-800 text-slate-300"
            : "bg-slate-50 border-slate-200 text-slate-600"
        }`}
      >
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{engineStatus}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 border transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
                : "bg-white border-slate-300 hover:bg-slate-100 text-slate-700"
            }`}
            title="Reset code"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning || !isEngineReady}
            className="min-h-12 px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs flex items-center gap-1 shadow-sm transition-colors disabled:opacity-50"
            title="Run Code (Ctrl + Enter)"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Run Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isRunning && (
        <button
          type="button"
          onClick={() => stopCode()}
          className="min-h-12 text-sm font-bold text-red-700"
        >
          Stop execution
        </button>
      )}
      {/* Code Textarea */}
      <div className="min-h-0 flex-1 overflow-auto p-2.5">
        <label className="sr-only" htmlFor="python-code-input">
          Python Code Input
        </label>
        <textarea
          id="python-code-input"
          value={code}
          maxLength={20000}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              handleRunCode();
            }
          }}
          rows={7}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className={`w-full font-mono text-xs p-3 rounded border focus:outline-none focus:ring-2 focus:ring-navy-600 leading-relaxed resize-y ${
            isDark
              ? "bg-slate-950 text-emerald-300 border-slate-800"
              : "bg-slate-50 text-slate-900 border-slate-300"
          }`}
          placeholder="# Write Python code here and click Run..."
        />
      </div>

      <label className="px-3 pb-2 text-xs font-semibold">
        Input for input() (one value per line)
        <textarea
          aria-label="Python input lines"
          value={stdin}
          maxLength={10000}
          onChange={(e) => setStdin(e.target.value)}
          rows={2}
          className="study-input mt-1 font-mono"
        />
      </label>
      {/* Terminal Output */}
      <div
        className={`p-3 border-t flex flex-col gap-1 ${
          isDark
            ? "bg-slate-950 border-slate-800"
            : "bg-slate-100 border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <span>Terminal Output:</span>
          <span>Press Ctrl+Enter to Run</span>
        </div>
        <pre
          role="status"
          aria-live="polite"
          className={`w-full max-h-32 overflow-y-auto font-mono text-xs p-2.5 rounded border whitespace-pre-wrap select-text ${
            isDark
              ? "bg-black text-slate-200 border-slate-800"
              : "bg-white text-slate-900 border-slate-300"
          }`}
        >
          {output}
        </pre>
      </div>

      <p className="px-3 py-1 text-[11px]">Code stays in this tab. Reloading clears it. Each run uses a fresh sandbox with no network access.</p>

      <button
        type="button"
        onPointerDown={handleResizeStart}
        onKeyDown={handleResizeKeyDown}
        className="absolute bottom-0 right-0 z-10 flex h-12 w-12 cursor-se-resize items-end justify-end rounded-br-lg p-2 text-slate-400 hover:text-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-500"
        title="Resize compiler window"
        aria-label="Resize compiler window. Use arrow keys to resize, or hold Shift for larger steps."
      >
        <Maximize2 className="h-3.5 w-3.5 rotate-90" aria-hidden="true" />
      </button>
    </div></>
  );
};

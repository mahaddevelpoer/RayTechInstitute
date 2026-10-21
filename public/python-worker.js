/* Python runs off the UI thread so a student's infinite loop can be stopped. */
let enginePromise;
let busy = false;
async function engine() {
  if (!enginePromise)
    enginePromise = (async () => {
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js");
      return self.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
      });
    })().catch((error) => {
      enginePromise = undefined;
      throw error;
    });
  return enginePromise;
}
self.onmessage = async ({ data }) => {
  if (busy) return;
  busy = true;
  let globals;
  try {
    const py = await engine();
    if (data.type === "init") {
      self.postMessage({ type: "ready" });
      return;
    }
    if (data.type !== "run") return;
    let output = "";
    const append = (line) => {
      output = (output + line + "\n").slice(0, 20000);
    };
    const lines = String(data.stdin || "").split("\n");
    let lineIndex = 0;
    py.setStdin({
      stdin: () => (lineIndex < lines.length ? lines[lineIndex++] : undefined),
    });
    py.setStdout({ batched: append });
    py.setStderr({ batched: append });
    globals = py.toPy({ __name__: "__main__" });
    try {
      await py.runPythonAsync(String(data.code || ""), { globals });
      self.postMessage({
        type: "result",
        output: output.trim() || "Finished successfully (no printed output).",
      });
    } catch (error) {
      self.postMessage({
        type: "result",
        output: output + String(error.message || error),
      });
    }
  } catch (error) {
    self.postMessage({ type: "error", output: String(error.message || error) });
  } finally {
    globals?.destroy();
    busy = false;
  }
};

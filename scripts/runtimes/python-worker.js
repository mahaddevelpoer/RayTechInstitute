/* Boot a fresh interpreter from supplied, self-hosted bytes in an opaque worker.
 * Its frame CSP forbids all connections. No package download or network bridge.
 */
self.onmessage = async ({ data }) => {
  self.onmessage = null;
  let globals;
  const urls = [];
  const send = self.postMessage.bind(self);
  let size = 0;
  const output = text => {
    const value = String(text).slice(0, 20000 - size); size += value.length;
    if (value) send({ type: 'output', text: value });
    if (size >= 20000) throw new Error('Output limit reached.');
  };
  const objectUrl = source => { const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' })); urls.push(url); return url; };
  try {
    const files = data.assets;
    const origin = 'https://raytech-runtime.invalid/';
    // The loader requests only these in-memory files; never fall back to fetch.
    self.fetch = async input => {
      const name = String(input).replace(origin, '');
      const allowed = ['pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
      if (!allowed.includes(name) || !files[name]) throw new Error('Network access is disabled in practice code.');
      return new Response(files[name], { headers: { 'Content-Type': name.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream' } });
    };
    importScripts(objectUrl(files['pyodide.js']), objectUrl(files['pyodide.asm.js']));
    const py = await self.loadPyodide({ indexURL: origin, stdout: text => output(text + '\n'), stderr: text => output(text + '\n') });
    self.fetch = async () => { throw new Error('Network access is disabled in practice code.'); };
    const lines = data.stdin ? data.stdin.split('\n') : [];
    let index = 0;
    py.setStdin({ stdin: () => lines[index++] });
    const decoder = new TextDecoder();
    const write = bytes => { output(decoder.decode(bytes, { stream: true })); return bytes.length; };
    py.setStdout({ write }); py.setStderr({ write });
    globals = py.toPy({ __name__: '__main__' });
    send({ type: 'ready' });
    await py.runPythonAsync(data.code, { globals });
    output(decoder.decode());
    send({ type: 'done' });
  } catch (error) { send({ type: 'done', text: String(error?.message || error).slice(0, 4000) }); }
  finally { globals?.destroy(); for (const url of urls) URL.revokeObjectURL(url); }
};

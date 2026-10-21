import { PHP, loadPHPRuntime, setPhpIniEntries } from '@php-wasm/universal';
import * as loader from 'raytech:php-loader';

self.onmessage = async ({ data }) => {
  self.onmessage = null;
  const send = self.postMessage.bind(self);
  let size = 0;
  const output = text => {
    const value = String(text).slice(0, 20000 - size); size += value.length;
    if (value) send({ type: 'output', text: value });
    if (size >= 20000) throw new Error('Output limit reached.');
  };
  try {
    // A new in-memory filesystem and interpreter for every run, no server,
    // persistent mounts, extension downloads or network adapter.
    self.fetch = async () => { throw new Error('Network access is disabled in practice code.'); };
    const id = await loadPHPRuntime(loader, {
      wasmBinary: data.assets['php.wasm'],
      print: text => output(text + '\n'), printErr: text => output(text + '\n'),
    });
    const php = new PHP(id);
    await setPhpIniEntries(php, {
      memory_limit: '64M', max_execution_time: 10, display_errors: 1, html_errors: 0,
      allow_url_fopen: 0, allow_url_include: 0, 'opcache.enable': 0,
      disable_functions: 'exec,shell_exec,system,passthru,proc_open,popen,pcntl_exec,dl,post_message_to_js',
    });
    send({ type: 'ready' });
    const response = await php.runStream({ code: data.code, body: new TextEncoder().encode(data.stdin), method: 'POST' });
    async function consume(stream) {
      const reader = stream.getReader(); const decoder = new TextDecoder();
      try {
        while (true) { const { done, value } = await reader.read(); if (done) break; output(decoder.decode(value, { stream: true })); }
        output(decoder.decode());
      } finally { reader.releaseLock(); }
    }
    await Promise.all([consume(response.stdout), consume(response.stderr)]);
    const exitCode = await response.exitCode;
    send({ type: 'done', text: exitCode ? `PHP exited with code ${exitCode}.` : '' });
  } catch (error) { send({ type: 'done', text: String(error?.message || error).slice(0, 4000) }); }
};

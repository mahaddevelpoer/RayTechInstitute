Codi speech-worker corresponding source

Copyright 2026 RayTech Institute contributors.
The Codi speech-worker program is distributed under GPL-3.0-or-later.
It is provided WITHOUT ANY WARRANTY. See COPYING.txt for the full terms.
You may copy, modify and redistribute it under those terms.

This source package contains only Codi's separate speech-worker program and
its build files. It contains no backend, provider key, service-role credential,
account data, or unrelated website source.

Rebuild with Node.js 24:
1. Download codi-worker.mjs, codi-models.mjs, build.mjs, package.json and
   package-lock.json into the same folder.
2. Run npm ci, then npm run build.
3. Serve dist/worker.js as /codi/worker.js and dist/runtime/ as /codi/runtime/.
4. Supply the worker with {id, text, language}, where language is en or hi.
   It returns progress, audio (Float32 PCM at 24000 Hz), or a safe error.

Dependencies and their complete source/build directions:
- ephone 1.0.2: GPL-3.0-or-later, derived from eSpeak NG.
  The complete upstream source archive is supplied as ephone-source.tar.gz.
  Revision: 4f6d246c1d3acf67a4d814e20da02fa3967bc92d.
  Original: https://github.com/sjmik/ephone-js/tree/4f6d246c1d3acf67a4d814e20da02fa3967bc92d
  Its emscripten/build.sh and build-multiple.sh rebuild the language runtime.
- Transformers.js 4.3.1: Apache-2.0.
  Source: https://github.com/huggingface/transformers.js/tree/4.3.1
  Package includes src/ and is resolved by package-lock.json.
- ONNX Runtime Web 1.31.0-dev.20260914-8d85527a0: MIT.
  Source and build scripts: https://github.com/microsoft/onnxruntime/tree/8d85527a0
  The unchanged runtime package is resolved by package-lock.json.
- esbuild 0.28.2: MIT, build tool, not a website runtime dependency.
  Source: https://github.com/evanw/esbuild/tree/v0.28.2

The worker fetches separate Apache-2.0 model weights only after the user
enables reading and selects a line. Model revisions are fixed in
codi-models.mjs. Machine translation and synthesized speech can make mistakes.

These notices describe this separate worker. They do not publish private
backend files or relicense unrelated website components.

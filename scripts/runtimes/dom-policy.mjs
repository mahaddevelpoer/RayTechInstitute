const tags = new Set('div span p h1 h2 h3 h4 h5 h6 main section article aside header footer nav ul ol li dl dt dd pre code blockquote strong em b i u small br hr button input label textarea select option optgroup form fieldset legend output table thead tbody tfoot tr th td caption colgroup col a style details summary'.split(' '));
const attributes = new Set('id class title style name value placeholder disabled checked selected multiple readonly required min max step minlength maxlength rows cols colspan rowspan width height for role tabindex open'.split(' '));
const booleans = new Set(['checked', 'disabled', 'selected', 'multiple', 'readOnly', 'required', 'indeterminate', 'open']);

/** Rendering policy, not an execution sandbox. The opaque frame and CSP are mandatory. */
export function createDOMPolicy(limit = 2000) {
  let created = 0;
  const policy = {
    sanitize(node) { return ++created <= limit && tags.has(node.localName?.toLowerCase()) && (!node.namespaceURI || node.namespaceURI === 'http://www.w3.org/1999/xhtml'); },
    setAttribute(node, name, value) {
      name = name.toLowerCase();
      if (name === 'type' && value !== null && ['input', 'button'].includes(node.localName) && /^(text|number|checkbox|radio|range|search|email|button|submit|reset)$/.test(String(value))) { node.setAttribute(name, String(value)); return true; }
      if (!(attributes.has(name) || /^(data|aria)-[a-z0-9-]+$/.test(name)) || String(value ?? '').length > 20000) return false;
      if (value === null) { node.removeAttribute(name); return true; }
      node.setAttribute(name, String(value)); return true;
    },
    setProperty(node, name, value) {
      if (booleans.has(name)) { node[name] = value === 'true'; return true; }
      if (!['value', 'className', 'id', 'title', 'textContent', 'selectedIndex'].includes(name) || String(value).length > 20000) return false;
      node[name] = name === 'selectedIndex' ? Math.max(-1, Math.min(1000, Number(value) || 0)) : String(value); return true;
    },
  };
  return policy;
}

export function seedDOM(root, html, policy) {
  const template = root.ownerDocument.createElement('template');
  template.innerHTML = html;
  let count = 0;
  function clean(parent) {
    for (const node of [...parent.childNodes]) {
      if (++count > 500) throw new Error('Use at most 500 nodes in the practice HTML.');
      if (node.nodeType === 3) continue;
      if (node.nodeType !== 1 || !policy.sanitize(node)) { node.remove(); continue; }
      for (const attribute of [...node.attributes]) if (!policy.setAttribute(node, attribute.name, attribute.value)) node.removeAttribute(attribute.name);
      clean(node);
    }
  }
  clean(template.content);
  root.replaceChildren(template.content);
}

export function domAuthorSource(code) {
  return `(() => {
    const send = postMessage.bind(self);
    const report = (kind, text = '') => send({ raytech: kind, text: String(text).slice(0, 20000) });
    const print = (...values) => report('output', values.map(value => { try { return typeof value === 'string' ? value : JSON.stringify(value) ?? String(value); } catch { return String(value); } }).join(' '));
    for (const name of ['log', 'warn', 'error', 'info', 'debug']) console[name] = print;
    self.print = print;
    addEventListener('error', event => { event.preventDefault(); report('failure', event.message || 'JavaScript error'); });
    addEventListener('unhandledrejection', event => { event.preventDefault(); report('failure', event.reason?.message || event.reason); });
    setInterval(() => report('heartbeat'), 1000);
    report('heartbeat');
    (async () => {\n${code}\n})().then(() => report('interactive'), error => report('failure', error?.message || error));
  })();`;
}

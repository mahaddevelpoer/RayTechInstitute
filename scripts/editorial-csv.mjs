// RFC 4180 style CSV reader. Handles quoted fields, doubled quotes, CRLF and a UTF-8 BOM.
export function parseCsv(text) {
  const source = String(text).replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      if (field.length) throw Error(`Unexpected quote inside unquoted field at character ${index}`);
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\r') {
      if (source[index + 1] === '\n') index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (quoted) throw Error('Unterminated quoted field');
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter(entry => entry.some(value => value.length > 0));
}

export function parseCsvRecords(text) {
  const rows = parseCsv(text);
  if (!rows.length) return { headers: [], records: [] };
  const headers = rows[0].map(header => header.trim());
  const records = rows.slice(1).map(cells => {
    if (cells.length !== headers.length) throw Error(`CSV row has ${cells.length} fields but the header has ${headers.length}`);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index]]));
  });
  return { headers, records };
}

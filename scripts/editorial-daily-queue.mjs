// Keep daily releases isolated while preserving the November 11 CLI defaults.
export const editorialBatch = process.argv.find(a => a.startsWith('--batch='))?.slice(8) || '20261111-daily';
if (!['20261111-daily', '20261112-daily', '20261113-daily'].includes(editorialBatch)) throw Error('Unsupported editorial queue');
export const editorialRegion = process.argv.find(a => a.startsWith('--region='))?.slice(9) || 'PK';
if (!['PK', 'US'].includes(editorialRegion)) throw Error('Unsupported editorial region');
if (editorialRegion === 'US' && editorialBatch !== '20261112-daily') throw Error('Unsupported US editorial date');
export const editorialRoot = `content/editorial-drafts/trending-${editorialRegion.toLowerCase()}-${editorialBatch}`;
export const editorialArtifacts = `artifacts/${editorialRegion === 'US' ? 'us' : 'pakistan'}-nov${editorialBatch.slice(6, 8)}`;
export const editorialInputRows = editorialRegion === 'US' ? 448 : editorialBatch === '20261113-daily' ? 84 : editorialBatch === '20261112-daily' ? 72 : 70;

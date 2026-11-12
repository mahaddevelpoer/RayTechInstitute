// Keep daily releases isolated while preserving the November 11 CLI defaults.
export const editorialBatch = process.argv.find(a => a.startsWith('--batch='))?.slice(8) || '20261111-daily';
if (!['20261111-daily', '20261112-daily'].includes(editorialBatch)) throw Error('Unsupported editorial queue');
export const editorialRoot = `content/editorial-drafts/trending-pk-${editorialBatch}`;
export const editorialArtifacts = `artifacts/pakistan-nov${editorialBatch.slice(6, 8)}`;
export const editorialInputRows = editorialBatch === '20261112-daily' ? 72 : 70;

export const t=(section,title,pages,notes)=>({section,title,pages,notes});
export const a=(number,question,answer,pages)=>({number,question,answer,pages});
export const q=(number,question,answer,wrong,explanation)=>({number,question,answer,wrong,explanation});
export const practice=(section,pages,rows)=>rows.map(([question,answer,wrong,explanation])=>({section,pages,question,answer,wrong,explanation}));

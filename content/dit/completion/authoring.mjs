// Original teaching content. Tuples keep source answers unambiguous; the build
// assigns balanced public option positions without changing question wording.
export const q=(question,answer,wrong,explanation,code='')=>({question,answer,wrong,explanation,...(code?{code}:{})});
export const t=(code,title,notes,questions=[])=>({code,title,notes,questions});
export const lab=(id,title,steps,expected,extra={})=>({id,title,steps,expected,...extra});
export const osSource=['Operating-system concepts and further study','https://pages.cs.wisc.edu/~remzi/OSTEP/'];
export const pythonSource=['Python tutorial and language reference','https://docs.python.org/3/tutorial/'];

const references: Record<string, {caption: string; rows: string[][]}> = {
  'authored-python-002': {caption: 'Common Python value types', rows: [
    ['int', '42', 'A whole-number value'], ['float', '4.2', 'A floating-point numeric value'],
    ['str', '\"42\"', 'Text; convert it before numeric arithmetic'], ['bool', 'True or False', 'A Boolean value'],
  ]},
  'authored-python-004': {caption: 'Assignment and equality comparison', rows: [
    ['=', 'score = 3', 'Binds score to the value 3'], ['==', 'score == 3', 'Compares values and returns a Boolean'],
  ]},
};
export function LessonReference({topicId}: {topicId: string}) {
  const reference=references[topicId];if(!reference)return null;
  return <div className="mb-6 overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><caption className="mb-3 text-left font-semibold">{reference.caption}</caption><thead><tr>{['Type or operator','Example','Meaning'].map(label=><th className="border border-slate-300 p-3" scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{reference.rows.map(([name, example, meaning])=><tr key={name}><th className="border border-slate-300 p-3" scope="row">{name}</th><td className="border border-slate-300 p-3"><code>{example}</code></td><td className="border border-slate-300 p-3">{meaning}</td></tr>)}</tbody></table><p className="mt-2 text-xs"><a className="underline" href="https://docs.python.org/3/library/stdtypes.html">Python built-in types reference</a> · <a className="underline" href="https://docs.python.org/3/reference/simple_stmts.html#assignment-statements">Assignment reference</a></p></div>;
}

export type VariableLabState = { days?: number; minutes_per_day?: number; total?: number };
export type VariableLabFrame = { line: string; note: string; state: VariableLabState; output: string[] };

/** A finite teaching model, never an evaluator for student source. */
export function variableLabFrames(days: number, minutes: number, changedDays: number, recalculate: boolean): VariableLabFrame[] {
  if (![days, changedDays].every(value => Number.isInteger(value) && value >= 1 && value <= 10) || !Number.isInteger(minutes) || minutes < 5 || minutes > 60) throw new Error('Use the bounded teaching controls.');
  const initialTotal = days * minutes; const changedTotal = changedDays * minutes;
  const frames: VariableLabFrame[] = [
    { line: `days = ${days}`, note: `Bind days to the integer ${days}.`, state: { days }, output: [] },
    { line: `minutes_per_day = ${minutes}`, note: 'A second name refers to a separate numeric value.', state: { days, minutes_per_day: minutes }, output: [] },
    { line: 'total = days * minutes_per_day', note: `Read ${days} and ${minutes}; calculate ${initialTotal}. This stores a result, not a live formula.`, state: { days, minutes_per_day: minutes, total: initialTotal }, output: [] },
    { line: `days = ${changedDays}`, note: `days now refers to ${changedDays}. No instruction has recalculated total, so it remains ${initialTotal}.`, state: { days: changedDays, minutes_per_day: minutes, total: initialTotal }, output: [] },
    { line: 'print(total)', note: `Print the already calculated value ${initialTotal}.`, state: { days: changedDays, minutes_per_day: minutes, total: initialTotal }, output: [String(initialTotal)] },
  ];
  if (recalculate) frames.push(
    { line: 'total = days * minutes_per_day', note: `Explicitly calculate again: ${changedDays} × ${minutes} = ${changedTotal}. Now total changes.`, state: { days: changedDays, minutes_per_day: minutes, total: changedTotal }, output: [String(initialTotal)] },
    { line: 'print(total)', note: `The second output is ${changedTotal}. The extra assignment, not the earlier days change alone, produced this result.`, state: { days: changedDays, minutes_per_day: minutes, total: changedTotal }, output: [String(initialTotal), String(changedTotal)] },
  );
  return frames;
}

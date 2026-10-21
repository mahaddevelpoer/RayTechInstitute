export type HeaderScrollState = { anchor: number; hidden: boolean };
/** Hysteresis prevents trackpad noise from repeatedly toggling navigation. */
export function nextHeaderScroll(state: HeaderScrollState, position: number, keepVisible = false): HeaderScrollState {
  if (!Number.isFinite(position)) return state;
  const next = Math.max(0, position);
  if (keepVisible || next < 80) return { anchor: next, hidden: false };
  if (Math.abs(next - state.anchor) < 24) return state;
  return { anchor: next, hidden: next > state.anchor };
}

'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { nextHeaderScroll } from '@/lib/header-scroll';

export function useHeaderVisibility(container: RefObject<HTMLElement> | undefined, keepVisible: boolean) {
  const { scrollY } = useScroll({ container });
  const state = useRef({ anchor: 0, hidden: false });
  const [hidden, setHidden] = useState(false);
  function reveal() { state.current = { anchor: scrollY.get(), hidden: false }; setHidden(false); }
  useEffect(() => { if (keepVisible) reveal(); }, [keepVisible]);
  useMotionValueEvent(scrollY, 'change', value => {
    const next = nextHeaderScroll(state.current, value, keepVisible);
    if (next.hidden !== state.current.hidden) setHidden(next.hidden);
    state.current = next;
  });
  return { hidden, reveal };
}

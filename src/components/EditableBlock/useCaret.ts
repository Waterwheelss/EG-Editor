import React, { useEffect, useRef } from 'react';
import { setCaret } from '../../lib/selection/caret';

const useCaret = () => {
  const refStartContainer: React.MutableRefObject<Node | null> = useRef(null);
  const refStartOffset: React.MutableRefObject<number> = useRef(0);
  const pressKey: React.MutableRefObject<string | null> = useRef(null);
  const isCollapsed: React.MutableRefObject<boolean> = useRef(false);

  useEffect(() => {
    if (refStartContainer.current !== null) {
      if (pressKey.current === 'Backspace' && !isCollapsed.current) {
        setCaret(refStartContainer.current, refStartOffset.current);
      } else if (pressKey.current === 'Backspace') {
        setCaret(refStartContainer.current, refStartOffset.current - 1);
      } else {
        setCaret(refStartContainer.current, refStartOffset.current + 1);
      }
    }
  });

  const setStartContainer = (element: Node) => {
    refStartContainer.current = element;
  };

  const setStartOffset = (offset: number) => {
    refStartOffset.current = offset;
  };

  const setPressKey = (key: string | null) => {
    pressKey.current = key;
  };

  const setIsCollapsed = (boolean: boolean) => {
    isCollapsed.current = boolean;
  };

  return [{
    setStartContainer, setStartOffset, setPressKey, setIsCollapsed,
  }];
};

export default useCaret;

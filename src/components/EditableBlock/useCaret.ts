import React, { useEffect, useRef } from 'react';
import { getCaretCharacterOffset, setCaret } from '../../lib/selection/caret';

const useCaret = () => {
  const refStartContainer: React.MutableRefObject<Node | null> = useRef(null);
  const refStartOffset: React.MutableRefObject<number> = useRef(0);
  const inputType: React.MutableRefObject<string | null> = useRef(null);
  const isCollapsed: React.MutableRefObject<boolean> = useRef(false);
  const newNodeRef: React.MutableRefObject<Node | null> = useRef(null);

  useEffect(() => {
    if (refStartContainer.current !== null) {
      if (inputType.current === 'pushInlineStyle' && newNodeRef.current !== null) {
        setCaret(newNodeRef.current.nextSibling as Node, 0);
      } else if (inputType.current === 'Backspace' && !isCollapsed.current) {
        setCaret(refStartContainer.current, refStartOffset.current);
      } else if (inputType.current === 'Backspace') {
        if (refStartOffset.current === 0) {
          const previousSibling = refStartContainer.current.previousSibling as Node;
          const { lastChild } = previousSibling;
          const offset = lastChild?.nodeValue?.length ? lastChild?.nodeValue?.length : 0;
          setCaret(lastChild as Node, offset);
        } else {
          setCaret(refStartContainer.current, refStartOffset.current - 1);
        }
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

  const setInputType = (key: string | null) => {
    inputType.current = key;
  };

  const setIsCollapsed = (boolean: boolean) => {
    isCollapsed.current = boolean;
  };

  return {
    setStartContainer, setStartOffset, setInputType, setIsCollapsed, newNodeRef,
  };
};

export default useCaret;

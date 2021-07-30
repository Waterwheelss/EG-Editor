export const getCaret = (element: HTMLDivElement): number => {
  let newCaretPosition = 0;
  const selection = window.getSelection();

  if (selection?.rangeCount === 0) {
    return newCaretPosition;
  }

  const range = selection?.getRangeAt(0);
  const preRange = range?.cloneRange();
  preRange?.selectNodeContents(element);
  preRange?.setEnd(range?.endContainer as any, range?.endOffset as any);
  newCaretPosition = preRange?.toString().length as number;

  return newCaretPosition;
};

export const setCaret = (element: HTMLDivElement, offset: number): void => {
  let newOffset;

  const selection = window.getSelection();
  const stringRange = document.createRange();
  const range = document.createRange();

  stringRange.selectNodeContents(element);

  if (offset > stringRange?.toString().length) {
    newOffset = offset - 1;
  } else {
    newOffset = offset;
  }

  range.setStart(element.childNodes[0], newOffset);
  range.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(range);
};

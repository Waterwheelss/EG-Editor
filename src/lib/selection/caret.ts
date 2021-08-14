type CharacterOffset = {
  characterStartOffset: number,
  characterEndOffset: number,
}

export const isSelected = () => {
  const selection = window.getSelection();

  if (selection?.type === 'None') {
    return false;
  }

  return true;
};

export const getCaretCharacterOffset = (element: HTMLDivElement): CharacterOffset => {
  const selection = window.getSelection();

  if (selection === null) {
    throw new TypeError('selection can\'t not be null');
  }

  const range = selection.getRangeAt(0);
  const preRange = range.cloneRange();
  preRange.selectNodeContents(element);
  preRange.setEnd(range.startContainer as any, range.startOffset as any);
  const characterStartOffset = preRange.toString().length;
  let characterEndOffset;

  if (selection.isCollapsed) {
    characterEndOffset = characterStartOffset;
  } else {
    preRange.setEnd(range.endContainer as any, range.endOffset as any);
    characterEndOffset = preRange.toString().length;
  }

  return {
    characterStartOffset,
    characterEndOffset,
  };
};

export const setCaret = (startContainer: Node, startOffset: number): void => {
  const selection = window.getSelection();
  const newRange = document.createRange();

  newRange.setStart(startContainer, startOffset);
  newRange.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(newRange);
  console.log(newRange);
};

import React from 'react';
import { getCaretCharacterOffset } from '../../../lib/selection/caret';
import {
  addText,
  replaceText,
  shiftStyle,
  deleteText,
  applyStyle,
} from '../../../slices/blockSlice';
import { EditableBlockState } from '../EditableBlock';

const onKeyPress = (
  e: React.KeyboardEvent<HTMLDivElement>,
  editableBlockState: EditableBlockState,
) => {
  const {
    id,
    ref,
    dispatch,
    caret,
    blockData,
  } = editableBlockState;
  const {
    setInputType,
    setIsCollapsed,
    setStartContainer,
    setStartOffset,
    newNodeRef,
  } = caret;

  e.preventDefault();
  const { key } = e;

  if (key === '`') {
    if (ref.current === null) {
      throw new TypeError('The reference to the EdtitableBlock can\'t not be null');
    }
    // check any same symbol before
    let endOffset = getCaretCharacterOffset(ref.current).characterEndOffset - 1;
    const { text } = blockData;
    for (let i = endOffset; i >= 0; i -= 1) {
      if (text[i] === '`') {
        let startOffset = i;
        if (startOffset > endOffset) {
          const temp = startOffset;
          startOffset = endOffset;
          endOffset = temp;
        }
        setInputType('pushInlineStyle');
        dispatch(deleteText({
          id,
          caretCharacterPosition: startOffset + 1,
        }));
        dispatch(applyStyle({
          id,
          style: {
            tag: 'code',
            startOffset,
            endOffset,
          },
        }));
        // selection.removeAllRanges();
        return;
      }
    }
  }

  if (ref.current === null) {
    throw new TypeError('The reference to the EdtitableBlock can\'t not be null');
  }

  const selection = window.getSelection() as Selection;
  const { startOffset, startContainer } = selection.getRangeAt(0);

  setInputType(null);
  setIsCollapsed(selection.isCollapsed);
  setStartContainer(startContainer);
  setStartOffset(startOffset);

  const { characterStartOffset, characterEndOffset } = getCaretCharacterOffset(ref.current);
  const caretCharacterPosition = getCaretCharacterOffset(ref.current).characterStartOffset;

  if (!selection.isCollapsed) {
    dispatch(replaceText({
      id,
      startOffset: characterStartOffset,
      endOffset: characterEndOffset,
      newString: e.key,
    }));
    dispatch(shiftStyle({
      id,
      type: 'replaceText',
      caretCharacterPosition,
      startOffset: characterStartOffset,
      endOffset: characterEndOffset,
      hasNewString: true,
    }));
    selection.removeAllRanges();
  } else {
    dispatch(addText({
      id,
      text: e.key,
      caretCharacterPosition,
    }));
    dispatch(shiftStyle({
      id,
      type: 'addText',
      caretCharacterPosition,
      startOffset: characterStartOffset,
      endOffset: characterEndOffset,
    }));
    selection.removeAllRanges();
  }
};

export default onKeyPress;

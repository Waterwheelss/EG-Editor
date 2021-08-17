import React from 'react';
import { getCaretCharacterOffset } from '../../../lib/selection/caret';
import { replaceText, shiftStyle, deleteText } from '../../../slices/blockSlice';
import { EditableBlockState } from '../EditableBlock';

const onKeyDown = (
  e: React.KeyboardEvent<HTMLDivElement>,
  editableBlockState: EditableBlockState,
) => {
  const {
    id,
    ref,
    dispatch,
    caret,
  } = editableBlockState;

  const {
    setInputType,
    setIsCollapsed,
    setStartContainer,
    setStartOffset,
    newNodeRef,
  } = caret;
  console.log('keydown');
  const { key } = e;
  if (key === 'Backspace') {
    e.preventDefault();

    if (ref.current === null) {
      throw new TypeError('The reference to the EdtitableBlock can\'t not be null');
    }

    const selection = window.getSelection() as Selection;
    const { startOffset, startContainer } = selection.getRangeAt(0);

    setInputType(key);
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
      }));
      dispatch(shiftStyle({
        id,
        type: 'replaceText',
        caretCharacterPosition,
        startOffset: characterStartOffset,
        endOffset: characterEndOffset,
        hasNewString: false,
      }));
    } else {
      if (startOffset === 1) {
        const previousSibling = startContainer.parentNode?.previousSibling as Node;
        const nextSibling = startContainer.parentNode?.nextSibling as Node;
        if (previousSibling.nodeName === nextSibling.nodeName) {
          const previousSiblingLength = (
            previousSibling.nodeValue?.length ? previousSibling.nodeValue?.length + 1 : 0
          );
          setStartOffset(previousSiblingLength);
          setStartContainer(previousSibling);
        }
      }
      dispatch(deleteText({
        id,
        caretCharacterPosition,
      }));
      dispatch(shiftStyle({
        id,
        type: 'deleteText',
        caretCharacterPosition,
        startOffset: characterStartOffset,
        endOffset: characterEndOffset,
      }));
    }
  }
};

export default onKeyDown;

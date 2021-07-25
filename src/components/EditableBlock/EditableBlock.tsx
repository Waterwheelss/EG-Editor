import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../rootReducer';
import { changeText } from '../../slices/blockSlice';
import ContentEditable from './ContentEditable';

import markdownParser from '../../lib/markdownParser';

type EditableBlockProps = {
  id: string
}

const EditableBlock = ({ id }: EditableBlockProps) => {
  const [text, setText] = useState('test');
  const ref: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const caretPosition = useRef(0);

  const BlockData = useSelector(
    (state: RootState) => state.blocks.blocksGroup.find((block) => block.id === id),
  );

  const dispatch = useDispatch();

  if (BlockData === undefined) {
    throw new TypeError('The Block data can not be undefined');
  }

  useEffect(() => {
    setCaret(ref.current, caretPosition.current + 1);
    setText(BlockData.text);
  });

  const onKeyPressHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    caretPosition.current = getCaret(ref.current);
    dispatch(changeText({
      id,
      text: e.key,
    }));
  };

  const getCaret = (element: any): number => {
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

  function setCaret(element: any, offset: any) {
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
  }

  return (
    <>
      <div
        ref={ref}
        contentEditable="true"
        suppressContentEditableWarning
        className="block"
        onKeyPress={onKeyPressHandler}
        placeholder="Type '/' for commands"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </>
  );
};

export default EditableBlock;

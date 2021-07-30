import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../rootReducer';
import { addText, deleteText } from '../../slices/blockSlice';
import { setCaret, getCaret } from '../../utils/caret';
import { deleteString } from '../../utils/string';

type EditableBlockProps = {
  id: string
}

const EditableBlock = ({ id }: EditableBlockProps) => {
  const ref: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const caretPosition = useRef(0);
  const presskey: React.MutableRefObject<string | null> = useRef(null);

  const BlockData = useSelector(
    (state: RootState) => state.blocks.blocksGroup.find((block) => block.id === id),
  );

  const dispatch = useDispatch();

  if (BlockData === undefined) {
    throw new TypeError('The Block data can not be undefined');
  }

  useEffect(() => {
    if (ref.current === null) {
      throw new TypeError('The reference to the EdtitableBlock can\'t not be null');
    }

    if (presskey.current === 'Backspace') {
      setCaret(ref.current, caretPosition.current - 1);
    } else {
      setCaret(ref.current, caretPosition.current + 1);
    }
  });

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;

    if (key === 'Backspace') {
      e.preventDefault();

      if (ref.current === null) {
        throw new TypeError('The reference to the EdtitableBlock can\'t not be null');
      }

      caretPosition.current = getCaret(ref.current);
      presskey.current = key;
      dispatch(deleteText(id));
    }
  };

  const onKeyPressHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (ref.current === null) {
      throw new TypeError('The reference to the EdtitableBlock can\'t not be null');
    }

    caretPosition.current = getCaret(ref.current);
    presskey.current = null;
    dispatch(addText({
      id,
      text: e.key,
    }));
  };

  return (
    <>
      <div
        ref={ref}
        contentEditable="true"
        suppressContentEditableWarning
        className="block"
        onKeyPress={onKeyPressHandler}
        onKeyDown={onKeyDownHandler}
        onInput={() => console.log('oninput')}
        placeholder="Type '/' for commands"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: BlockData.text }}
      />
    </>
  );
};

export default EditableBlock;

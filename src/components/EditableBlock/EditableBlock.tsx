import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../rootReducer';
import { addText, deleteText, replaceText } from '../../slices/blockSlice';
import { Block } from '../../types/block';
import { setCaret, getCaretCharacterOffset } from '../../lib/selection/caret';

type EditableBlockProps = {
  id: string
}

const EditableBlock = ({ id }: EditableBlockProps) => {
  const ref: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const caretPosition = useRef(0);
  const refStartContainer: React.MutableRefObject<Node | null> = useRef(null);
  const refStartOffset = useRef(0);
  const presskey: React.MutableRefObject<string | null> = useRef(null);
  const isCollapsed: React.MutableRefObject<boolean> = useRef(false);

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

    if (refStartContainer.current !== null) {
      if (presskey.current === 'Backspace' && !isCollapsed.current) {
        setCaret(refStartContainer.current, refStartOffset.current);
      } else if (presskey.current === 'Backspace') {
        setCaret(refStartContainer.current, refStartOffset.current - 1);
      } else {
        setCaret(refStartContainer.current, refStartOffset.current + 1);
      }
    }
  });

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;

    if (key === 'Backspace') {
      e.preventDefault();

      if (ref.current === null) {
        throw new TypeError('The reference to the EdtitableBlock can\'t not be null');
      }

      const selection = window.getSelection() as Selection;

      presskey.current = key;
      isCollapsed.current = selection.isCollapsed;

      if (!isCollapsed.current) {
        const { startOffset, endOffset, startContainer } = selection.getRangeAt(0);
        caretPosition.current = startOffset;

        refStartContainer.current = startContainer;
        refStartOffset.current = startOffset;

        const { characterStartOffset, characterEndOffset } = getCaretCharacterOffset(ref.current);

        dispatch(replaceText({
          id,
          startOffset: characterStartOffset,
          endOffset: characterEndOffset,
        }));
      } else {
        const { startOffset, startContainer } = selection.getRangeAt(0);

        caretPosition.current = getCaretCharacterOffset(ref.current).characterStartOffset;
        refStartContainer.current = startContainer;
        refStartOffset.current = startOffset;

        dispatch(deleteText({
          id,
          caretCharacterPosition: caretPosition.current,
        }));
      }
    }
    if (ref.current === null) {
      throw new TypeError('The reference to the EdtitableBlock can\'t not be null');
    }
  };

  const onKeyPressHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (ref.current === null) {
      throw new TypeError('The reference to the EdtitableBlock can\'t not be null');
    }

    const selection = window.getSelection() as Selection;

    presskey.current = null;
    isCollapsed.current = selection.isCollapsed;

    if (!isCollapsed.current) {
      const {
        startOffset,
        startContainer,
        endOffset,
        endContainer,
      } = selection.getRangeAt(0);

      const { characterStartOffset, characterEndOffset } = getCaretCharacterOffset(ref.current);

      caretPosition.current = startOffset;
      refStartContainer.current = startContainer;
      refStartOffset.current = startOffset;

      dispatch(replaceText({
        id,
        startOffset: characterStartOffset,
        endOffset: characterEndOffset,
        newString: e.key,
      }));
    } else {
      const { startOffset, startContainer } = selection.getRangeAt(0);

      caretPosition.current = getCaretCharacterOffset(ref.current).characterStartOffset;
      refStartContainer.current = startContainer;
      refStartOffset.current = startOffset;
      dispatch(addText({
        id,
        text: e.key,
        caretCharacterPosition: caretPosition.current,
      }));
    }
  };

  const render = () => {
    const html = markdownRender(BlockData);
    return html;
  };

  const markdownRender = (block: Block) => {
    const string = block.text;
    const stringArray: Array<any> = [];

    if (block.styles?.length === 0) {
      stringArray.push(string);
      return stringArray;
    }

    block.styles?.forEach((style) => {
      const { startOffset, endOffset } = style;
      stringArray.push(string.substring(0, startOffset));
      const propString = string.substring(startOffset, endOffset);
      stringArray.push(<code>{propString}</code>);
      stringArray.push(string.substring(endOffset, string.length));
    });

    return stringArray;
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
        placeholder="Type '/' for commands"
      >
        {render()}
      </div>
    </>
  );
};

export default EditableBlock;

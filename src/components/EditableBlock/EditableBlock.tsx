import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../rootReducer';
import {
  addText,
  deleteText,
  replaceText,
  applyStyle,
} from '../../slices/blockSlice';
import { getCaretCharacterOffset } from '../../lib/selection/caret';
import useCaret from './useCaret';
import RenderHtml from './RenderHtml';
import { getTags } from '../../lib/render/getRenderTags';
import { getRenderArray } from '../../lib/render/getRenderArray';

type EditableBlockProps = {
  id: string
}

const EditableBlock = ({ id }: EditableBlockProps) => {
  const ref: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const BlockData = useSelector(
    (state: RootState) => state.blocks.blocksGroup.find((block) => block.id === id),
  );

  const dispatch = useDispatch();

  if (BlockData === undefined) {
    throw new TypeError('The Block data can not be undefined');
  }

  const [{
    setStartContainer,
    setStartOffset,
    setPressKey,
    setIsCollapsed,
  }] = useCaret();

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;

    if (key === 'Backspace') {
      e.preventDefault();

      if (ref.current === null) {
        throw new TypeError('The reference to the EdtitableBlock can\'t not be null');
      }

      const selection = window.getSelection() as Selection;
      const { startOffset, startContainer } = selection.getRangeAt(0);

      setPressKey(key);
      setIsCollapsed(selection.isCollapsed);
      setStartContainer(startContainer);
      setStartOffset(startOffset);

      if (!selection.isCollapsed) {
        const { characterStartOffset, characterEndOffset } = getCaretCharacterOffset(ref.current);
        dispatch(replaceText({
          id,
          startOffset: characterStartOffset,
          endOffset: characterEndOffset,
        }));
      } else {
        dispatch(deleteText({
          id,
          caretCharacterPosition: getCaretCharacterOffset(ref.current).characterStartOffset,
        }));
      }
    }
  };

  const onKeyPressHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { key } = e;

    if (key === '`') {
      if (ref.current === null) {
        throw new TypeError('The reference to the EdtitableBlock can\'t not be null');
      }
      // check any same symbol before
      let endOffset = getCaretCharacterOffset(ref.current).characterEndOffset;
      const { text } = BlockData;
      for (let i = endOffset; i >= 0; i -= 1) {
        if (text[i] === '`') {
          let startOffset = i;
          if (startOffset > endOffset) {
            const temp = startOffset;
            startOffset = endOffset;
            endOffset = temp;
          }
          dispatch(applyStyle({
            id,
            style: {
              tag: 'code',
              startOffset,
              endOffset,
            },
          }));
          return;
        }
      }
    }

    if (ref.current === null) {
      throw new TypeError('The reference to the EdtitableBlock can\'t not be null');
    }

    const selection = window.getSelection() as Selection;
    const { startOffset, startContainer } = selection.getRangeAt(0);

    setPressKey(null);
    setIsCollapsed(selection.isCollapsed);
    setStartContainer(startContainer);
    setStartOffset(startOffset);

    if (!selection.isCollapsed) {
      const { characterStartOffset, characterEndOffset } = getCaretCharacterOffset(ref.current);
      dispatch(replaceText({
        id,
        startOffset: characterStartOffset,
        endOffset: characterEndOffset,
        newString: e.key,
      }));
    } else {
      dispatch(addText({
        id,
        text: e.key,
        caretCharacterPosition: getCaretCharacterOffset(ref.current).characterStartOffset,
      }));
    }
  };

  const render = (): any => {
    const block = { ...BlockData };
    const { text } = block;

    const tags = getTags(block, text);
    const renderReadyData = getRenderArray(tags, text);

    return <RenderHtml htmlArray={renderReadyData} />;
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

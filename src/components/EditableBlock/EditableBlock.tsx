import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../rootReducer';
import { addText, deleteText, replaceText } from '../../slices/blockSlice';
import { Block } from '../../types/block';
import { getCaretCharacterOffset } from '../../lib/selection/caret';
import useCaret from './useCaret';

type EditableBlockProps = {
  id: string
}

const EditableBlock = ({ id }: EditableBlockProps) => {
  const ref: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const caretPosition: React.MutableRefObject<number> = useRef(0);

  const [{
    setStartContainer,
    setStartOffset,
    setPressKey,
    setIsCollapsed,
  }] = useCaret();

  const BlockData = useSelector(
    (state: RootState) => state.blocks.blocksGroup.find((block) => block.id === id),
  );

  const dispatch = useDispatch();

  if (BlockData === undefined) {
    throw new TypeError('The Block data can not be undefined');
  }

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

      if (!selection.isCollapsed) {
        caretPosition.current = startOffset;
        setStartContainer(startContainer);
        setStartOffset(startOffset);

        const { characterStartOffset, characterEndOffset } = getCaretCharacterOffset(ref.current);

        dispatch(replaceText({
          id,
          startOffset: characterStartOffset,
          endOffset: characterEndOffset,
        }));
      } else {
        caretPosition.current = getCaretCharacterOffset(ref.current).characterStartOffset;
        setStartContainer(startContainer);
        setStartOffset(startOffset);

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

    setPressKey(null);
    setIsCollapsed(selection.isCollapsed);

    if (!selection.isCollapsed) {
      const {
        startOffset,
        startContainer,
      } = selection.getRangeAt(0);

      const { characterStartOffset, characterEndOffset } = getCaretCharacterOffset(ref.current);

      caretPosition.current = startOffset;
      setStartContainer(startContainer);
      setStartOffset(startOffset);

      dispatch(replaceText({
        id,
        startOffset: characterStartOffset,
        endOffset: characterEndOffset,
        newString: e.key,
      }));
    } else {
      const { startOffset, startContainer } = selection.getRangeAt(0);

      caretPosition.current = getCaretCharacterOffset(ref.current).characterStartOffset;
      setStartContainer(startContainer);
      setStartOffset(startOffset);
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

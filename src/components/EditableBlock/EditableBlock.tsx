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
    // const html = markdownRender(BlockData);
    // '<span>good <em>bad <code>testing</code> bad</em> good</span>'
    const block = { ...BlockData };
    const renderGroup: any = [];
    const { text } = block;
    block.styles?.forEach((style) => {
      const { startOffset, endOffset, tag } = style;
      renderGroup.push({
        position: startOffset,
        tagType: 'openning',
        tag,
      });
      renderGroup.push({
        position: endOffset,
        tagType: 'closing',
        tag,
      });
    });

    renderGroup.sort((a: any, b: any) => {
      if (a.position < b.position) {
        return -1;
      }
      return 1;
    });

    const recur = (group: any) => {
      let index = 0;

      const isNextClose = (data: any) => data?.tagType === 'closing';

      const innerRecur = (data: any, initArray = []): any => {
        const result: any = [];
        const textSlice = text.substring(data[index].position, data[index + 1].position);
        result.push(data[index].tag, textSlice);

        while (!isNextClose(data[index + 1])) {
          index += 1;
          const next = innerRecur(data);
          result.push(next[0], next[1] ? next[1] : '');
        }
        index += 1;
        if (index + 1 >= data.length) {
          return [result];
        }
        return [result, text.substring(data[index].position, data[index + 1].position)];
      };

      return innerRecur(group);
    };

    const [renderReadyData] = recur(renderGroup);

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

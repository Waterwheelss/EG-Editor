import React, { Dispatch, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../rootReducer';
import { getCaretCharacterOffset, isSelected } from '../../lib/selection/caret';
import useCaret, { Caret } from '../../hooks/useCaret';
import RenderHtml from './RenderHtml';
import { getTags } from '../../lib/render/getRenderTags';
import { getRenderArray } from '../../lib/render/getRenderArray';
import onKeyDown from './handlers/onKeyDown';
import onKeyPress from './handlers/onKeyPress';
import { Block } from '../../types/block';

type EditableBlockProps = {
  id: string
}

export interface EditableBlockState {
  id: string,
  dispatch: Dispatch<any>,
  ref: React.RefObject<HTMLDivElement>,
  blockData: Block,
  caret: Caret,
}

const EditableBlock = ({ id }: EditableBlockProps) => {
  const ref: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const blockData = useSelector(
    (state: RootState) => state.blocks.blocksGroup.find((block) => block.id === id),
  );

  const dispatch = useDispatch();

  if (blockData === undefined) {
    throw new TypeError('The Block data can not be undefined');
  }

  const {
    setStartContainer,
    setStartOffset,
    setInputType,
    setIsCollapsed,
    newNodeRef,
  } = useCaret();

  const caret = {
    setStartContainer,
    setStartOffset,
    setInputType,
    setIsCollapsed,
    newNodeRef,
  };

  const render = (): any => {
    const block = { ...blockData };
    const { text } = block;

    const tags = getTags(block, text);
    const renderReadyData = getRenderArray(tags, text);
    // eslint-disable-next-line max-len
    const currentCaretPosition = isSelected() ? getCaretCharacterOffset(ref.current as any).characterStartOffset : null;

    return (
      <RenderHtml
        ref={newNodeRef}
        currentCaretPosition={currentCaretPosition}
        htmlArray={renderReadyData}
      />
    );
  };

  const editableBlockState: EditableBlockState = {
    id,
    ref,
    blockData,
    dispatch,
    caret,
  };

  return (
    <>
      <div
        ref={ref}
        contentEditable="true"
        suppressContentEditableWarning
        className="block"
        onKeyPress={(e) => onKeyPress(e, editableBlockState)}
        onKeyDown={(e) => onKeyDown(e, editableBlockState)}
        placeholder="Type '/' for commands"
      >
        {render()}
      </div>
    </>
  );
};

export default EditableBlock;

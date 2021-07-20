import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../rootReducer';
import keyDownHandler from '../keyDownHandler';

import EditableBlock from './EditableBlock';

const BlockRender = () => {
  const dispatch = useDispatch();
  const ref: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const blocks = useSelector((state: RootState) => state.blocks);

  useEffect(() => {
    document.addEventListener('keydown', (e) => keyDownHandler(e, dispatch, ref));
  }, []);

  return (
    <div>
      {blocks.blocksGroup.map((block) => {
        return (
          <EditableBlock key={block.id} id={block.id} />
        );
      })}
    </div>
  );
};

export default BlockRender;

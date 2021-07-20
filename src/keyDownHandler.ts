import React from 'react';
import { AppDispatch, getState } from './store';
import { addBlock, deleteBlock } from './slices/blockSlice';

export default (
  e: KeyboardEvent,
  dispatch: AppDispatch,
  ref: React.RefObject<HTMLDivElement>,
) => {
  const target = e.target as Element;

  switch (e.key) {
    case 'Enter':
      e.preventDefault();

      dispatch(addBlock({
        name: 'textField',
      }));

      // ref.current?.focus();
      break;
    case 'Backspace':
      if (target.innerHTML === '') {
        const currentBlock = getState().blocks.selectedBlock;

        // const previousBlock: HTMLDivElement = ref.current?.previousSibling as HTMLDivElement;
        // previousBlock.focus();

        dispatch(deleteBlock(currentBlock.id));
      }
      break;
    default:
      console.log(e);
  }
};

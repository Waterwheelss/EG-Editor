import { AppDispatch, getState } from './store';
import { addBlock, deleteBlock } from './slices/blockSlice';

const keyDownHandler = (e: KeyboardEvent, dispatch: AppDispatch) => {
  const target = e.target as Element;

  switch (e.key) {
    case 'Enter':
      e.preventDefault();

      dispatch(addBlock({
        name: 'textField',
        text: '',
      }));

      break;
    case 'Backspace':
      if (target.innerHTML === '') {
        const currentBlock = getState().blocks.selectedBlock;

        dispatch(deleteBlock(currentBlock.id));
      }
      break;
    default:
      break;
  }
};

export default keyDownHandler;

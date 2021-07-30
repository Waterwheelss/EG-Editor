import { AppDispatch, getState } from './store';
import { addBlock, deleteBlock, deleteText } from './slices/blockSlice';

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
    default:
      break;
  }
};

export default keyDownHandler;

import { AppDispatch } from './store';
import { addBlock } from './slices/blockSlice';

const keyDownHandler = (e: KeyboardEvent, dispatch: AppDispatch) => {
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

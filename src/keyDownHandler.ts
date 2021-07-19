import { AppDispatch } from './store';
import { addBlock } from './slices/blockSlice';

export default (e: KeyboardEvent, dispath: AppDispatch) => {
  switch (e.key) {
    case 'Enter':
      e.preventDefault();
      dispath(addBlock({
        block: {
          name: 'textField',
        },
      }));
      break;
    default:
      console.log(e.key);
  }
};

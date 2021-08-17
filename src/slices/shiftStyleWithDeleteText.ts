import { BlockStyle } from '../types/block';

type Parameters = {
  caretCharacterPosition: number,
  styles: Array<BlockStyle>,
}

const shiftStyleWithDeleteText = ({
  caretCharacterPosition,
  styles,
}: Parameters): Array<BlockStyle> => {
  const newStyles = [...styles];
  const styleToRemove: Array<number> = [];

  newStyles.forEach((style, key) => {
    if (caretCharacterPosition > style.startOffset
      && caretCharacterPosition <= style.endOffset) {
      style.endOffset -= 1;
    } else if (caretCharacterPosition < style.startOffset) {
      style.startOffset -= 1;
      style.endOffset -= 1;
    }

    if (style.startOffset === style.endOffset) {
      styleToRemove.push(key);
    }
  });

  styleToRemove.forEach((index: any) => {
    newStyles.splice(index, 1);
  });

  return newStyles;
};

export default shiftStyleWithDeleteText;

import { BlockStyle } from '../types/block';

type Parameters = {
  caretCharacterPosition: number,
  styles: Array<BlockStyle>,
}

const shiftStyleWithAddText = ({
  caretCharacterPosition,
  styles,
}: Parameters): Array<BlockStyle> => {
  const newStyles = [...styles];

  newStyles.forEach((style) => {
    if (caretCharacterPosition > style.startOffset
      && caretCharacterPosition <= style.endOffset) {
      style.endOffset += 1;
    } else if (caretCharacterPosition <= style.startOffset) {
      style.startOffset += 1;
      style.endOffset += 1;
    }
  });

  return newStyles;
};

export default shiftStyleWithAddText;

import { BlockStyle } from '../types/block';

type Parameters = {
  startOffset: number,
  endOffset: number,
  hasNewString: boolean,
  styles: Array<BlockStyle>
}

const shiftStyleWithReplaceText = ({
  startOffset,
  endOffset,
  hasNewString,
  styles,
}: Parameters): Array<BlockStyle> => {
  const newStyles = [...styles];
  const styleToRemove: Array<number> = [];

  newStyles.forEach((style, key) => {
    const insertOffset = hasNewString ? 1 : 0;

    if (startOffset < style.startOffset && endOffset < style.startOffset) {
      const shift = endOffset - startOffset - insertOffset;
      style.startOffset -= shift;
      style.endOffset -= shift;
    } else if (
      startOffset < style.startOffset
      && endOffset >= style.startOffset
      && endOffset <= style.endOffset
    ) {
      const shift = endOffset - startOffset - insertOffset;
      // The 'plus one' here is to prevent the new character be set on the next node.
      style.startOffset = startOffset + insertOffset;
      style.endOffset -= shift;
    } else if (
      startOffset >= style.startOffset
      && startOffset < style.endOffset
      && endOffset > style.endOffset
    ) {
      // The 'plus one' here is to prevent the new character be set on the next node.
      style.endOffset = startOffset + insertOffset;
    } else if (
      startOffset === style.startOffset
      && endOffset === style.endOffset
    ) {
      style.endOffset = startOffset + insertOffset;
    } else if (
      startOffset >= style.startOffset
      && endOffset <= style.endOffset
    ) {
      const shift = endOffset - startOffset - insertOffset;
      style.endOffset -= shift;
    } else if (
      startOffset < style.startOffset
      && endOffset > style.endOffset
    ) {
      styleToRemove.push(key);
    }
  });

  styleToRemove.forEach((index: any) => {
    newStyles.splice(index, 1);
  });

  return newStyles;
};

export default shiftStyleWithReplaceText;

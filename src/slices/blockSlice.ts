import {
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  Block,
  BlockState,
  BlockPayload,
  BlockStyle,
} from '../types/block';
import {
  addString,
  deleteString,
  replaceString,
} from '../utils/string';

interface AddTextPayload {
  id: string,
  text: string,
  caretCharacterPosition: number;
}

interface DeleteTextPayload {
  id: string,
  caretCharacterPosition: number;
}

interface ReplaceTextPayload {
  id: string,
  startOffset: number,
  endOffset: number,
  newString?: string,
}

interface ApplyStylePayload {
  id: string,
  style: BlockStyle,
}

const createInitialState = (name: string): BlockState => {
  const id = nanoid();
  const initialBlock: Block = {
    id,
    name,
    text: 'initial test secondtest',
    styles: [
      // {
      //   tag: 'code',
      //   startOffset: 5,
      //   endOffset: 20,
      // },
      // {
      //   tag: 'em',
      //   startOffset: 8,
      //   endOffset: 17,
      // },
      // {
      //   tag: 'strong',
      //   startOffset: 11,
      //   endOffset: 14,
      // },
    ],
  };

  return {
    blocksGroup: [
      initialBlock,
    ],
    selectedBlock: initialBlock,
  };
};

export const blockSlice = createSlice({
  name: 'blocks',
  initialState: createInitialState('textField'),
  reducers: {
    addBlock: {
      reducer: (state, action: PayloadAction<Block>) => {
        const block = { ...action.payload };
        return {
          blocksGroup: [...state.blocksGroup, block],
          selectedBlock: block,
        };
      },
      prepare: (block: BlockPayload) => {
        return {
          payload: {
            id: nanoid(),
            styles: [],
            ...block,
          },
        };
      },
    },
    deleteBlock: (state, action: PayloadAction<string | undefined>) => {
      const deleteId = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === deleteId);
      const previousBlockIndex = blockIndex - 1;
      const newBlocksGroup = [...state.blocksGroup];
      newBlocksGroup.splice(blockIndex, 1);

      return {
        blocksGroup: newBlocksGroup,
        selectedBlock: newBlocksGroup[previousBlockIndex],
      };
    },
    addText: (state, action: PayloadAction<AddTextPayload>) => {
      const { id, text, caretCharacterPosition } = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);

      state.blocksGroup[blockIndex].styles?.forEach((style) => {
        if (caretCharacterPosition > style.startOffset
          && caretCharacterPosition <= style.endOffset) {
          style.endOffset += 1;
        } else if (caretCharacterPosition <= style.startOffset) {
          style.startOffset += 1;
          style.endOffset += 1;
        }
      });

      // eslint-disable-next-line max-len
      state.blocksGroup[blockIndex].text = addString(state.blocksGroup[blockIndex].text, caretCharacterPosition, text);
    },
    deleteText: (state, action: PayloadAction<DeleteTextPayload>) => {
      const { id, caretCharacterPosition } = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);

      state.blocksGroup[blockIndex].styles?.forEach((style) => {
        if (caretCharacterPosition > style.startOffset
          && caretCharacterPosition <= style.endOffset) {
          style.endOffset -= 1;
        } else if (caretCharacterPosition < style.startOffset) {
          style.startOffset -= 1;
          style.endOffset -= 1;
        }
      });

      // eslint-disable-next-line max-len
      state.blocksGroup[blockIndex].text = deleteString(state.blocksGroup[blockIndex].text, caretCharacterPosition);
    },
    replaceText: (state, action: PayloadAction<ReplaceTextPayload>) => {
      const {
        id, startOffset, endOffset, newString,
      } = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);

      const styleToRemove: Array<number> = [];

      state.blocksGroup[blockIndex].styles?.forEach((style, key) => {
        const insertOffset = newString ? 1 : 0;

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
      styleToRemove.forEach((index) => {
        state.blocksGroup[blockIndex].styles?.splice(index, 1);
      });

      // eslint-disable-next-line max-len
      state.blocksGroup[blockIndex].text = replaceString(state.blocksGroup[blockIndex].text, startOffset, endOffset, newString);
    },
    applyStyle: (state, action: PayloadAction<ApplyStylePayload>) => {
      const { id, style } = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);

      const removeCharacterPosition = style.startOffset;

      state.blocksGroup[blockIndex].styles?.forEach((styleBlock) => {
        if (removeCharacterPosition > styleBlock.startOffset
          && removeCharacterPosition <= styleBlock.endOffset) {
          styleBlock.endOffset -= 1;
        } else if (removeCharacterPosition < styleBlock.startOffset) {
          styleBlock.startOffset -= 1;
          styleBlock.endOffset -= 1;
        }
      });

      // eslint-disable-next-line max-len
      state.blocksGroup[blockIndex].text = deleteString(state.blocksGroup[blockIndex].text, style.startOffset + 1);
      state.blocksGroup[blockIndex].styles?.push(style);
    },
  },
});

export const {
  addBlock,
  deleteBlock,
  addText,
  deleteText,
  replaceText,
  applyStyle,
} = blockSlice.actions;

export default blockSlice.reducer;

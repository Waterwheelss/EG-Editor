import {
  createAction,
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
import shiftStyleWithDeleteText from './shiftStyleWithDeleteText';
import shiftStyleWithReplaceText from './shiftStyleWithReplaceText';
import shiftStyleWithAddText from './shiftStyleWithAddText';

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

interface ShiftStylePayload {
  id: string,
  type: string,
  caretCharacterPosition: number,
  startOffset: number,
  endOffset: number,
  hasNewString?: boolean,
}

const createInitialState = (name: string): BlockState => {
  const id = nanoid();
  const initialBlock: Block = {
    id,
    name,
    text: '01234567891011121314151617181920',
    styles: [
      // {
      //   tag: 'code',
      //   startOffset: 2,
      //   endOffset: 7,
      // },
      // {
      //   tag: 'em',
      //   startOffset: 7,
      //   endOffset: 10,
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

      // eslint-disable-next-line max-len
      state.blocksGroup[blockIndex].text = addString(state.blocksGroup[blockIndex].text, caretCharacterPosition, text);
    },
    deleteText: (state, action: PayloadAction<DeleteTextPayload>) => {
      const { id, caretCharacterPosition } = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);

      // eslint-disable-next-line max-len
      state.blocksGroup[blockIndex].text = deleteString(state.blocksGroup[blockIndex].text, caretCharacterPosition);
    },
    replaceText: (state, action: PayloadAction<ReplaceTextPayload>) => {
      const {
        id, startOffset, endOffset, newString,
      } = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);

      // eslint-disable-next-line max-len
      state.blocksGroup[blockIndex].text = replaceString(state.blocksGroup[blockIndex].text, startOffset, endOffset, newString);
    },
    shiftStyle: (state, action: PayloadAction<ShiftStylePayload>) => {
      const {
        id,
        type,
        caretCharacterPosition,
        startOffset,
        endOffset,
        hasNewString = false,
      } = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);

      switch (type) {
        case 'addText': {
          state.blocksGroup[blockIndex].styles = shiftStyleWithAddText({
            caretCharacterPosition,
            styles: state.blocksGroup[blockIndex].styles,
          });
          break;
        }
        case 'deleteText': {
          state.blocksGroup[blockIndex].styles = shiftStyleWithDeleteText({
            caretCharacterPosition,
            styles: state.blocksGroup[blockIndex].styles,
          });
          break;
        }
        case 'replaceText': {
          state.blocksGroup[blockIndex].styles = shiftStyleWithReplaceText({
            startOffset,
            endOffset,
            hasNewString,
            styles: state.blocksGroup[blockIndex].styles,
          });
          break;
        }
        default:
      }
    },
    applyStyle: (state, action: PayloadAction<ApplyStylePayload>) => {
      const { id, style } = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);
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
  shiftStyle,
} = blockSlice.actions;

export default blockSlice.reducer;

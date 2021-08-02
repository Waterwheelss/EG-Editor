import {
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  Block,
  BlockState,
  BlockPayload,
} from '../types/block';
import {
  addString,
  deleteString,
  replaceString,
} from '../utils/string';

interface AddTextPayload {
  id: string,
  text: string,
}

type DeleteTextPayload = string;

interface ReplaceTextPayload {
  id: string,
  startOffset: number,
  endOffset: number,
  newString?: string,
}

const createInitialState = (name: string): BlockState => {
  const id = nanoid();
  const initialBlock = {
    id,
    name,
    text: 'initial test',
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
      const { id, text } = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);

      const selection = window.getSelection() as Selection;

      // eslint-disable-next-line max-len
      state.blocksGroup[blockIndex].text = addString(state.blocksGroup[blockIndex].text, selection.anchorOffset, text);
    },
    deleteText: (state, action: PayloadAction<DeleteTextPayload>) => {
      const id = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);

      const selection = window.getSelection() as Selection;

      // eslint-disable-next-line max-len
      state.blocksGroup[blockIndex].text = deleteString(state.blocksGroup[blockIndex].text, selection.anchorOffset);
    },
    replaceText: (state, action: PayloadAction<ReplaceTextPayload>) => {
      const {
        id, startOffset, endOffset, newString,
      } = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);

      // eslint-disable-next-line max-len
      state.blocksGroup[blockIndex].text = replaceString(state.blocksGroup[blockIndex].text, startOffset, endOffset, newString);
    },
  },
});

export const {
  addBlock,
  deleteBlock,
  addText,
  deleteText,
  replaceText,
} = blockSlice.actions;

export default blockSlice.reducer;

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
import { addString, deleteString } from '../utils/string';

type AddTextPayload = {
  id: string,
  text: string,
}

type DeleteTextPayload = {
  id: string,
}

const createInitialState = (name: string): BlockState => {
  const id = nanoid();
  const initialBlock = {
    id,
    name,
    text: 'initial text',
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
    deleteText: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);

      const selection = window.getSelection() as Selection;

      // eslint-disable-next-line max-len
      state.blocksGroup[blockIndex].text = deleteString(state.blocksGroup[blockIndex].text, selection.anchorOffset);
    },
  },
});

export const {
  addBlock,
  deleteBlock,
  addText,
  deleteText,
} = blockSlice.actions;

export default blockSlice.reducer;

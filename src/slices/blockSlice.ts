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

type ChangeTextPayload = {
  id: string,
  text: string,
}

const addString = (string: string, index: number, stringToAdd: string) => {
  return string.substring(0, index) + stringToAdd + string.substring(index, string.length);
};

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
    changeText: (state, action: PayloadAction<ChangeTextPayload>) => {
      const { id, text } = action.payload;
      const blockIndex = state.blocksGroup.findIndex((block) => block.id === id);

      const selection = window.getSelection() as any;

      console.log(selection);

      const newState = { ...state };
      // eslint-disable-next-line max-len
      newState.blocksGroup[blockIndex].text = addString(newState.blocksGroup[blockIndex].text, selection.baseOffset, text);
    },
  },
});

export const { addBlock, deleteBlock, changeText } = blockSlice.actions;

export default blockSlice.reducer;

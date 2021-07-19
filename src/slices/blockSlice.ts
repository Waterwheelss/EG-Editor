import React from 'react';
import {
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';

type Block = {
  id?: string,
  name?: string,
  ref?: any,
}

type BlockState = {
  blocksGroup: Array<Block>,
  selectedBlock: Block,
}

const initialState: BlockState = {
  blocksGroup: [],
  selectedBlock: {},
};

export const blockSlice = createSlice({
  name: 'blocks',
  initialState,
  reducers: {
    addBlock: {
      reducer: (state, action: PayloadAction<Block>) => {
        const block = { ...action.payload };
        return {
          blocksGroup: [...state.blocksGroup, block],
          selectedBlock: block,
        };
      },
      prepare: (block: Block) => {
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
        ...state,
        blocksGroup: newBlocksGroup,
      };
    },
  },
});

export const { addBlock, deleteBlock } = blockSlice.actions;

export default blockSlice.reducer;

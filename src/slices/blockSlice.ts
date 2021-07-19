import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type blockState = Array<any>

interface BlockPayload {
  block: object;
}

const initialState: blockState = [];

export const blockSlice = createSlice({
  name: 'blocks',
  initialState,
  reducers: {
    addBlock: (state, action: PayloadAction<BlockPayload>) => {
      const { block } = action.payload;
      state.push(block);
    },
  },
});

export const { addBlock } = blockSlice.actions;

export default blockSlice.reducer;

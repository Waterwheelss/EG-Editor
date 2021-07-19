import { combineReducers } from '@reduxjs/toolkit';

import blockReducer from './slices/blockSlice';

const rootReducer = combineReducers({
  blocks: blockReducer,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;

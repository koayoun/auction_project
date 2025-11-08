import { configureStore } from '@reduxjs/toolkit';
import { auctionReducer } from '../features/auctions';

export const store = configureStore({
  reducer: {
    auctions: auctionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuctionItem, FilterParams } from '../../../entities/auction';

interface AuctionState {
  items: AuctionItem[];
  selectedItem: AuctionItem | null;
  totalElements: number;
  loading: boolean;
  error: string | null;
  filters: FilterParams;
}

const initialState: AuctionState = {
  items: [],
  selectedItem: null,
  totalElements: 0,
  loading: false,
  error: null,
  filters: {},
};

const auctionSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    // 경매 목록 로딩 시작
    fetchAuctionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // 경매 목록 로딩 성공
    fetchAuctionsSuccess: (state, action: PayloadAction<{ items: AuctionItem[]; total: number }>) => {
      state.loading = false;
      state.items = action.payload.items;
      state.totalElements = action.payload.total;
    },
    // 경매 목록 로딩 실패
    fetchAuctionsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 필터 업데이트
    updateFilters: (state, action: PayloadAction<FilterParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // 필터 초기화
    resetFilters: (state) => {
      state.filters = {};
    },
    // 선택된 경매 설정
    setSelectedItem: (state, action: PayloadAction<AuctionItem | null>) => {
      state.selectedItem = action.payload;
    },
  },
});

export const {
  fetchAuctionsStart,
  fetchAuctionsSuccess,
  fetchAuctionsFailure,
  updateFilters,
  resetFilters,
  setSelectedItem,
} = auctionSlice.actions;

export default auctionSlice.reducer;


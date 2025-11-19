import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuctionItem, FilterParams } from '../../../entities/auction';
import { scrapeAuctions } from '../../../shared/api/auctionApi';

interface AuctionState {
  items: AuctionItem[];
  selectedItem: AuctionItem | null;
  totalElements: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  filters: FilterParams;
}

const initialState: AuctionState = {
  items: [],
  selectedItem: null,
  totalElements: 0,
  currentPage: 1,
  loading: false,
  error: null,
  filters: {},
};

// Async thunk for fetching auctions
export const fetchAuctions = createAsyncThunk(
  'auctions/fetchAuctions',
  async (params: { page: number; filters: FilterParams }, { rejectWithValue }) => {
    try {
      const result = await scrapeAuctions({
        page: params.page,
        court: params.filters.court,
        sido: params.filters.location?.city,
        gu: params.filters.location?.district,
      });
      return {
        items: result.items,
        total: result.total,
        page: result.page,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '경매 정보를 가져오는데 실패했습니다.'
      );
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalElements = action.payload.total;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
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


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuctionItem, FilterParams } from '../../../entities/auction';
import { scrapeAuctions } from '../../../shared/api/auctionApi';

interface AuctionState {
  items: AuctionItem[];
  allItems: AuctionItem[]; // batch로 가져온 전체 데이터
  selectedItem: AuctionItem | null;
  totalElements: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  filters: FilterParams;
}

const initialState: AuctionState = {
  items: [],
  allItems: [],
  selectedItem: null,
  totalElements: 0,
  currentPage: 1,
  loading: false,
  error: null,
  filters: {},
};

// Async thunk for fetching auctions (서버 사이드 페이지네이션)
export const fetchAuctions = createAsyncThunk(
  'auctions/fetchAuctions',
  async ({ page, filters }: { page: number; filters: FilterParams }, { rejectWithValue }) => {
    try {
      const result = await scrapeAuctions({
        page,
        court: filters.court,
        sido: filters.location?.city,
        gu: filters.location?.district,
        search_ipdate1: filters.dateRange?.start,
        search_ipdate2: filters.dateRange?.end,
      });

      console.log('🔍 API 응답:', result);
      console.log('📊 받은 데이터 개수:', result.items.length);

      return {
        items: result.items,
        total: result.total,
        page: result.page,
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('경매 데이터를 가져오는데 실패했습니다.');
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
      // fetchAuctions (서버 사이드 페이지네이션)
      .addCase(fetchAuctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        console.log('✅ Redux: fetchAuctions.fulfilled', action.payload);
        console.log('✅ Redux: total =', action.payload.total);
        console.log('✅ Redux: page =', action.payload.page);
        console.log('✅ Redux: items length =', action.payload.items.length);

        state.loading = false;
        state.items = action.payload.items;
        state.totalElements = action.payload.total;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || '경매 데이터를 가져오는데 실패했습니다.';
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


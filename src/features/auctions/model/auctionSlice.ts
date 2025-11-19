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
  async ({ page, filters }: { page: number; filters: FilterParams }, { rejectWithValue }) => {
    try {
      // FilterParams를 BigScrapeParams로 변환
      const params: Record<string, string | number> = {
        target_page: page,
      };

      // 법원 필터
      if (filters.court) {
        params.search_court_name = filters.court;
      }

      // 소재지 필터
      if (filters.location) {
        if (filters.location.city) {
          params.search_address1_01 = filters.location.city;
        }
        if (filters.location.district) {
          params.search_address1_02 = filters.location.district;
        }
        if (filters.location.town) {
          params.search_address1_03 = filters.location.town;
        }
      }

      // 날짜 범위 필터
      if (filters.dateRange) {
        if (filters.dateRange.start) {
          params.search_ipdate1 = filters.dateRange.start;
        }
        if (filters.dateRange.end) {
          params.search_ipdate2 = filters.dateRange.end;
        }
      }

      // 가격 범위 필터 (최저매각가격 기준)
      if (filters.priceRange) {
        if (filters.priceRange.min) {
          params.search_mprice1 = filters.priceRange.min.toString();
        }
        if (filters.priceRange.max) {
          params.search_mprice2 = filters.priceRange.max.toString();
        }
      }

      // 사건번호 필터
      if (filters.caseNumber) {
        const { year, number } = filters.caseNumber;
        params.search_sno = number ? `${year}${number}` : year;
      }

      const result = await scrapeAuctions(params);
      return {
        items: result.items,
        total: result.total,
        page,
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


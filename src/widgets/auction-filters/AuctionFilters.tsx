import { useState } from 'react';
import styled from 'styled-components';
import {
  COURT_LIST,
  getDepartmentsByCourt,
  CITIES,
  getDistrictsByCity,
  PRICE_OPTIONS
} from '../../shared/constants';
import type { FilterParams } from '../../entities/auction';

const FilterSection = styled.div`
  background-color: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 1rem;
  cursor: pointer;
  color: #ffffff;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const DropdownRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const DropdownColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #333333;
  border-radius: 4px;
  font-size: 14px;
  background-color: #2a2a2a;
  cursor: pointer;
  min-width: 200px;
  color: #ffffff;

  &:disabled {
    background-color: #1a1a1a;
    cursor: not-allowed;
    color: #666666;
  }

  &:focus {
    outline: none;
    border-color: #1890ff;
  }

  option {
    background-color: #2a2a2a;
    color: #ffffff;
  }
`;

const ConditionGroup = styled.div`
  margin-bottom: 1rem;
`;

const ConditionLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
`;

const ConditionRange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #333333;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
  background-color: #2a2a2a;
  color: #ffffff;

  &:focus {
    outline: none;
    border-color: #1890ff;
  }

  &::placeholder {
    color: #666666;
  }
`;

const Separator = styled.span`
  color: #999999;
`;

const SearchGroup = styled.div`
  margin-top: 1.5rem;
`;

const CaseSearchRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
`;

const CaseStaticText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const YearSelect = styled.select`
  padding: 1rem 1.5rem;
  border: 1px solid #333333;
  border-radius: 8px;
  font-size: 14px;
  background-color: #2a2a2a;
  color: #ffffff;
  box-sizing: border-box;
  min-width: 140px;

  &:focus {
    outline: none;
    border-color: #1890ff;
  }
`;

const CaseNumberInput = styled.input`
  width: 200px;
  padding: 1rem 1.5rem;
  border: 1px solid #333333;
  border-radius: 8px;
  font-size: 14px;
  background-color: #2a2a2a;
  color: #ffffff;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #1890ff;
  }

  &:disabled {
    background-color: #1a1a1a;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #666666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const ErrorMessage = styled.p`
  margin-top: 0.5rem;
  font-size: 12px;
  color: #ff4d4f;
`;

const ResetButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #ffffff;
  border: 1px solid #666666;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;

  &:hover {
    border-color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 2rem;
  background-color: #ffffff;
  color: #000000;
  border: 2px solid #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 140px;

  &:hover:not(:disabled) {
    background-color: transparent;
    color: #ffffff;
  }

  &:disabled {
    background-color: #333333;
    border-color: #333333;
    color: #666666;
    cursor: not-allowed;
  }
`;

interface AuctionFiltersProps {
  onSearch?: (filters: FilterParams) => void;
}

// 현재 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// 현재 날짜에서 한 달 뒤 날짜를 계산하는 함수
const getOneMonthLaterDate = (): string => {
  const today = new Date();
  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(today.getMonth() + 1);
  return oneMonthLater.toISOString().split('T')[0];
};

export const AuctionFilters = ({ onSearch }: AuctionFiltersProps) => {
  const [showCourtSelect, setShowCourtSelect] = useState(true);
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState(getOneMonthLaterDate());
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [caseYear, setCaseYear] = useState('2025');
  const [caseNumber, setCaseNumber] = useState('');
  const [selectionError, setSelectionError] = useState('');
  const [dateError, setDateError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [areaError, setAreaError] = useState('');

  const validateDateRange = (start: string, end: string) => {
    if (start && end && new Date(start) > new Date(end)) {
      setDateError('시작일은 종료일보다 이전이어야 합니다.');
    } else {
      setDateError('');
    }
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    validateDateRange(value, endDate);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    validateDateRange(startDate, value);
  };

  const validatePriceRange = (min: string, max: string) => {
    if (min && max && Number(min) > Number(max)) {
      setPriceError('최소 감정평가액은 최대 감정평가액보다 작거나 같아야 합니다.');
    } else {
      setPriceError('');
    }
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    validatePriceRange(value, maxPrice);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    validatePriceRange(minPrice, value);
  };

  const validateAreaRange = (min: string, max: string) => {
    if (min && max && Number(min) > Number(max)) {
      setAreaError('최소 면적은 최대 면적보다 작거나 같아야 합니다.');
    } else {
      setAreaError('');
    }
  };

  const handleMinAreaChange = (value: string) => {
    setMinArea(value);
    validateAreaRange(value, maxArea);
  };

  const handleMaxAreaChange = (value: string) => {
    setMaxArea(value);
    validateAreaRange(minArea, value);
  };

  const handleCourtCheckbox = (checked: boolean) => {
    if (!checked && !showLocationSelect) {
      setSelectionError('법원/담당계 또는 소재지 중 하나는 반드시 선택해야 합니다.');
      return;
    }

    setShowCourtSelect(checked);
    setSelectionError('');

    if (checked) {
      setShowLocationSelect(false);
      setSelectedCity('');
      setSelectedDistrict('');
    } else {
      setSelectedCourt('');
      setSelectedDepartment('');
    }
  };

  const handleCourtChange = (court: string) => {
    setSelectedCourt(court);
    setSelectedDepartment('');
  };

  const handleLocationCheckbox = (checked: boolean) => {
    if (!checked && !showCourtSelect) {
      setSelectionError('법원/담당계 또는 소재지 중 하나는 반드시 선택해야 합니다.');
      return;
    }

    setShowLocationSelect(checked);
    setSelectionError('');

    if (checked) {
      setShowCourtSelect(false);
      setSelectedCourt('');
      setSelectedDepartment('');
    } else {
      setSelectedCity('');
      setSelectedDistrict('');
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict(''); // 시/도 변경 시 구 초기화
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
  };

  const availableDepartments = selectedCourt ? getDepartmentsByCourt(selectedCourt) : [];
  const availableDistricts = selectedCity ? getDistrictsByCity(selectedCity) : [];

  const handleReset = () => {
    // 모든 필터 초기화
    setShowCourtSelect(true);
    setShowLocationSelect(false);
    setSelectedCourt('');
    setSelectedDepartment('');
    setSelectedCity('');
    setSelectedDistrict('');
    setStartDate(getTodayDate());
    setEndDate(getOneMonthLaterDate());
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
    setCaseYear('');
    setCaseNumber('');
    setSelectionError('');
    setDateError('');
    setPriceError('');
    setAreaError('');
  };

  const handleSearch = () => {
    const isCourtMode = showCourtSelect;
    const isLocationMode = showLocationSelect;
    // 법원 모드: 법원만 필수, 사건번호는 선택적 (연도만 입력 가능, 번호만 입력은 불가)
    const isCourtSearchInvalid = isCourtMode && !selectedCourt;
    const isCaseNumberInvalid = !caseYear && caseNumber; // 번호만 입력된 경우
    const isLocationSearchInvalid =
      isLocationMode && (!selectedCity || selectedCity === '');

    if (dateError || priceError || areaError || isCourtSearchInvalid || isCaseNumberInvalid || isLocationSearchInvalid) {
      return;
    }

    // 모든 필터 데이터를 FilterParams 형식으로 변환
    const filters: FilterParams = {};

    // 법원/담당계 필터
    if (showCourtSelect && selectedCourt) {
      filters.court = selectedCourt;
      if (selectedDepartment) {
        filters.department = selectedDepartment;
      }
    }

    // 소재지 필터
    if (showLocationSelect && selectedCity) {
      filters.location = {
        city: selectedCity,
      };
      if (selectedDistrict) {
        filters.location.district = selectedDistrict;
      }
    }

    // 날짜 범위 필터
    if (startDate && endDate) {
      filters.dateRange = {
        start: startDate,
        end: endDate,
      };
    }

    // 감정평가액 범위 필터
    if (minPrice || maxPrice) {
      filters.priceRange = {
        min: minPrice ? Number(minPrice) : 0,
        max: maxPrice ? Number(maxPrice) : 0,
      };
    }

    // 면적 범위 필터
    if (minArea || maxArea) {
      filters.areaRange = {
        min: minArea ? Number(minArea) : 0,
        max: maxArea ? Number(maxArea) : 0,
      };
    }

    // 사건번호 필터 (연도만 입력해도 가능)
    if (caseYear) {
      filters.caseNumber = {
        year: caseYear,
        number: caseNumber || '', // 번호가 없으면 빈 문자열
      };
    }

    if (onSearch) {
      onSearch(filters);
    }
  };

  return (
    <FilterSection>
      {/* 법원/소재지 필터 */}
      <FilterGroup>
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={showCourtSelect}
            onChange={(e) => handleCourtCheckbox(e.target.checked)}
          />
          <span>법원/담당계</span>
        </CheckboxLabel>
        {showCourtSelect && (
          <DropdownRow>
            <Select value={selectedCourt} onChange={(e) => handleCourtChange(e.target.value)}>
              <option value="">법원 선택 (필수)</option>
              {COURT_LIST.map((court) => (
                <option key={court} value={court}>
                  {court}
                </option>
              ))}
            </Select>
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              disabled={!selectedCourt}
            >
              <option value="">담당계 선택 (선택)</option>
              {availableDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>
          </DropdownRow>
        )}
      </FilterGroup>

      <FilterGroup>
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={showLocationSelect}
            onChange={(e) => handleLocationCheckbox(e.target.checked)}
          />
          <span>소재지(지번주소)</span>
        </CheckboxLabel>
        {showLocationSelect && (
          <DropdownColumn>
            <Select value={selectedCity} onChange={(e) => handleCityChange(e.target.value)}>
              <option value="">시/도 선택 (필수)</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
            <Select 
              value={selectedDistrict} 
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={!selectedCity}
            >
              <option value="">시/군/구 선택 (선택)</option>
              {availableDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </Select>
          </DropdownColumn>
        )}
      </FilterGroup>

      {selectionError && <ErrorMessage>{selectionError}</ErrorMessage>}

      {/* 검색 조건 */}
      <ConditionGroup>
        <ConditionLabel>기간 선택</ConditionLabel>
        <ConditionRange>
          <Input type="date" value={startDate} onChange={(e) => handleStartDateChange(e.target.value)} />
          <Separator>~</Separator>
          <Input type="date" value={endDate} onChange={(e) => handleEndDateChange(e.target.value)} />
        </ConditionRange>
        {dateError && <ErrorMessage>{dateError}</ErrorMessage>}
      </ConditionGroup>

      <ConditionGroup>
        <ConditionLabel>감정평가액</ConditionLabel>
        <ConditionRange>
          <Select value={minPrice} onChange={(e) => handleMinPriceChange(e.target.value)}>
            <option value="">최소 금액</option>
            {PRICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Separator>~</Separator>
          <Select value={maxPrice} onChange={(e) => handleMaxPriceChange(e.target.value)}>
            <option value="">최대 금액</option>
            {PRICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </ConditionRange>
        {priceError && <ErrorMessage>{priceError}</ErrorMessage>}
      </ConditionGroup>

      <ConditionGroup>
        <ConditionLabel>면적</ConditionLabel>
        <ConditionRange>
          <Input
            type="number"
            placeholder="최소 면적 (m²)"
            value={minArea}
            onChange={(e) => handleMinAreaChange(e.target.value)}
          />
          <Separator>~</Separator>
          <Input
            type="number"
            placeholder="최대 면적 (m²)"
            value={maxArea}
            onChange={(e) => handleMaxAreaChange(e.target.value)}
          />
        </ConditionRange>
        {areaError && <ErrorMessage>{areaError}</ErrorMessage>}
      </ConditionGroup>

      {/* 검색어 입력 */}
      <SearchGroup>
        <ConditionLabel>사건번호</ConditionLabel>
        <CaseSearchRow>
          <YearSelect
            value={caseYear}
            onChange={(e) => setCaseYear(e.target.value)}
            disabled={!showCourtSelect}
          >
            <option value="">연도 선택</option>
            {Array.from({ length: 2025 - 1995 + 1 }, (_, index) => 1995 + index)
              .reverse()
              .map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
          </YearSelect>
          <CaseStaticText>타경</CaseStaticText>
          <CaseNumberInput
            type="text"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            disabled={!showCourtSelect}
          />
        </CaseSearchRow>
      </SearchGroup>

      {/* 버튼 그룹 */}
      <ButtonGroup>
        <ResetButton onClick={handleReset}>
          조건 초기화
        </ResetButton>
        <SearchButton
          onClick={handleSearch}
          disabled={
            (!showCourtSelect && !showLocationSelect) ||
            !!dateError ||
            !!priceError ||
            !!areaError ||
            (showCourtSelect && !selectedCourt) ||
            (!caseYear && !!caseNumber) ||
            (showLocationSelect && !selectedCity)
          }
        >
          검색
        </SearchButton>
      </ButtonGroup>
    </FilterSection>
  );
};


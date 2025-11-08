import { useState } from 'react';
import styled from 'styled-components';
import { 
  COURT_LIST, 
  getDepartmentsByCourt, 
  CITIES, 
  getDistrictsByCity,
  getTownsByDistrict,
  PRICE_OPTIONS 
} from '../../shared/constants';

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
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

  &:hover {
    border-color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

interface AuctionFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export const AuctionFilters = ({ onFiltersChange }: AuctionFiltersProps) => {
  const [showCourtSelect, setShowCourtSelect] = useState(false);
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');

  const handleCourtCheckbox = (checked: boolean) => {
    setShowCourtSelect(checked);
    if (checked) {
      setShowLocationSelect(false);
      setSelectedCity('');
      setSelectedDistrict('');
      setSelectedTown('');
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
    setShowLocationSelect(checked);
    if (checked) {
      setShowCourtSelect(false);
      setSelectedCourt('');
      setSelectedDepartment('');
    } else {
      setSelectedCity('');
      setSelectedDistrict('');
      setSelectedTown('');
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict(''); // 시/도 변경 시 구 초기화
    setSelectedTown('');     // 동도 초기화
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedTown(''); // 구 변경 시 동 초기화
  };

  const availableDepartments = selectedCourt ? getDepartmentsByCourt(selectedCourt) : [];
  const availableDistricts = selectedCity ? getDistrictsByCity(selectedCity) : [];
  const availableTowns = selectedDistrict ? getTownsByDistrict(selectedDistrict) : [];

  const handleReset = () => {
    // 모든 필터 초기화
    setShowCourtSelect(false);
    setShowLocationSelect(false);
    setSelectedCourt('');
    setSelectedDepartment('');
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedTown('');
    setStartDate('');
    setEndDate('');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
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
            <Select 
              value={selectedTown} 
              onChange={(e) => setSelectedTown(e.target.value)}
              disabled={!selectedDistrict}
            >
              <option value="">읍/면/동 선택 (선택)</option>
              {availableTowns.map((town) => (
                <option key={town} value={town}>
                  {town}
                </option>
              ))}
            </Select>
          </DropdownColumn>
        )}
      </FilterGroup>

      {/* 검색 조건 */}
      <ConditionGroup>
        <ConditionLabel>기간 선택</ConditionLabel>
        <ConditionRange>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Separator>~</Separator>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </ConditionRange>
      </ConditionGroup>

      <ConditionGroup>
        <ConditionLabel>감정평가액</ConditionLabel>
        <ConditionRange>
          <Select value={minPrice} onChange={(e) => setMinPrice(e.target.value)}>
            <option value="">최소 금액</option>
            {PRICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Separator>~</Separator>
          <Select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
            <option value="">최대 금액</option>
            {PRICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </ConditionRange>
      </ConditionGroup>

      <ConditionGroup>
        <ConditionLabel>면적</ConditionLabel>
        <ConditionRange>
          <Input
            type="number"
            placeholder="최소 면적 (m²)"
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
          />
          <Separator>~</Separator>
          <Input
            type="number"
            placeholder="최대 면적 (m²)"
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value)}
          />
        </ConditionRange>
      </ConditionGroup>

      {/* 초기화 버튼 */}
      <ButtonGroup>
        <ResetButton onClick={handleReset}>
          조건 초기화
        </ResetButton>
      </ButtonGroup>
    </FilterSection>
  );
};


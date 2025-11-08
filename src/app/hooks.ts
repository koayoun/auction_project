import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// 타입이 지정된 hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();


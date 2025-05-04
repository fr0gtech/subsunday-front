/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDateRange } from '@/app/lib';
import { tz, TZDate } from '@date-fns/tz';
import { previousSunday } from 'date-fns';
import { StateCreator } from 'zustand';

type SelectedRange = {
  currentPeriod: {
    startDate: Date;
    endDate: Date;
    nextStartDate: Date;
  };
  lastPeriod: {
    startDate: Date;
    endDate: Date;
    nextStartDate: Date;
  };
  isSunday: boolean;
};

export interface GlobalSlice {
  selectedWeek: Date;
  selectedRange: SelectedRange;
  currentRange: SelectedRange;
  setSelectedWeek: (query: Date) => void;
  setSelectedRange: (query: SelectedRange) => void;
  setCurrentRange: (query: SelectedRange) => void;
}
const today = new TZDate(new Date(), 'America/New_York');
const selectedWeek = previousSunday(today, { in: tz('America/New_York') });

export const createGlobalSlice: StateCreator<GlobalSlice> = (set, get) => ({
  selectedWeek,
  selectedRange: getDateRange({ offset: selectedWeek }),
  currentRange: getDateRange(),
  setSelectedWeek: (query: Date) => {
    set({ selectedWeek: query });
  },
  setSelectedRange: (query: SelectedRange) => {
    set({ selectedRange: query });
  },
  setCurrentRange: (query: SelectedRange) => {
    set({ currentRange: query });
  },
});

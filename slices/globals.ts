/* eslint-disable @typescript-eslint/no-explicit-any */
import { tz, TZDate } from '@date-fns/tz';
import { previousSunday } from 'date-fns';
import { StateCreator } from 'zustand';

import { Vote } from '@/generated/prisma';
import { getDateRange } from '@/app/lib';

export type SelectedRange = {
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
export type VoteForFrom = Vote & { updated: boolean } & { from: { name: string; id: number } } & {
  for: { name: string; id: number };
};
export interface GlobalSlice {
  selectedWeek: Date;
  selectedRange: SelectedRange;
  currentRange: SelectedRange;
  wsMsg: VoteForFrom[];
  listLayout: string;
  setListlayout: (query: string) => void;
  replaceOrAddWsMsg: (query: VoteForFrom) => void;
  addWsMsg: (query: VoteForFrom) => void;
  setWsMsg: (query: VoteForFrom[]) => void;
  setSelectedWeek: (query: Date) => void;
  setSelectedRange: (query: SelectedRange) => void;
  setCurrentRange: (query: SelectedRange) => void;
}
const today = new TZDate(new Date(), process.env.NEXT_PUBLIC_TZ as string);
const selectedWeek = previousSunday(today, { in: tz(process.env.NEXT_PUBLIC_TZ as string) });

export const createGlobalSlice: StateCreator<GlobalSlice> = (set) => ({
  selectedWeek,
  selectedRange: getDateRange({ offset: selectedWeek }),
  currentRange: getDateRange(),
  wsMsg: [],
  listLayout: 'icon',
  setListlayout: (query: string) => {
    set({ listLayout: query });
  },
  replaceOrAddWsMsg: (query: VoteForFrom) => {
    set((state) => ({ wsMsg: [query, ...state.wsMsg.filter((e) => e.from.id !== query.from.id)] }));
  },
  addWsMsg: (query: VoteForFrom) => {
    set((state) => ({ wsMsg: [query, ...state.wsMsg] }));
  },
  setWsMsg: (query: VoteForFrom[]) => {
    set({ wsMsg: query });
  },
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

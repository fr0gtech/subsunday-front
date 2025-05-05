// store.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createGlobalSlice, GlobalSlice } from '@/slices/globals';

type StoreState = GlobalSlice;

export const useAppStore = create<StoreState>()(
  devtools(
    (...a) => ({
      ...createGlobalSlice(...a),
    }),
    { name: 'AppStore' },
  ),
);

// store.ts

import { createGlobalSlice, GlobalSlice } from '@/slices/globals';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type StoreState = GlobalSlice;

export const useAppStore = create<StoreState>()(
  devtools(
    (...a) => ({
      ...createGlobalSlice(...a),
    }),
    { name: 'AppStore' },
  ),
);

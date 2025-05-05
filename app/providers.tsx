'use client';

import type { ThemeProviderProps } from 'next-themes';

import * as React from 'react';
import { HeroUIProvider } from '@heroui/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { addToast, ToastProvider } from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TZDate } from '@date-fns/tz';
import { socket } from './lib';
import { useAppStore } from '@/store/store';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>;
  }
}
export type wsVote = {
  createdAt: Date;
  id: string;
  for: {
    id: number;
    name: string;
  };
  from: { id: number; name: string };
};

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const { addWsMsg, wsMsg } = useAppStore()

  useEffect(() => {
    function onMsgEvent(value: any) {
      const valWithCreatedAT = {
        ...value,
        id: uuidv4(),
        createdAt: new TZDate(new Date(), 'America/New_York'),
      };
      addWsMsg(valWithCreatedAT);
      toast(value)
    }
    socket.emit('join', 'main');
    socket.on('vote', onMsgEvent);

    return () => {
      socket.emit('leave', 'main');
      socket.off('vote', onMsgEvent);
    };
  }, []);
  const toast = useCallback((value: { for: { name: any; }; from: { name: any; }; }) => {
    addToast({
      color: "primary",
      title: `New Vote for ${value.for.name} from ${value.from.name}`,
    });
  }, [wsMsg])
  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider />
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  );
}

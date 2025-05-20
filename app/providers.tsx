'use client';

import type { ThemeProviderProps } from 'next-themes';

import * as React from 'react';
import { HeroUIProvider } from '@heroui/system';
import { useRouter } from 'next/navigation';
import { addToast, ToastProvider } from '@heroui/toast';
import { useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TZDate } from '@date-fns/tz';

import { socket } from './lib';

import { useAppStore } from '@/store/store';
import { VoteForFrom } from '@/slices/globals';

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
  const { addWsMsg, replaceOrAddWsMsg, wsMsg } = useAppStore();

  useEffect(() => {
    function vote(value: any, update?: boolean) {
      const now = new TZDate(new Date(), process.env.NEXT_PUBLIC_TZ as string);
      const valWithCreatedAT = {
        ...value,
        updated: true,
        id: uuidv4(),
        updatedAt: now,
        createdAt: now,
      } as VoteForFrom;

      update ? replaceOrAddWsMsg(valWithCreatedAT) : addWsMsg(valWithCreatedAT);
      toast(value, update);
    }
    socket.emit('join', 'main');
    socket.on('vote', vote);
    socket.on('voteUpdate', (value) => vote(value, true));

    return () => {
      socket.emit('leave', 'main');
      socket.off('vote', vote);
      socket.off('voteUpdate', vote);
    };
  }, []);
  const toast = useCallback(
    (value: { for: { name: any }; from: { name: any } }, update?: boolean) => {
      addToast({
        variant: 'flat',
        hideIcon: true,
        timeout: 2500,
        color: update ? 'warning' : 'primary',
        title: update ? (
          <div>
            <b>{value.from.name}</b> updated vote to <b>{value.for.name}</b>
          </div>
        ) : (
          <div>
            <b>{value.from.name}</b> voted for <b>{value.for.name}</b>
          </div>
        ),
      });
    },
    [wsMsg],
  );

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider />
        {children}
    </HeroUIProvider>
  );
}

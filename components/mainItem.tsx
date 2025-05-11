'use client';
import { Card } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Skeleton } from '@heroui/skeleton';
import clsx from 'clsx';
import { useState, useMemo, useEffect } from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import useSWRInfinite from 'swr/infinite';
import { useIntersectionObserver } from 'usehooks-ts';
import { useRouter } from 'next/navigation';
import { isBefore } from 'date-fns';
import { TZDate } from '@date-fns/tz';

import { MainCard } from './mainCard';
import { VotingPeriod } from './votingPeriod';
import { CurrentVotes } from './currentVotes';
import { LiveVotesMain } from './liveVotesMain';

import { useAppStore } from '@/store/store';
import { fetcher } from '@/app/lib';
import { Game } from '@/generated/prisma';
import { SelectedRange } from '@/slices/globals';

export type gameNcount = Game & {
  _count: { votes: number };
  price: { final: number | string; currency: string };
};
const PAGE_SIZE = 5;

const getKey = (
  pageIndex: number,
  previousPageData: { page: Game[] },
  selectedRange: SelectedRange,
) => {
  if (previousPageData && previousPageData.page.length < PAGE_SIZE) return null;
  if (pageIndex >= 10) return null;
  const start = selectedRange.currentPeriod.startDate.getTime();
  const end = selectedRange.currentPeriod.endDate.getTime();

  return `/api/games?rangeStart=${start}&rangeEnd=${end}&page=${pageIndex}&pageSize=${PAGE_SIZE}`;
};

export const MainItem = () => {
  const { selectedRange, wsMsg } = useAppStore();
  const router = useRouter();
  const { data, isLoading, setSize, size } = useSWRInfinite(
    (key, pre) => getKey(key, pre, selectedRange),
    fetcher,
    { revalidateFirstPage: false },
  );

  const { isIntersecting, ref } = useIntersectionObserver({
    initialIsIntersecting: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (isIntersecting) setSize(size + 1);
  }, [isIntersecting, data]);

  const allGames = useMemo(() => {
    return data?.reduce((acc, page) => [...acc, ...page.page], []);
  }, [data]);

  const [gameId, setGameId] = useState<number>();

  useEffect(() => {
    gameId && router.push(`/game/${gameId}`);
  }, [gameId]);

  const updateableGames = useMemo<gameNcount[]>(() => {
    if (!allGames) return;
    const wsVotes = wsMsg.reduce((acc: { [x: string]: any }, curr: { for: any }) => {
      const game = curr.for;

      acc[game.name] = (acc[game.name] || 0) + 1;

      return acc;
    }, {});

    return allGames
      .map((e: Game & { _count: { votes: number } }) => {
        return {
          ...e,
          _count: {
            votes: e._count.votes + (wsVotes[e.name] || 0),
          },
        };
      })
      .sort((a: any, b: any) =>
        Object.keys(wsVotes).length > 0 ? (a._count.votes > b._count.votes ? -1 : 1) : 0,
      );
  }, [wsMsg, data]);

  if (!allGames) {
    return (
      <div className="flex w-full justify-center items-center">
        <div className="flex w-full lg:p-10 p-3">
          <div className="grid-container">
            {isLoading &&
              [...Array(25).fill(0)].map((e, i: number) => {
                return (
                  <Card
                    key={i}
                    className="overflow-visible w-full grow min-h-[160px] cursor-pointer"
                  >
                    <div className="relative flex flex-col h-full">
                      <Skeleton
                        className={clsx([
                          'flex flex-col justify-center grow min-h-[100px] min-w-[200px]  items-center z-0 w-full object-cover scale-[1.02] shadow-lg  border-4 rounded-[1em]',
                          'dark:border-default light:border-neutral-200',
                        ])}
                        isLoaded={data && allGames.length === 0}
                      />
                    </div>
                  </Card>
                );
              })}
            {/* <div className='bg-black absolute z-[9999999] top-0 left-0'>
            <pre>
              {JSON.stringify(selectedRange, null, 2)}
            </pre>
          </div> */}
            <div className="fixed2 relative w-full h-full overflow-hidden">
              <div className="absolute w-full h-full top-0 left-0 whitespace-nowrap overflow-hidden2">
                <LiveVotesMain amount={3} bg={false} />
              </div>
            </div>
            <div className="fixed3 flex flex-col justify-evenly p-3 gap-5 ">
              <VotingPeriod className="text-xl w-full text-center" />
              <CurrentVotes className="gap-5 justify-center flex flex-row text-tiny" />

              <div className="mt-5 opacity-70 block lg:hidden">
                <div className=" text-center w-full text-xs flex flex-row justify-center mt-5 gap-2 items-center !leading">
                  *
                  <div>
                    {' '}
                    this is <b>not</b> an official sub sunday website
                  </div>{' '}
                  <Link href={'/info'}>
                    <InfoCircledIcon />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Divider className="hidden lg:visible" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex w-full lg:p-10 p-3">
        <div className="grid-container">
          <AnimatePresence initial={false}>
            {!isLoading &&
              updateableGames &&
              updateableGames.map((e, i: number) => {
                return (
                  <motion.div
                    key={e.id}
                    layout
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <MainCard
                      key={e.id}
                      className="grid-item overflow-visible h-full w-full !bg-transparent !shadow-none group"
                      e={e}
                      i={i}
                      onPress={() => setGameId(e.id)}
                    />
                  </motion.div>
                );
              })}
            {updateableGames.length != 50 && (
              <Card className="relative">
                <div ref={ref} className="absolute w-full h-[100vh]" />
              </Card>
            )}
            {updateableGames &&
              50 - updateableGames.length > 1 && [
                ...Array(1 + (50 - updateableGames.length))
                  .fill(0)
                  .map((e, i) => {
                    return <Card key={i + 'aa'} className="w-full h-[170px]" />;
                  }),
              ]}
          </AnimatePresence>
          {!isLoading && data && allGames.length === 0 && (
            <div className="flex items-center justify-center h-full w-full">
              <h4 className="text-xl font-bold">No data available</h4>
            </div>
          )}
          <div className="fixed3 flex flex-col justify-evenly p-3 gap-5 ">
            <VotingPeriod className="text-xl w-full text-center" />
            <CurrentVotes className="gap-5 justify-center flex flex-row text-tiny" />
            <div className="mt-5 opacity-70 block lg:hidden">
              <div className=" text-center w-full text-xs flex flex-row justify-center mt-5 gap-2 items-center !leading">
                *
                <div>
                  {' '}
                  this is <b>not</b> an official sub sunday website
                </div>{' '}
                <Link href={'/info'}>
                  <InfoCircledIcon />
                </Link>
              </div>
            </div>
          </div>
          {isBefore(
            new TZDate(new Date(), process.env.NEXT_PUBLIC_TZ),
            selectedRange.currentPeriod.endDate,
          ) && (
              <div className="fixed2 relative">
                <LiveVotesMain amount={3} bg={false} />
              </div>
            )}
        </div>
        <Divider className="hidden lg:visible" />
      </div>
    </div>
  );
};

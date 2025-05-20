'use client';
import { Card } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Skeleton } from '@heroui/skeleton';
import clsx from 'clsx';
import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useSWRInfinite from 'swr/infinite';
import { useIntersectionObserver } from 'usehooks-ts';
import { useRouter } from 'next/navigation';
import NumberFlow from '@number-flow/react';
import { Image } from '@heroui/image';
import { Button } from '@heroui/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { GridIcon, LayoutIcon } from '@radix-ui/react-icons';

import { MainCard } from './mainCard';
import { VotingPeriod } from './votingPeriod';
import { CurrentVotes } from './currentVotes';
import WeeklyCalendarPopover from './weeklyCalendarPopover';

import { useAppStore } from '@/store/store';
import { cleanUrl, fetcher } from '@/app/lib';
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
  const { setListlayout } = useAppStore();
  const { selectedRange, wsMsg, listLayout } = useAppStore();
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set(['icon']));
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(', ').replace(/_/g, ''),
    [selectedKeys],
  );

  useEffect(() => {
    setListlayout(selectedValue);
  }, [selectedValue]);
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

  if (isLoading || !updateableGames) {
    return (
      <div className="w-full justify-center items-center mt-5 ">
        <div className="fixed3 flex flex-col justify-evenly p-3 gap-5 lg:hidden">
          <VotingPeriod className="text-xl w-full text-center" />
          <CurrentVotes className="gap-5 justify-center flex flex-row text-tiny" />
        </div>
        <div className="flex w-full pt px-5">
          <div className="grid-container">
            {
              [...Array(50).fill(0)].map((e, i: number) => {
                return (
                  <Card
                    key={i}
                    className="overflow-visible w-full grow min-h-[177px] cursor-pointer"
                  >
                    <div className="relative flex flex-col h-full">
                      <Skeleton
                        className={clsx([
                          'flex flex-col justify-center grow min-w-[200px]  items-center z-0 w-full object-cover scale-[1.02] shadow-lg  border-4 rounded-[1em]',
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
          </div>
          <Divider className="hidden lg:visible" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full justify-center items-center pt-5">
      <div className="fixed3 flex flex-col justify-evenly p-3 gap-5 lg:hidden mb-10">
        <VotingPeriod className="text-xl w-full text-center" />
        <CurrentVotes className="gap-5 justify-center flex flex-row text-tiny" />
        <div className="flex gap-2 justify-center">
          <WeeklyCalendarPopover />
          <Dropdown>
            <DropdownTrigger>
              <div className='p-2 bg-content1 rounded-lg' >{selectedValue === 'icon' ? <GridIcon /> : <LayoutIcon />}</div>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={selectedKeys}
              selectionMode="single"
              variant="flat"
              onSelectionChange={setSelectedKeys}
            >
              <DropdownItem key={'icon'}>
                <span>
                  <GridIcon className="inline mr-2" />
                  Icon View
                </span>
              </DropdownItem>
              <DropdownItem key={'list'}>
                <span>
                  <LayoutIcon className="inline mr-2" />
                  List View
                </span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      {listLayout === 'list' && (
        <div className=" overflow-y-auto overflow-x-hidden p-4">
          <ul
            className="
         list-none m-0 p-0
         columns-1
         sm:columns-2
         md:columns-3
         lg:columns-4
         xl:columns-5
         [column-gap:1.5rem]
       "
          >
            {updateableGames.map((e, i) => (
              <Card
                key={i}
                isPressable
                className="w-full mb-2 break-inside-avoid text-ellipsis overflow-hidden whitespace-nowrap"
                onPress={() => setGameId(e.id)}
              >
                <div className="flex">
                  {e.picture !== 'default' ? (
                    <div className="relative !w-[95px]">
                      <Image
                        alt="Album cover"
                        className=" object-cover rounded-r-none !w-[95px]"
                        height={50}
                        shadow="md"
                        src={cleanUrl(e.picture)}
                        width="100%"
                      />
                    </div>
                  ) : (
                    <div className="h-[50px] w-[108px] bg-content2" />
                  )}
                  <div className="flex flex-col p-1 pl-4 items-start">
                    <div className="flex items-center w-full h-full">
                      <div className=" opacity-50 font-mono ">#</div>
                      <div className=" press-start-2p-regular px-1">
                        <NumberFlow isolate value={i + 1} />
                      </div>
                      <div className=" w-full grow text-base ! whitespace-nowrap overflow-hidden">
                        {e.name.slice(0, 19)}
                      </div>
                    </div>
                    <div className="text-xs opacity-50">votes: {e._count.votes}</div>
                  </div>
                </div>
              </Card>
            ))}
          </ul>
        </div>
      )}
      <div className="flex w-full pt px-5">
        {listLayout === 'icon' && (
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
          </div>
        )}
        <Divider className="hidden lg:visible" />
      </div>
    </div>
  );
};

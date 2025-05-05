import { Card, Divider, Modal, ModalContent, Skeleton, useDisclosure } from '@heroui/react';
import clsx from 'clsx';
import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

import { LiveVotes } from './liveVotes';
import { MainCard } from './mainCard';
import { VotingPeriod } from './votingPeriod';
import { CurrentVotes } from './currentVotes';
import { GameComp } from './gameComp';
import WeeklyCalendar from './weeklyCalendar';

import { useAppStore } from '@/store/store';
import { fetcher } from '@/app/lib';
import { Game } from '@/generated/prisma';

export type gameNcount = Game & {
  _count: { votes: number };
  price: { final: number | string; currency: string };
};

export const MainItem = () => {
  const { selectedRange, wsMsg } = useAppStore();
  const { data, isLoading } = useSWR(
    selectedRange &&
      `/api/games?rangeStart=${selectedRange.currentPeriod.startDate.getTime()}&rangeEnd=${selectedRange.currentPeriod.endDate.getTime()}`,
    fetcher,
  );

  const [gameId, setGameId] = useState<number | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const updateableGames = useMemo<gameNcount[]>(() => {
    if (!data || !data.games) return;
    const wsVotes = wsMsg.reduce((acc: { [x: string]: any }, curr: { for: any }) => {
      const game = curr.for;

      acc[game.name] = (acc[game.name] || 0) + 1;

      return acc;
    }, {});

    return data.games
      .map((e: Game & { _count: { votes: number } }) => {
        return {
          ...e,
          _count: {
            votes: e._count.votes + (wsVotes[e.name] || 0),
          },
        };
      })
      .sort((a: any, b: any) => (a._count.votes > b._count.votes ? -1 : 1));
  }, [wsMsg, data]);

  if (!data || !data.games) {
    return (
      <div className="flex w-full justify-center items-center">
        <div className="flex w-full p-4">
          <div className="grid-container">
            {isLoading &&
              [...Array(25).fill(0)].map((e, i: number) => {
                return (
                  <Card
                    key={i}
                    className="overflow-visible w-full grow min-h-[200px] cursor-pointer"
                  >
                    <div className="relative flex flex-col h-full">
                      <Skeleton
                        className={clsx([
                          'flex flex-col justify-center grow min-h-[100px] min-w-[200px]  items-center z-0 w-full object-cover scale-[1.02] shadow-lg  border-4 rounded-[1em]',
                          'dark:border-default light:border-neutral-200',
                        ])}
                        isLoaded={data && data.games.length === 0}
                      />
                      <div className="flex p-1">
                        <div className="flex flex-grow gap-2">
                          <div className="flex gap-2 p-2 max-w-[300px]">
                            <Skeleton
                              className="font-bold text-left whitespace-pre-wrap rounded-lg !w-20 !h-6"
                              isLoaded={data && data.games.length === 0}
                            />
                          </div>
                        </div>
                      </div>
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
                <LiveVotes amount={3} bg={false} />
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
      <div className="flex w-full p-4">
        <Modal className="max-h-2/3" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent className="p-2">
            {() => <>{gameId && <GameComp cardBodyClass="py-1 px-0" id={gameId.toString()} />}</>}
          </ModalContent>
        </Modal>

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
                      className="grid-item overflow-visible h-[200px]"
                      e={e}
                      i={i}
                      onPress={() => {
                        onOpen();
                        setGameId(e.id);
                      }}
                    />
                  </motion.div>
                );
              })}
            {updateableGames && [
              ...Array(50 - updateableGames.length)
                .fill(0)
                .map((e, i) => {
                  return <Card key={i + 'aa'} className="w-full h-[170px]" />;
                }),
            ]}
          </AnimatePresence>
          {!isLoading && data && data.games.length === 0 && (
            <div className="flex items-center justify-center h-full w-full">
              <h4 className="text-xl font-bold">No data available</h4>
            </div>
          )}
          <div className="fixed3 flex flex-col justify-evenly p-3 gap-5 ">
            <VotingPeriod className="text-xl w-full text-center" />
            <CurrentVotes className="gap-5 justify-center flex flex-row text-tiny" />
            <div className="flex lg:hidden justify-center">
              <WeeklyCalendar />
            </div>

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
          <div className="fixed2 relative w-full h-full overflow-hidden">
            <div />
            <div className="absolute w-full h-full top-0 left-0 whitespace-nowrap overflow-hidden2">
              <LiveVotes amount={3} bg={false} />
            </div>
          </div>
        </div>
        <Divider className="hidden lg:visible" />
      </div>
    </div>
  );
};

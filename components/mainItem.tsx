import { Game } from '@/generated/prisma';
import {
  addToast,
  Button,
  Card,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  useDisclosure,
} from '@heroui/react';
import clsx from 'clsx';
import { socket, fetcher } from '@/app/lib';
import { useState, useEffect, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import { wsMsg } from '@/types';
import { LiveVotes } from './liveVotes';
import { MainCard } from './mainCard';
import { VotingPeriod } from './votingPeriod';
import { CurrentVotes } from './currentVotes';
import { Chart } from './chart';
import { GameComp } from './gameComp';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
export type gameNcount = Game & {
  _count: { votes: number };
  price: { final: number | string; currency: string };
};
export const MainItem = () => {
  const [cnt, setCnt] = useState(1);
  const { data, isLoading } = useSWR(`/api/games?page=${cnt}`, fetcher);

  const [msgEvents, setMsgEvents] = useState<wsMsg[]>([]);
  const [gameId, setGameId] = useState<number | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const onMsgEvent = (value: wsMsg) => {
      setMsgEvents((previous: wsMsg[]) => [...previous, value]);
      toast(value);
    };

    socket.emit('join', 'main');
    socket.on('vote', onMsgEvent);

    return () => {
      socket.emit('leave', 'main');
      socket.off('vote', onMsgEvent);
    };
  }, []);

  const toast = useCallback(
    (value: { for: { name: any }; from: { name: any } }) => {
      addToast({
        timeout: 2300,
        color: 'primary',
        title: `New Vote for ${value.for.name} from ${value.from.name}`,
      });
    },
    [msgEvents],
  );

  const updateableGames = useMemo<gameNcount[]>(() => {
    if (!data) return;
    const wsVotes = msgEvents.reduce((acc: { [x: string]: any }, curr: { for: any }) => {
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
  }, [msgEvents, data]);

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex w-full p-4">
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-h-2/3">
          <ModalContent className="p-2">
            {() => <>{gameId && <GameComp cardBodyClass="py-1 px-0" id={gameId.toString()} />}</>}
          </ModalContent>
        </Modal>
        <div className="grid-container">
          {!isLoading &&
            updateableGames &&
            updateableGames.map((e, i: number) => {
              return (
                <MainCard
                  className="grid-item overflow-visible"
                  key={e.id}
                  onPress={() => {
                    onOpen();
                    setGameId(e.id);
                  }}
                  e={e}
                  i={i}
                />
              );
            })}
          {isLoading &&
            [...Array(50).fill(0)].map((e, i: number) => {
              return (
                <Card
                  key={i}
                  className="overflow-visible w-full min-w-[332px] grow min-h-[198px] cursor-pointer"
                >
                  <div className="relative flex flex-col h-full">
                    <Skeleton
                      className={clsx([
                        'flex flex-col justify-center grow min-h-[100px] min-w-[294px]  items-center z-0 w-full object-cover scale-[1.02] shadow-lg  border-4 rounded-[1em]',
                        'dark:border-default light:border-neutral-200',
                      ])}
                    />
                    <div className="flex p-1">
                      <div className="flex flex-grow gap-2">
                        <div className="flex gap-2 p-2 max-w-[300px]">
                          <Skeleton className="font-bold text-left whitespace-pre-wrap rounded-lg">
                            testdasdadsada
                          </Skeleton>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          <div className="fixed2 relative w-full h-full overflow-hidden">
            <div className="absolute w-full h-full top-0 left-0 whitespace-nowrap overflow-hidden2">
              <LiveVotes amount={3} bg={false} />
            </div>
          </div>
          <div className="fixed3 flex item-center flex-col justify-evenly p-5">
            <VotingPeriod className="text-xl text-center py-4 " />
            <CurrentVotes className=" gap-5 justify-center flex flex-row text-tiny" />
            <div className="mt-5 opacity-70 block lg:hidden">
              <div className=" text-center w-full text-xs flex flex-row justify-center mt-5 gap-2 items-center !leading">
                *
                <div>
                  {' '}
                  this is <b>not</b> an official sub sunday website
                </div>{' '}
                <Link href={'info'}>
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
};

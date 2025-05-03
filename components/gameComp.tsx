'use client';
import { fetcher, socket } from '@/app/lib';
import { Game, User, Vote } from '@/generated/prisma';
import { addToast, Card, CardBody, CardHeader, Chip, Divider, Image, Link, Spinner } from '@heroui/react';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import useSWR from 'swr';
import { Voted } from './voted';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { wsMsg } from '@/types';
import { TZDate } from '@date-fns/tz';

export const GameComp = ({ id, withImage = false }: { id: string, withImage?: boolean }) => {
  const { data, isLoading } = useSWR(`/api/game?id=${id}`, fetcher);
  const [msgEvents, setMsgEvents] = useState<wsMsg[]>([]);

  useEffect(() => {
    function onMsgEvent(value: wsMsg) {
      setMsgEvents((previous: wsMsg[]) => [...previous, value]);
      toast(value)
    }
    socket.emit('join', 'game-' + id);
    socket.on('vote', onMsgEvent);

    return () => {
      socket.emit('leave', 'game-' + id);
      socket.off('vote', onMsgEvent);
    };
  }, []);

  const toast = useCallback((value: { for: { name: any; }; from: { name: any; }; }) => {
    addToast({
      color: "primary",
      title: `New Vote for ${value.for.name} from ${value.from.name}`,
    });
  }, [msgEvents])
  const liveVotes = useMemo(() => {
    if (!data) return;
    const wsVotes2Votes = msgEvents.map(
      (e: { for: { id: number; name: string }; from: { id: number; name: string } }) => {
        return {
          createdAt: new TZDate(new Date(), 'America/New_York'),
          for: {
            name: e.for.name,
            id: e.for.id,
          },
          from: {
            name: e.from.name,
            id: e.from.id,
          },
        };
      },
    );

    return [...wsVotes2Votes, ...data.game.votes];
  }, [msgEvents, data]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="p-3 max-w-2xl flex flex-col gap-5 max-h-[calc(100vh-100px)] overflow-scroll">
      <h4 className="text-3xl font-bold">
        {data.game.name}{' '}
        {data.game.dev[0].length > 0 && <span className="text-tiny">by {data.game.dev}</span>}
      </h4>
      {data.game.picture !== 'default' && (
        <>
            {withImage &&
              <Image
                alt={'item.title'}
                className="mx-auto object-cover"
                radius="lg"
                shadow="sm"
                removeWrapper
                src={data.game.picture}
              />
            }
            <div className="flex gap-3 flex-wrap">
              {data.game.categories &&
                Object.values(data.game.categories).map((e: any, i) => {
                  if (i > 2) return;
                  return (
                    <Chip variant="shadow" key={e.id} size="sm">
                      {e.description}
                    </Chip>
                  );
                })}
              {data.game.price.final && (
                <Chip
                  size="sm"
                  variant="shadow"
                  color='primary'
                >
                  {typeof data.game.price.final === 'string'
                    ? data.game.price.final
                    : `${data.game.price.final / 100} ${data.game.price.currency}`}
                </Chip>
              )}
              <div className="flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
                {data.game.website.length > 0 && (
                  <Link
                    size="sm"
                    color="foreground"
                    className=""
                    href={data.game.website}
                    target="_blank"
                  >
                    Website
                    <ExternalLinkIcon color="gray" />
                  </Link>
                )}
                {data.game.link !== 'notOnSteam' && (
                  <Link
                    size="sm"
                    color="foreground"
                    className=""
                    href={`https://store.steampowered.com/app/${data.game.steamId}`}
                    target="_blank"
                  >
                    Open on steam <ExternalLinkIcon color="gray" />
                  </Link>
                )}
              </div>
            </div>
          <div className="flex-col gap-3">
            <p className=" whitespace-pre-wrap opacity-80 ">{data.game.description}</p>
          </div>
          <Divider />
        </>
      )}
      <div className="gap-2 ">
        <div className="flex gap-5 justify-between">
          <div className="flex gap-5">
            <div className="text-tiny text-default-500">
              votes this sub sunday:{' '}
              <Chip size="sm" color="secondary" variant="shadow">
                {data.votesSubSunday._count.votes}
              </Chip>
            </div>
            <div className="text-tiny text-default-500">
              total:{' '}
              <Chip size="sm" variant="shadow">
                {data.game._count.votes}
              </Chip>
            </div>
          </div>

        </div>
      </div>
      <div className="gap-2 flex flex-col mt-2">
        {liveVotes &&
          liveVotes.map((e: Vote & { from: User } & { for: Game }, i: number) => {
            return <Voted onGame bg={false} key={i} vote={e} />;
          })}
      </div>
    </div>
  );
};

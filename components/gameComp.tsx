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

export const GameComp = ({ id }: { id: string }) => {
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
          createdAt: new Date(),
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
    <div className="mx-auto gap-5 p-5">
      <h4 className="text-3xl font-bold p-2 mb-2">
        {data.game.name}{' '}
        {data.game.dev.length > 0 && <span className="text-tiny">by {data.game.dev}</span>}
      </h4>
      <Card className=" overflow-visible">
        {data.game.picture !== 'default' && (
          <>
            <CardBody className="overflow-visible p-0 relative ">
              <Image
                alt={'item.title'}
                className="w-full object-cover lg:scale-[1.05] border-4 border-default"
                radius="lg"
                shadow="sm"
                removeWrapper
                src={data.game.picture}
                width="100%"
              />
              <div className="absolute z-10 lg:-left-2 lg:bottom-1 bottom-3 left-2">
                {data.game.categories &&
                  Object.values(data.game.categories).map((e: any, i) => {
                    if (i > 2) return;
                    return (
                      <Chip variant="shadow" key={e.id} size="sm">
                        {e.description}
                      </Chip>
                    );
                  })}
              </div>
              {data.game.price.final && (
                <Chip
                  variant="shadow"
                  className="absolute z-10 lg:-left-2"
                >
                  {data.game.price === 'free'
                    ? 'FREE'
                    : `${data.game.price.final / 100} ${data.game.price.currency}`}
                </Chip>
              )}
            </CardBody>
            <CardHeader className="flex-col gap-3">
              <p className=" whitespace-pre-wrap p-3 opacity-80">{data.game.description}</p>
            </CardHeader>
            <Divider />
          </>
        )}
        <CardBody className="gap-2 ">
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
                  {data.game.votes.length}
                </Chip>
              </div>
            </div>
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
        </CardBody>
      </Card>
      <div className="gap-2 flex flex-col mt-2">
        {liveVotes &&
          liveVotes.map((e: Vote & { from: User } & { for: Game }, i: number) => {
            return <Voted key={i} vote={e} />;
          })}
      </div>
    </div>
  );
};

'use client';
import { fetcher } from '@/app/lib';
import {
  Chip,
  Divider,
  Link,
  Spinner,
} from '@heroui/react';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import useSWR from 'swr';
import { Voted } from './voted';
import { useMemo } from 'react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { useAppStore } from '@/store/store';
import { VoteForFrom } from '@/slices/globals';
export const GameComp = ({
  id,
  page = false,
  withImage = false,
  cardBodyClass = '',
}: {
  id: string;
  withImage?: boolean;
  cardBodyClass?: string;
  page?: boolean;
}) => {
  const { currentRange, wsMsg } = useAppStore()
  const { data, isLoading } = useSWR(`/api/game?id=${id}&rangeStart=${currentRange.currentPeriod.startDate.getTime()}&rangeEnd=${currentRange.currentPeriod.endDate.getTime()}`, fetcher);


  const liveVotes = useMemo(() => {
    if (!data) return;
    const wsVotes2Votes = wsMsg.map((e) => {
      return {
        updated: e.updated,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        for: {
          name: e.for.name,
          id: e.for.id,
        },
        from: {
          name: e.from.name,
          id: e.from.id,
        },
        id: uuidv4(),
      };
    });

    return [...wsVotes2Votes, ...data.game.votes]
      .filter((e) => e)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [wsMsg, data]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div
      className={clsx([
        !page && 'max-h-[calc(100vh-200px)] overflow-scroll',
        'p-3 flex flex-col gap-5',
      ])}
    >
      <h4 className="text-3xl font-bold">
        {data.game.name}{' '}
        {data.game.dev[0].length > 0 && <span className="text-tiny">by {data.game.dev}</span>}
      </h4>

      {data.game.picture !== 'default' && (
        <>
          {withImage && (
            <div className=' relative h-[200px] lg:w-1/2 w-full lg:mx-auto rouned'>
              <Image
                alt={'item.title'}
                fill
                className=' object-cover rounded-md'
                src={data.game.picture}
              />
            </div>
          )}
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
              <Chip size="sm" variant="shadow" color="primary">
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

      <div className="gap-2 flex flex-col">
        {liveVotes &&
          liveVotes.slice(0, 6).map((e: VoteForFrom, i) => {
            return <Voted cardBodyClass={cardBodyClass} onGame bg={page} key={i} vote={e} />;
          })}
      </div>
      <Divider />
      <div className="mx-2 ">
        <div className="flex gap-5 mx-auto">
          <div className="text-tiny text-default-500 flex items-center flex-row-reverse gap-2">
            <span>votes this week</span>
            <Chip color="secondary" variant="shadow">
              {data.votesSubSunday._count.votes}
            </Chip>
          </div>
          <div className="text-tiny text-default-500 flex items-center flex-row-reverse gap-2">
            <span>total votes</span>
            <Chip variant="shadow">{data.game._count.votes}</Chip>
          </div>
        </div>
      </div>
    </div>
  );
};

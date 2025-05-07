'use client';
import { Chip } from '@heroui/chip';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Link } from '@heroui/link';
import { Spinner } from '@heroui/spinner';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import useSWR from 'swr';
import { useMemo } from 'react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

import { Voted } from './voted';
import { Chart } from './chart';
import { Steamicon } from './icons';

import { cleanUrl, fetcher } from '@/app/lib';
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
  const { currentRange, wsMsg } = useAppStore();
  const { data, isLoading } = useSWR(
    `/api/game?id=${id}&rangeStart=${currentRange.currentPeriod.startDate.getTime()}&rangeEnd=${currentRange.currentPeriod.endDate.getTime()}`,
    fetcher,
  );

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
        !page && ' overflow-scroll lg:overflow-auto space-y-1 max-h-[80vh]',
        page && 'p-3 flex gap-5 justify-center w-full max-w-screen-xl flex-col lg:flex-row',
      ])}
    >
      <div className="lg:w-1/2 space-y-5">
        <Card className={clsx([page && 'lg:w-full', 'p-2 gap-3'])}>
          <CardHeader>
            <div
              className={clsx(
                ['flex '],
                !page && ['flex-col items-start'],
                page && ['items-center gap-5 flex-wrap'],
              )}
            >
              <Link color="foreground" href={`/game/${data.game.id}`}>
                <h4 className="text-3xl font-bold">{data.game.name} </h4>
              </Link>
              <div>
                {data.game.dev[0].length > 0 && (
                  <span className="text-tiny">by {data.game.dev}</span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-5">
            {data.game.picture !== 'default' && (
              <>
                {withImage && (
                  <div className=" relative h-[200px] w-full lg:mx-auto rouned">
                    <Image
                      fill
                      alt={'item.title'}
                      className=" object-cover rounded-md"
                      loading="lazy"
                      src={cleanUrl(data.game.picture)}
                    />
                  </div>
                )}
                <div className="flex gap-3 flex-wrap">
                  {data.game.categories &&
                    Object.values(data.game.categories).map((e: any, i) => {
                      if (i > 2) return;

                      return (
                        <Chip key={e.id} size="sm" variant="shadow">
                          {e.description}
                        </Chip>
                      );
                    })}
                  {data.game.price.final && (
                    <Chip color="primary" size="sm" variant="shadow">
                      {typeof data.game.price.final === 'string'
                        ? data.game.price.final
                        : `${data.game.price.final / 100} ${data.game.price.currency}`}
                    </Chip>
                  )}
                  <div className="flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    {data.game.website.length > 0 && (
                      <Link
                        className=""
                        color="foreground"
                        href={data.game.website}
                        size="sm"
                        target="_blank"
                      >
                        Website
                        <ExternalLinkIcon color="gray" />
                      </Link>
                    )}
                    {data.game.link !== 'notOnSteam' && (
                      <Link
                        className=""
                        color="foreground"
                        href={`https://store.steampowered.com/app/${data.game.steamId}`}
                        size="sm"
                        target="_blank"
                      >
                        <Steamicon />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex-col gap-3">
                  <p className=" whitespace-pre-wrap opacity-80 ">{data.game.description}</p>
                </div>
              </>
            )}
          </CardBody>
        </Card>
        <Card className="p-5">
          <div className="flex gap-5 mb-5 p-3">
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
          <Chart id={data.game.id} />
        </Card>
      </div>
      <Card className={clsx([page && 'lg:w-2/6 ', ' p-2 '])}>
        <CardHeader>
          <h4 className=" text-2xl">Votes</h4>
        </CardHeader>
        <CardBody>
          <div className="gap-2 flex flex-col ">
            {liveVotes &&
              (!page ? liveVotes.slice(0, 3) : liveVotes).map((e: VoteForFrom, i) => {
                return <Voted key={i} bg={page} cardBodyClass={cardBodyClass} vote={e} onGame />;
              })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

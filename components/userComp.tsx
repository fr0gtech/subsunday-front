'use client';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import { Spinner } from '@heroui/spinner';
import useSWR from 'swr';
import { useMemo } from 'react';
import clsx from 'clsx';

import { Voted } from './voted';
import StreakDisplay from './streakDisplay';

import { useAppStore } from '@/store/store';
import { fetcher } from '@/app/lib';
import { VoteForFrom } from '@/slices/globals';

export const UserComp = ({ id }: { id: string }) => {
  const { wsMsg } = useAppStore();
  const { data, isLoading } = useSWR(`/api/user?id=${id}`, fetcher);

  const liveVotes = useMemo(() => {
    if (!data) return;
    const wsVotes2Votes = wsMsg.map((e) => {
      if (e.from.id !== parseInt(id)) return null
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
        id: e.id,
      };
    }).filter((e)=>e)

    return [...wsVotes2Votes, ...data.user.votes];
  }, [wsMsg, data]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap justify-center gap-5 p-5">
      <Card>
        <CardHeader
          className={clsx([
            'flex justify-center items-start p-5 flex-row-reverse gap-10 h-[100px]',
            data.user.streak > 0 && ' flex-row p-3',
          ])}
        >
          <div
            className={clsx([
              'uppercase relative w-16 h-10 p-0 m-0 flex  justify-center items-center',
            ])}
          >
            <StreakDisplay
              className="absolute z-10 w-[180px] h-[180px] -top-[2rem] -left-[1rem]"
              streak={data.user.streak}
            />
            {data.user.streak > 0 && (
              <Chip
                color="secondary"
                className="!text-tiny -top-3 absolute -left-3 rankingChiptl"
                size="sm"
              >
                Streak: {data.user.streak}
              </Chip>
            )}
          </div>
          <div className="flex flex-col justify-center items-start w-full h-full gap-2">
            <p className="text-md">{data.user.name}</p>
            <Chip className="boldChip" color="secondary" size="sm" variant="shadow">
              votes: {data.user.votes.length}
            </Chip>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          {liveVotes &&
            liveVotes.map((e: VoteForFrom, i: number) => {
              return <Voted key={i} bg={false} vote={e} />;
            })}
        </CardBody>
      </Card>
    </div>
  );
};

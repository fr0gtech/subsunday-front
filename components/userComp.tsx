'use client';
import { fetcher } from '@/app/lib';
import { Game, User, Vote } from '@/generated/prisma';
import { Card, CardBody, CardHeader, Divider, Spinner } from '@heroui/react';
import useSWR from 'swr';
import { Voted } from './voted';
import { useMemo } from 'react';
import { TZDate } from '@date-fns/tz';
import { useAppStore } from '@/store/store';
import StreakDisplay from './streakDisplay';

export const UserComp = ({ id }: { id: string }) => {
  const { wsMsg } = useAppStore()
  const { data, isLoading } = useSWR(`/api/user?id=${id}`, fetcher);

  const liveVotes = useMemo(() => {
    if (!data) return;
    const wsVotes2Votes = wsMsg.map(
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
    <div className="w-full flex flex-wrap justify-center gap-5 p-5 text-center">
      <Card>
        <CardHeader className="flex gap-3">
          <div className="uppercase relative w-10 h-10 p-0 m-0 flex justify-center items-center">
            {/* <div>{data && data.user.name.charAt(0)}</div> */}
            <StreakDisplay className="absolute w-[180px] h-[180px] -top-[3rem] -left-[2rem]" streak={50} />
          </div>
          <div className="flex flex-col">
            <p className="text-md">{data.user.name}</p>
            <p className="text-small text-left text-default-500"> {data.user.streak && `Current Streak: ${data.user.streak}`} {`votes: ${data.user.votes.length}`}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          {liveVotes &&
            liveVotes.map((e: Vote & { from: User } & { for: Game }, i: number) => {
              return <Voted key={i} vote={e} bg={false} />;
            })}
        </CardBody>
      </Card>
    </div>
  );
};

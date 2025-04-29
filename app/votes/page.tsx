'use client';
import useSWR from 'swr';
import { Vote } from '@/generated/prisma';
import { fetcher, socket } from '../lib';
import { Voted } from '@/components/voted';
import { useState, useEffect, useMemo } from 'react';
import { randomUUID } from 'crypto';

export default function Home() {
  const { data } = useSWR(`/api/votes`, fetcher);
  const [msgEvents, setMsgEvents] = useState<any>([]);

  useEffect(() => {
    function onMsgEvent(value: any) {
      setMsgEvents((previous: any) => [...previous, value] as any);
    }
    socket.emit('join', 'main');
    socket.on('vote', onMsgEvent);

    return () => {
      socket.emit('leave', 'main');
      socket.off('vote', onMsgEvent);
    };
  }, []);

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
          id: randomUUID(),
        };
      },
    );

    return [...wsVotes2Votes, ...data.votes];
  }, [msgEvents, data]);

  return (
    <section className="h-full  max-w-xl mx-auto  w-full gap-4 p-5">
      <h4 className="py-3 px-2 text-large lowercase">Last 10 votes</h4>
      <div className="flex-col flex flex-wrap justify-center gap-2 p-3 text-center">
        {liveVotes &&
          liveVotes.map(
            (
              e: Vote & { from: { name: string; id: number } } & {
                for: { id: number; name: string };
              },
              i: number,
            ) => {
              return <Voted key={e.id} vote={e} />;
            },
          )}
      </div>
    </section>
  );
}

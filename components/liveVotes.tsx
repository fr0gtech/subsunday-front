import { fetcher, socket } from '@/app/lib';
import { Vote } from '@/generated/prisma';
import { useEffect, useMemo, useState } from 'react';
import { Voted } from './voted';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';
import { TZDate } from '@date-fns/tz';
import { Skeleton } from '@heroui/react';
export type wsVote = {
  createdAt: Date;
  id: string;
  for: {
    id: number;
    name: string;
  };
  from: { id: number; name: string };
};
export type VoteForFrom = Vote & { from: { name: string; id: number } } & {
  for: { name: string; id: number };
};
export const LiveVotes = ({
  amount,
  bg = true,
  textRight = false,
}: {
  amount: number;
  bg?: boolean;
  textRight?: boolean;
}) => {
  const [msgEvents, setMsgEvents] = useState<wsVote[]>([]);
  const { data, isLoading } = useSWR(`/api/votes?amount=${amount}`, fetcher);

  useEffect(() => {
    function onMsgEvent(value: any) {
      const valWithCreatedAT = {
        ...value,
        createdAt: new TZDate(new Date(), 'America/New_York'),
      };
      setMsgEvents((previous: any) => [...previous, valWithCreatedAT] as any);
    }
    socket.emit('join', 'main');
    socket.on('vote', onMsgEvent);

    return () => {
      socket.emit('leave', 'main');
      socket.off('vote', onMsgEvent);
    };
  }, []);
  useEffect(()=>{
    setMsgEvents([]) // reset realtime on mutate cuz we now got new data 
  },[data])
  const liveVotes: (VoteForFrom | wsVote)[] | undefined = useMemo(() => {
    if (!data) return;
    const wsVotes2Votes: wsVote[] = msgEvents.map((e: wsVote) => {
      return {
        createdAt: e.createdAt,
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
    return [...wsVotes2Votes, ...(data.votes as VoteForFrom[])]
      .filter((e) => e)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }) as (VoteForFrom | wsVote)[];
  }, [msgEvents, data]);
  if (isLoading){
   return (<div className=' flex flex-col justify-evenly grow h-full px-3'>
       {[...Array(3).fill(0)].map((e,i)=><Skeleton key={i} className='w-full h-[30px] rounded-full'/>)}
    </div>)
  }
  return (
    <div className="space-y-2 grow ">
      {liveVotes &&
        liveVotes.slice(0, amount).map((e) => {
          return <Voted key={e.id} vote={e} bg={bg} textRight={textRight} />;
        })}
    </div>
  );
};

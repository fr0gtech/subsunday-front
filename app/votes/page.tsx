'use client';
import useSWR from 'swr';
import { Vote } from '@/generated/prisma';
import { fetcher, socket } from '../lib';
import { Voted } from '@/components/voted';
import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, subDays } from 'date-fns';
import { Card } from '@heroui/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const dayNames: string[] = [];

for (let i = 6; i >= 0; i--) {
  const date = subDays(new Date(), i);
  const dayName = format(date, 'EEEE');
  dayNames.push(dayName);
}


export default function Home() {
  const { data } = useSWR(`/api/votes`, fetcher);
  const [msgEvents, setMsgEvents] = useState<any>([]);

  const dataChart = useMemo(() => {
    if (!data) return null
    return {
      labels: dayNames,
      datasets: [
        {
          label: 'Votes This Week',
          data: data.graph || [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: "Votes Last Week",
          data: data.graphPastWeek || [],
          borderColor: 'rgb(55, 99, 132)',
          backgroundColor: 'rgba(55, 99, 132, 0.5)',
        }

      ],
    };
  }, [data])

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
          id: uuidv4(),
        };
      },
    );

    return [...wsVotes2Votes, ...data.votes];
  }, [msgEvents, data]);

  return (
    <section className="h-full max-w-4xl mx-auto  w-full gap-4 ">
      <Card className='p-5 mb-2'>
        {dataChart && <Line className='' data={dataChart} />}
      </Card>

      <div className="flex-col flex flex-wrap justify-center gap-2  text-center">
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

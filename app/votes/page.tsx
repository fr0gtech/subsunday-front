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
import { Card, CardBody, CardHeader, Code } from '@heroui/react';

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
    <section className=" overflow-hidden px-10 mx-auto w-full gap-4 flex flex-col">
      <div className='flex gap-5'>
        <Card className=' w-1/2 h-fit' shadow='md'>
          <CardHeader>
            <h4 className=' text-2xl'>Voting</h4>
          </CardHeader>
          <CardBody>
            <p>
              Sub Sunday is a weekly event where subscribers to the channel can vote for games they'd like to see Lirik play. Every week, 6 games are selected for the main list and 4 as backups from the list of votes.
            </p>
            <h5 className='text-xl mt-10'>How to Vote</h5>
            <p>
              Voting can currently only be conducted through Twitch Chat! Any votes through the existing website will NOT be included.
              To vote, simply type <Code>!vote</Code> followed by the name of the game you wish to vote for.
              Example:  <Code>
                !vote Minecraft
              </Code>

            </p>
            <h5 className='text-xl mt-10'>About Voting</h5>
            <br />
            <ul>
              <li>
                - Every vote is a ticket, and each ticket has the same chance of being picked.
              </li>
              <li>
                - More tickets with the same game written on them increase the chance of that game being played.
              </li>
              <li>
                - Every vote counts, so there's still a chance a less popular game could be picked.
              </li>
            </ul>
            <h5 className='text-xl mt-10'>About Voting</h5>
            Voting Schedule
            <ul>
              <li>

                - When can I vote?
              </li>
            </ul>
            Monday through Saturday.
          </CardBody>
        </Card>
        <Card className='p-5 grow' shadow='md'>
          {dataChart && <Line options={{
            elements: {
              line: {
                tension: 0.33
              },
            },
          }} className='' data={dataChart} />}
        </Card>
      </div>


        <div className=" overflow-scroll space-y-2">
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

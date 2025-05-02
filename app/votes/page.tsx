'use client';
import useSWR from 'swr';
import { fetcher } from '../lib';
import { useMemo } from 'react';
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
import { Alert, Card, CardBody, CardHeader, Code, Link } from '@heroui/react';
import { LiveVotes } from '@/components/liveVotes';

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

  const dataChart = useMemo(() => {
    if (!data) return null
    return {
      labels: dayNames,
      datasets: [
        {
          label: 'Votes This Week',
          data: data.graph || [],
          borderColor: 'rgb(23, 201, 100)',
          backgroundColor: 'rgba(23, 201, 100, 0.5)',
          borderWidth: 3,
          pointStyle: 'dot',
          pointRadius: 2,
        },
        {
          label: "Votes Last Week",
          data: data.graphPastWeek || [],
          borderColor: 'rgb(147, 83, 211)',
          backgroundColor: 'rgba(147, 83, 211, 0.5)',
          borderWidth: 3,
          pointStyle: 'dot',
          pointRadius: 2,
        }

      ],
    };
  }, [data])

  return (
    <section className=" overflow-hidden p-5 mx-auto gap-2 flex flex-col">
      <div className='flex gap-2 lg:flex-row max-w-screen-xl flex-col justify-center'>

        <div className='gap-2 flex flex-col  lg:w-1/2'>
          <Card className='h-fit' shadow='md'>
            <CardHeader>
              <h4 className=' text-2xl font-bold'>Voting</h4>
              <span className='text-tiny'></span>
            </CardHeader>
            <CardBody>
              <p>
                Sub Sunday is a weekly event where subscribers to the channel can vote for games they'd like to see Lirik play.
                Every week, 6 games are selected for the main list and 4 as backups from the list of votes.
              </p>
            </CardBody>
            <Alert variant='flat' className='m-5 w-fit mx-auto' color='danger'>
              <p>
                The info below is unconfirmed and taken from <Link color='foreground' href="https://lirikker.com/lirik/subday/">here </Link>
              </p>
            </Alert>
          </Card>
          <Card>
            <CardHeader>
              <h5 className='text-xl'>About Voting</h5>
            </CardHeader>
            <CardBody>
              <ul className='opacity-80'>
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
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <h5 className='text-xl'>How to Vote</h5>
            </CardHeader>
            <CardBody>
              <p className='opacity-80'>
                Voting can currently only be conducted through Twitch Chat! Any votes through the existing website will NOT be included.
                To vote, simply type <Code>!vote</Code> followed by the name of the game you wish to vote for.
                Example:  <Code>
                  !vote Minecraft
                </Code>
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <h5 className='text-xl'>Voting Schedule</h5>
            </CardHeader>
            <CardBody>
              <ul className='opacity-80'>
                <li>
                  - When can I vote?
                </li>
                Monday through Saturday.
              </ul>
            </CardBody>
          </Card>
        </div>
        <div className='flex flex-col gap-2 lg:w-1/2'>
          <Card className='p-5 ' shadow='md'>
            <div className=" mx-auto flex gap-5 opacity-70">
              <div className='flex  items-center'>
                <div className='w-2 h-2 bg-[#17C964] mx-1 rounded-full'></div>
                <div className='text-tiny lowercase'>Votes this week</div>
              </div>
              <div className='flex  items-center'>
                <div className='w-2 h-2 bg-[#9353D3] mx-1 rounded-full'></div>
                <div className='text-tiny lowercase'>Votes last week</div>
              </div>
            </div>
            {dataChart && <Line
              options={{
                plugins: {
                  legend: {
                    display: false,
                    labels: {
                      usePointStyle: true,
                    },
                  }
                },
                elements: {
                  line: {
                    tension: 0.33
                  },
                },
                responsive: true,
                scales: {
                  x: {
                    border: {
                      display: false
                    },
                    grid: {
                      display: false,
                    }
                  },
                  y: {
                    border: {
                      display: false
                    },
                    grid: {
                      display: false,
                    },
                  }
                }
              }} data={dataChart} />}
          </Card>
         <LiveVotes amount={6}/>
        </div>
      </div>
    </section>
  );
}

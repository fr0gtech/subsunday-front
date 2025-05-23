import { TZDate } from '@date-fns/tz';
import { format, subDays } from 'date-fns';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import useSWR from 'swr';
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

import { fetcher } from '@/app/lib';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dayNames: string[] = [];

for (let i = 6; i >= 0; i--) {
  const date = subDays(new TZDate(new Date(), process.env.NEXT_PUBLIC_TZ as string), i);
  const dayName = format(date, 'EEEE');

  dayNames.push(dayName);
}
export const Chart = ({ id }: { id?: number }) => {
  // load graph data?
  const { data } = useSWR(`/api/graph?game=${id || 0}`, fetcher);

  const dataChart = useMemo(() => {
    if (!data) return null;

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
          label: 'Votes Last Week',
          data: data.graphPastWeek || [],
          borderColor: 'rgb(147, 83, 211)',
          backgroundColor: 'rgba(147, 83, 211, 0.5)',
          borderWidth: 3,
          pointStyle: 'dot',
          pointRadius: 2,
        },
      ],
    };
  }, [data]);

  if (!dataChart) {
    return <div>loading</div>;
  }

  return (
    <Line
      data={dataChart}
      options={{
        scales: {
          x: {
            ticks: {
              display: false,
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
          },
          y: {
            ticks: {
              display: false,
            },
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              usePointStyle: true,
            },
          },
        },
        elements: {
          line: {
            tension: 0.33,
          },
        },
        responsive: true,
        // scales: {
        //   x: {
        //     border: {
        //       display: false,
        //     },
        //     grid: {
        //       display: false,
        //     },
        //   },
        //   y: {
        //     border: {
        //       display: false,
        //     },
        //     grid: {
        //       display: false,
        //     },
        //   },
        // },
      }}
    />
  );
};

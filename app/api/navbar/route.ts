import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { getDateRange } from '@/app/lib';
import { endOfDay, startOfDay } from 'date-fns';
import { TZDate } from '@date-fns/tz';

export async function GET() {
  const range = getDateRange();

  const votesSubSunday = await prisma.game.findMany({
    select: {
      _count: {
        select: {
          votes: {
            where: {
              createdAt: {
                gte: range.startDate,
                lte: range.endDate,
              },
            },
          },
        },
      },
    },
  });

  const total = await prisma.game.findMany({
    select: {
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });
  const today = new TZDate(new Date(), 'America/New_York');
  const start_of_day = startOfDay(today);
  const end_of_day = endOfDay(today);

  const votesToday = await prisma.game.findMany({
    select: {
      _count: {
        select: {
          votes: {
            where: {
              createdAt: {
                gte: start_of_day,
                lte: end_of_day,
              },
            },
          },
        },
      },
    },
  });
  const vss = votesSubSunday.reduce((accum, current) => accum + current._count.votes, 0);
  const totalVotes = total.reduce((accum, current) => accum + current._count.votes, 0);
  const vt = votesToday.reduce((accum, current) => accum + current._count.votes, 0);

  return NextResponse.json({
    now: vss,
    total: totalVotes,
    today: vt,
  });
}

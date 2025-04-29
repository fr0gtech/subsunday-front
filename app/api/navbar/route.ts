import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { getDateRange } from '@/app/lib';

export async function GET() {
  const range = getDateRange({ intervalDays: 7, startDay: 0, time: '12:00' });

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

  const vss = votesSubSunday.reduce((accum, current) => accum + current._count.votes, 0);
  const totalVotes = total.reduce((accum, current) => accum + current._count.votes, 0);

  return NextResponse.json({
    now: vss,
    total: totalVotes,
  });
}

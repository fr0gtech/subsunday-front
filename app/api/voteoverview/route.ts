import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { endOfDay, startOfDay } from 'date-fns';
import { TZDate } from '@date-fns/tz';

export async function GET(req: NextRequest) {
  const rangeStart = parseInt(req.nextUrl.searchParams.get('rangeStart') as string) || 1;
  const rangeEnd = parseInt(req.nextUrl.searchParams.get('rangeEnd') as string) || 1;

  const votesSubSunday = await prisma.game.findMany({
    select: {
      _count: {
        select: {
          votes: {
            where: {
              createdAt: {
                gte: new Date(rangeStart),
                lte: new Date(rangeEnd),
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

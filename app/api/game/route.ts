import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { getDateRange } from '@/app/lib';

export async function GET(req: NextRequest) {
  const gameId = req.nextUrl.searchParams.get('id') as string;
  const range = getDateRange({ intervalDays: 7, startDay: 0, time: '12:00' });
  const game = await prisma.game.findFirst({
    where: {
      id: parseInt(gameId),
    },
    include: {
      _count: {
        select: { votes: true },
      },
      votes: {
        select: {
          createdAt: true,
          for: true,
          from: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
    },
  });

  const votesSubSunday = await prisma.game.findFirst({
    where: {
      id: parseInt(gameId),
    },
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
  return NextResponse.json({
    game: game,
    votesSubSunday: votesSubSunday,
  });
}

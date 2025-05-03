import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { getDateRange } from '@/app/lib';

export async function GET(req:NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get('page') as string)

  const range = getDateRange();
  const itemsToLoad = 18
  const games = await prisma.game.findMany({
    where: {
      name: {
        not: '',
      },
    },
    orderBy: {
      votes: {
        _count: 'desc',
      },
    },
    include: {
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
    skip: page < 1 ? 0 : (page - 1) * itemsToLoad,
    take: page * itemsToLoad,
  });

  return NextResponse.json({
    games: games,
  });
}

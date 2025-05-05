import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const rangeStart = parseInt(req.nextUrl.searchParams.get('rangeStart') as string) || 1;
  const rangeEnd = parseInt(req.nextUrl.searchParams.get('rangeEnd') as string) || 1;

  const itemsToLoad = 50;
  const games = await prisma.game.findMany({
    where: {
      name: {
        not: '',
      },
      votes: {
        some: {
          createdAt: {
            gte: new Date(rangeStart),
            lte: new Date(rangeEnd),
          },
        },
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
                gte: new Date(rangeStart),
                lte: new Date(rangeEnd),
              },
            },
          },
        },
      },
    },
    take: itemsToLoad,
  });

  return NextResponse.json({
    games: games,
  });
}

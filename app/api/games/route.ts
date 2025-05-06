import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const rangeStart = parseInt(req.nextUrl.searchParams.get('rangeStart') as string) || 1;
  const rangeEnd = parseInt(req.nextUrl.searchParams.get('rangeEnd') as string) || 1;
  const page = parseInt(req.nextUrl.searchParams.get('page') as string);
  const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize') as string);

  const voteCounts = await prisma.vote.groupBy({
    by: ['gameName'],
    where: {
      createdAt: {
        gte: new Date(rangeStart),
        lte: new Date(rangeEnd),
      },
    },
    _count: true,
    orderBy: [
      {
        _count: {
          gameName: 'desc',
        },
      },
      { gameName: 'desc' },
    ],
    skip: page * pageSize,
    take: pageSize,
  });
  const gameIds = voteCounts.map((v) => v.gameName);

  const games = await prisma.game.findMany({
    where: {
      name: { in: gameIds },
    },
    select: {
      id: true,
      steamId: true,
      name: true,
      picture: true,
      categories: true,
      price: true,
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

  const gameMap = new Map(games.map((g) => [g.name, g]));
  const orderedGames = gameIds.map((id) => gameMap.get(id));

  return NextResponse.json({
    page: orderedGames,
  });
}

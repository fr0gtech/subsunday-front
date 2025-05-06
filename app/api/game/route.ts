import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const gameId = req.nextUrl.searchParams.get('id') as string;
  const rangeStart = parseInt(req.nextUrl.searchParams.get('rangeStart') as string) || 1;
  const rangeEnd = parseInt(req.nextUrl.searchParams.get('rangeEnd') as string) || 1;

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
          updatedAt: true,
          for: true,
          from: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 11,
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
                gte: new Date(rangeStart),
                lte: new Date(rangeEnd),
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

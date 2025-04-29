import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const top10voters = await prisma.user.findMany({
    select: {
      name: true,
      _count: {
        select: {
          votes: true,
        },
      },
      votes: {
        select: {
          createdAt: true,
          for: true,
          from: true,
        },
      },
    },
    orderBy: {
      votes: {
        _count: 'desc',
      },
    },
    take: 10,
  });

  const top10games = await prisma.game.findMany({
    select: {
      name: true,
      id: true,
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      votes: {
        _count: 'desc',
      },
    },
    take: 10,
  });

  const top10streak = await prisma.user.findMany({
    orderBy: {
      streak: 'desc',
    },
    take: 10,
  });

  return NextResponse.json({
    topUsers: top10voters,
    topGames: top10games,
    topStreak: top10streak,
  });
}

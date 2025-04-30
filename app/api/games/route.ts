import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET() {
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
        select: { votes: true },
      },
    },
    take: 20,
  });

  return NextResponse.json({
    games: games,
  });
}

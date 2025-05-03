import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const value = req.nextUrl.searchParams.get('value') as string;

  const games = await prisma.game.findMany({
    where: {
      OR: [
        { name: { contains: value, mode: 'insensitive' } },
        { name: value },
        { name: { startsWith: value, mode: 'insensitive' } },
        { name: { endsWith: value, mode: 'insensitive' } },
      ],
    },
    take: 10,
    include: {
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: value, mode: 'insensitive' } },
        { name: value },
        { name: { startsWith: value, mode: 'insensitive' } },
        { name: { endsWith: value, mode: 'insensitive' } },
      ],
    },
    take: 10,
    include: {
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });
  return NextResponse.json({
    games,
    users,
  });
}

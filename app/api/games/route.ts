import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const rangeStart = parseInt(req.nextUrl.searchParams.get('rangeStart') as string) || 1;
  const rangeEnd = parseInt(req.nextUrl.searchParams.get('rangeEnd') as string) || 1;
  const page = parseInt(req.nextUrl.searchParams.get('page') as string);
  const pageSize = parseInt(req.nextUrl.searchParams.get('pageSize') as string);

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
    orderBy: [
      {
        votes: {
          _count: 'desc',
        },
      },
      {
        id: 'desc',
      },
    ],
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
    skip: page * pageSize,
    take: pageSize,
  });

  return NextResponse.json({
    page: games,
  });
}

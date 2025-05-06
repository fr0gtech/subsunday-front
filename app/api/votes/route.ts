import { NextRequest, NextResponse } from 'next/server';
import { addSeconds, isAfter } from 'date-fns';

import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const take = parseInt(req.nextUrl.searchParams.get('amount') as string);
  const rangeStart = parseInt(req.nextUrl.searchParams.get('rangeStart') as string) || 1;
  const rangeEnd = parseInt(req.nextUrl.searchParams.get('rangeEnd') as string) || 1;

  const votes = await prisma.vote.findMany({
    where: {
      createdAt: {
        gte: new Date(rangeStart),
        lte: new Date(rangeEnd),
      },
    },
    take: take || 6,
    include: {
      for: {
        select: {
          id: true,
          name: true,
        },
      },
      from: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  const taggedVotes = votes.map((e) => {
    const updated = isAfter(e.updatedAt, addSeconds(e.createdAt, 5));

    return {
      ...e,
      updated: updated,
    };
  });

  return NextResponse.json({
    votes: taggedVotes,
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { addSeconds, isAfter } from 'date-fns';

import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  let take = parseInt(req.nextUrl.searchParams.get('amount') as string) || 1;
  const rangeStart = parseInt(req.nextUrl.searchParams.get('rangeStart') as string) || 1;
  const rangeEnd = parseInt(req.nextUrl.searchParams.get('rangeEnd') as string) || 1;
  const query = req.nextUrl.searchParams.get('query') as string;

  take = take > 10 ? 10 : take;

  if (query && query.length > 0) {
    const votes = await prisma.vote.findMany({
      where: {
        from: {
          OR: [
            { name: { startsWith: query, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } },
            { name: { endsWith: query, mode: 'insensitive' } },
          ],
        },
      },
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
      take: take,
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
  } else {
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
}

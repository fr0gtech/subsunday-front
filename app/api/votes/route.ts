import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET() {
  const votes = await prisma.vote.findMany({
    take: 10,
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
      createdAt: 'desc',
    },
  });

  return NextResponse.json({
    votes: votes,
  });
}

import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('id') as string;

  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(userId),
    },
    select: {
      name: true,
      streak: true,
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
      },
    },
  });

  return NextResponse.json({
    user: user,
  });
}

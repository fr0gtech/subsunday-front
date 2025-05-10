import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const gameId = req.nextUrl.searchParams.get('id') as string;
  console.log(gameId);

  try {
    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${gameId}&cc=us`,
    );
    const data = await response.json();

    return NextResponse.json({
      game: data[gameId].data,
    });
  } catch (error) {
    console.error('Steam API Error:', error);

    return NextResponse.json({
      game: 'fail',
    });
  }
}

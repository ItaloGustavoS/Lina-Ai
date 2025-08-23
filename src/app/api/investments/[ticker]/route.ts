import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { ticker: string } }
) {
  const ticker = params.ticker;
  const token = process.env.BRAPI_API_TOKEN;

  if (!token) {
    return new NextResponse('Missing BRAPI_API_TOKEN', { status: 500 });
  }

  const response = await fetch(
    `https://brapi.dev/api/quote/${ticker}?token=${token}`
  );

  if (!response.ok) {
    return new NextResponse('Failed to fetch data from brapi.dev', {
      status: response.status,
    });
  }

  const data = await response.json();
  return NextResponse.json(data);
}

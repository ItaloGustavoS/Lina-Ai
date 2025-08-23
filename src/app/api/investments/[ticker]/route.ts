import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { ticker: string } }
) {
  const ticker = params.ticker;
  const token = process.env.BRAPI_API_TOKEN;

  if (!token) {
    console.error('Missing BRAPI_API_TOKEN');
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `https://brapi.dev/api/quote/${ticker}?token=${token}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch {
        errorDetails = await response.text();
      }
      return new NextResponse(
        JSON.stringify({
          message: 'Failed to fetch data from brapi.dev',
          details: errorDetails,
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return new NextResponse('Request timed out', { status: 408 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

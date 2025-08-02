import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate that 'transactions' is present and is an array
    if (
      !body ||
      !('transactions' in body) ||
      !Array.isArray(body.transactions)
    ) {
      return NextResponse.json(
        { error: "'transactions' is required and must be an array." },
        { status: 400 }
      );
    }

    const { transactions } = body;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Analyze the following financial transactions and provide a summary of the user's financial health.
      The user wants to know their spending habits, get suggestions for saving money, and a general score of their financial health.
      Transactions: ${JSON.stringify(transactions)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze transactions' }, { status: 500 });
  }
}

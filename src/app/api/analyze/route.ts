import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body ||
      !('transactions' in body) ||
      !Array.isArray(body.transactions) ||
      !('categories' in body) ||
      !Array.isArray(body.categories) ||
      !('prompt' in body) ||
      typeof body.prompt !== 'string'
    ) {
      return NextResponse.json(
        { error: "Invalid request body. 'transactions', 'categories', and 'prompt' are required." },
        { status: 400 }
      );
    }

    const { transactions, categories, prompt } = body;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const fullPrompt = `
      ${prompt}
      Here is the user's financial data:
      Transactions: ${JSON.stringify(transactions)}
      Categories: ${JSON.stringify(categories)}
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze transactions' }, { status: 500 });
  }
}

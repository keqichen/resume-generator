import { NextResponse } from "next/server";
import { openai } from '@/lib/openai';

// POST: Generate CV Content from Work Log
export async function POST(req: Request) {
  const { logContent } = await req.json();

  if (!logContent) {
    return NextResponse.json({ error: 'logContent is required.' }, { status: 400 });
  }

  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional resume writing assistant. Convert user work logs into concise, impactful resume bullet points.' },
        { role: 'user', content: `Work Log:\n${logContent}` },
      ],
      temperature: 0.7,
    });

    const result = chat.choices[0]?.message?.content || '';
    return NextResponse.json({ result });
  } catch (err) {
    console.error('OpenAI API Error:', err);
    return NextResponse.json({ error: 'Failed to generate content.' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: Request) {
  const { logContent } = await req.json();

  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional resume writing assistant. Convert user work logs into concise, impactful resume bullet points.' },
        { role: 'user', content: `Work Log:\n${logContent}` },
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ result: chat.choices[0].message.content });
  } catch (err) {
    console.error('Failed to call OpenAI API:', err);
    return NextResponse.json({ error: 'Failed to generate resume content.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// POST: Save Resume to Database
export async function POST(req: Request) {
  const { title, data, user_id } = await req.json();

  if (!title || !data) {
    return NextResponse.json({ error: 'title and data are required.' }, { status: 400 });
  }

  const { error } = await supabase.from('resumes').insert([
    {
      title,
      data,
      user_id, // Optional: Only if you have user tracking
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// GET: Fetch All Generated Resumes (Optional: Add Query Filters)
export async function GET() {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// PATCH: Update a Resume Entry
export async function PATCH(req: Request) {
  const { id, updatedData } = await req.json();

  if (!id || !updatedData) {
    return NextResponse.json({ error: 'id and updatedData are required.' }, { status: 400 });
  }

  const { error } = await supabase
    .from('resumes')
    .update({ data: updatedData, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE: Delete a Resume Entry
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'id is required.' }, { status: 400 });
  }

  const { error } = await supabase.from('resumes').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
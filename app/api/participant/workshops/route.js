import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Workshop from '@/models/Workshop';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId required' }, { status: 400 });
    }
    const workshops = await Workshop.find({ participants: userId })
      .populate('participants', 'name email')
      .populate('sessions');
    return NextResponse.json({ success: true, workshops });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 
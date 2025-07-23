import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const facilitators = await User.find({ role: 'facilitator' }).select('name email _id');
    return NextResponse.json({ success: true, facilitators });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 
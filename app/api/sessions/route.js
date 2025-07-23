import { NextResponse } from 'next/server';
import Session from '@/models/Session';
import Workshop from '@/models/Workshop';
import dbConnect from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req) {
  try {
    await dbConnect();
    const sessions = await Session.find()
      .populate('workshop', 'title')
      .populate('facilitator', 'name email');
    
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await requireRole('admin')(req);
    
    await dbConnect();
    const body = await req.json();
    const session = new Session(body);
    await session.save();
    
    // Add session to workshop
    await Workshop.findByIdAndUpdate(
      body.workshop,
      { $push: { sessions: session._id } }
    );
    
    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
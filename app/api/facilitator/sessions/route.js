import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Workshop from '@/models/Workshop';
import Session from '@/models/Session';
import { requireRole } from '@/lib/auth';

export async function GET(req) {
  try {
    await requireRole('facilitator')(req);
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId required' }, { status: 400 });
    }
    // Find all workshops assigned to this facilitator
    const workshops = await Workshop.find({ facilitator: userId });
    // Find all sessions for these workshops
    const sessions = await Session.find({ workshop: { $in: workshops.map(w => w._id) } });
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 
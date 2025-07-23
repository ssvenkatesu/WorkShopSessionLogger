import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Workshop from '@/models/Workshop';
import Session from '@/models/Session';

export async function GET(req) {
  try {
    await dbConnect();
    const workshopsCount = await Workshop.countDocuments();
    const sessionsCount = await Session.countDocuments();
    const participantsCount = await User.countDocuments({ role: 'participant' });
    const facilitatorsCount = await User.countDocuments({ role: 'facilitator' });
    const recentWorkshops = await Workshop.find()
      .sort({ startDate: -1 })
      .limit(5)
      .select('title startDate endDate');
    return NextResponse.json({
      workshopsCount,
      sessionsCount,
      participantsCount,
      facilitatorsCount,
      recentWorkshops
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
} 
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
    // Assigned workshops (with sessions populated)
    const workshops = await Workshop.find({ facilitator: userId })
      .populate({ path: 'sessions', select: 'title date startTime endTime' });
    // All sessions for these workshops
    const sessions = await Session.find({ workshop: { $in: workshops.map(w => w._id) } });
    // Upcoming and completed sessions
    const now = new Date();
    const upcomingSessions = sessions.filter(s => new Date(s.date) >= now);
    const completedSessions = sessions.filter(s => new Date(s.date) < now);
    // Next sessions (sorted by date)
    const nextSessions = upcomingSessions.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
    return NextResponse.json({
      assignedWorkshops: workshops.length,
      assignedWorkshopsList: workshops.map(w => ({
        _id: w._id,
        title: w.title,
        startDate: w.startDate,
        endDate: w.endDate,
        sessions: w.sessions
      })),
      upcomingSessions: upcomingSessions.length,
      completedSessions: completedSessions.length,
      nextSessions: nextSessions.map(s => ({
        _id: s._id,
        title: s.title,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime
      }))
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 
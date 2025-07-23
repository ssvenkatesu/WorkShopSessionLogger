import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Workshop from '@/models/Workshop';
import Session from '@/models/Session';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId required' }, { status: 400 });
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    // Registered workshops
    const workshops = await Workshop.find({ participants: userId });
    // All sessions for these workshops
    const sessions = await Session.find({ workshop: { $in: workshops.map(w => w._id) } });
    // Upcoming sessions
    const now = new Date();
    const nextSessions = sessions.filter(s => new Date(s.date) >= now);
    // Attendance rate
    const attendedSessions = sessions.filter(s => s.attendance && s.attendance.includes(userId));
    const attendanceRate = sessions.length > 0 ? Math.round((attendedSessions.length / sessions.length) * 100) : 0;
    return NextResponse.json({
      success: true,
      registeredWorkshops: workshops.length,
      upcomingSessions: nextSessions.length,
      attendanceRate,
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
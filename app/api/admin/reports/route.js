import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Workshop from '@/models/Workshop';
import Session from '@/models/Session';
import User from '@/models/User';
import { requireRole } from '@/lib/auth';

export async function GET(req) {
  try {
    await requireRole('admin')(req);
    await dbConnect();
    const workshops = await Workshop.find()
      .populate({ path: 'sessions', populate: { path: 'attendance', select: 'name email' } })
      .populate('participants', 'name email');
    const sessions = await Session.find().populate('workshop').populate('attendance');
    const participants = await User.find({ role: 'participant' }).select('name email');

  
    let totalPossible = 0;
    let totalAttended = 0;
    sessions.forEach(session => {
      totalPossible += session.workshop && session.workshop.participants ? session.workshop.participants.length : 0;
      totalAttended += session.attendance.length;
    });
    const overallAttendance = totalPossible > 0 ? Math.round((totalAttended / totalPossible) * 100) : 0;

 
    const workshopPerformance = workshops.map(w => {
      const wsessions = Array.isArray(w.sessions) ? w.sessions : [];
      const totalSessPossible = wsessions.reduce((sum, s) => sum + (w.participants.length), 0);
      const totalSessAttended = wsessions.reduce((sum, s) => sum + (s.attendance ? s.attendance.length : 0), 0);
      return {
        _id: w._id,
        title: w.title,
        sessions: wsessions.length,
        participants: w.participants.length,
        attendance: totalSessPossible > 0 ? Math.round((totalSessAttended / totalSessPossible) * 100) : 0
      };
    });


    const participantAttendance = await Promise.all(participants.map(async p => {

      const myWorkshops = workshops.filter(w => w.participants.some(u => (u._id || u) == p._id));
      const mySessions = myWorkshops.flatMap(w => Array.isArray(w.sessions) ? w.sessions : []);
  
      let attended = 0;
      for (const s of mySessions) {
        
        let sessionObj = s.title ? s : await Session.findById(s);
        if (sessionObj && Array.isArray(sessionObj.attendance) && sessionObj.attendance.some(u => (u._id || u) == p._id)) {
          attended++;
        }
      }
      return {
        _id: p._id,
        name: p.name,
        email: p.email,
        attended,
        total: mySessions.length,
        attendanceRate: mySessions.length > 0 ? Math.round((attended / mySessions.length) * 100) : 0
      };
    }));

    return NextResponse.json({
      success: true,
      report: {
        overallAttendance,
        workshops,
        sessions,
        participants,
        workshopPerformance,
        participantAttendance
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 
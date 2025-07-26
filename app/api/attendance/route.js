import { NextResponse } from 'next/server';
import Session from '@/models/Session';
import dbConnect from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function POST(req) {
  try {
    await requireRole(['facilitator', 'participant'])(req);
    
    await dbConnect();
    const { sessionId, userId } = await req.json();
    
    const session = await Session.findById(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Session not found' },
        { status: 404 }
      );
    }
    
  
    if (session.attendance.includes(userId)) {
      return NextResponse.json({
        success: true,
        message: 'Attendance already recorded'
      });
    }
    
    session.attendance.push(userId);
    await session.save();
    
    return NextResponse.json({
      success: true,
      message: 'Attendance recorded successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
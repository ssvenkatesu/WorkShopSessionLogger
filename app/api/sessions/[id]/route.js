import { NextResponse } from 'next/server';
import Session from '@/models/Session';
import dbConnect from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req, context) {
  try {
    await dbConnect();
    const { params } = context;
    const { id } = await params;
    const session = await Session.findById(id)
      .populate('workshop', 'title participants')
      .populate('facilitator', 'name email')
      .populate('attendance', 'name email');
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Session not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    await requireRole('admin')(req);
    
    await dbConnect();
    const { params } = context;
    const { id } = await params;
    const body = await req.json();

    // Remove facilitator-specific field filtering since only admins can update
    // If you want to support facilitator updates, extract user from request and check role
    // For now, just update with provided body

    const session = await Session.findByIdAndUpdate(id, body, { new: true })
      .populate('workshop', 'title participants')
      .populate('facilitator', 'name email')
      .populate('attendance', 'name email');
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Session not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, session });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireRole('admin')(req);
    
    await dbConnect();
    const session = await Session.findByIdAndDelete(params.id);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Session not found' },
        { status: 404 }
      );
    }
    
    // Remove session from workshop
    await Workshop.findByIdAndUpdate(
      session.workshop,
      { $pull: { sessions: session._id } }
    );
    
    return NextResponse.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
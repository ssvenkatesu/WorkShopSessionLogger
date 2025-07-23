import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Workshop from '@/models/Workshop';
import { requireRole } from '@/lib/auth';

export async function POST(req) {
  try {
    await requireRole('participant')(req);
    await dbConnect();
    const { workshopId, userId } = await req.json();
    if (!workshopId || !userId) {
      return NextResponse.json({ success: false, message: 'Missing workshopId or userId' }, { status: 400 });
    }
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return NextResponse.json({ success: false, message: 'Workshop not found' }, { status: 404 });
    }
    if (workshop.participants.includes(userId)) {
      return NextResponse.json({ success: false, message: 'Already registered' }, { status: 400 });
    }
    workshop.participants.push(userId);
    await workshop.save();
    return NextResponse.json({ success: true, message: 'Registered successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 
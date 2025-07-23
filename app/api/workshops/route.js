import { NextResponse } from 'next/server';
import Workshop from '@/models/Workshop';
import dbConnect from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req) {
  try {
    await dbConnect();
    const workshops = await Workshop.find()
      .populate('facilitator', 'name email')
      .populate('participants', 'name email');
    
    return NextResponse.json({ success: true, workshops });
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
    const workshop = new Workshop(body);
    await workshop.save();
    
    return NextResponse.json({ success: true, workshop }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status || 400 }
    );
  }
}
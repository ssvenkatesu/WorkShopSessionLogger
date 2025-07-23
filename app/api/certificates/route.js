import { NextResponse } from 'next/server';
import Certificate from '@/models/Certificate';
import dbConnect from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = await requireRole(['admin', 'participant'])(req);
    
    await dbConnect();
    let certificates;
    
    if (user.role === 'admin') {
      certificates = await Certificate.find()
        .populate('user', 'name email')
        .populate('workshop', 'title');
    } else {
      certificates = await Certificate.find({ user: user.id })
        .populate('workshop', 'title');
    }
    
    return NextResponse.json({ success: true, certificates });
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
    const certificate = new Certificate(body);
    await certificate.save();
    
    return NextResponse.json({ success: true, certificate }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
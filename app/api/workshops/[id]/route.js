import { NextResponse } from 'next/server';
import Workshop from '@/models/Workshop';
import dbConnect from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req, context) {
  try {
    await dbConnect();
    const { params } = context;
    const { id } = await params;
    const workshop = await Workshop.findById(id)
      .populate('facilitator', 'name email')
      .populate('participants', 'name email')
      .populate('sessions');
    
    if (!workshop) {
      return NextResponse.json(
        { success: false, message: 'Workshop not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, workshop });
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
    const workshop = await Workshop.findByIdAndUpdate(id, body, { new: true })
      .populate('facilitator', 'name email')
      .populate('participants', 'name email')
      .populate('sessions');
    
    if (!workshop) {
      return NextResponse.json(
        { success: false, message: 'Workshop not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, workshop });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    await requireRole('admin')(req);
    
    await dbConnect();
    const { params } = context;
    const { id } = await params;
    const workshop = await Workshop.findByIdAndDelete(id);
    
    if (!workshop) {
      return NextResponse.json(
        { success: false, message: 'Workshop not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Workshop deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
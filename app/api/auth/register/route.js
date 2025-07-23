import { hashPassword } from '@/lib/auth';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();
    await dbConnect();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'participant'
    });
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
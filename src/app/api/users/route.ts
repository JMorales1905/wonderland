import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';

// GET - Fetch all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST - Create a new user
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const user = await User.create({
      name: body.name,
      email: body.email,
      age: body.age,
    });
    
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
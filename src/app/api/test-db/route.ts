import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/user';

export async function GET() {
  try {
    // Step 1: Connect to database
    await connectDB();
    
    // Step 2: Test write operation
    const testUser = await User.create({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      age: 25
    });
    
    // Step 3: Test read operation
    const users = await User.find({});
    
    // Step 4: Test delete operation (cleanup)
    await User.findByIdAndDelete(testUser._id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful!',
      userCount: users.length 
    });
    
    //catch-error for error handling
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
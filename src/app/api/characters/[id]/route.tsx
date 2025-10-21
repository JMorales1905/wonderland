// ==========================================
// 4. API Route - PUT & DELETE (app/api/characters/[id]/route.ts)
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Character from '@/app/models/Character';
import mongoose from 'mongoose';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const userId = session.user.id;

    const userId = 'temp-user-id'; // TODO: Replace with actual auth

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid character ID' }, { status: 400 });
    }

    const body = await request.json();

    // Find and update character (only if it belongs to the user)
    const character = await Character.findOneAndUpdate(
      { _id: id, userId },
      {
        name: body.name,
        age: body.age,
        role: body.role,
        description: body.description,
        background: body.background,
        personality: body.personality,
        appearance: body.appearance,
        relationships: body.relationships,
        motivations: body.motivations,
      },
      { new: true, runValidators: true } // Return updated doc and run validation
    );

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ character }, { status: 200 });
  } catch (error: any) {
    console.error('PUT /api/characters/[id] error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update character', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const userId = session.user.id;

    const userId = 'temp-user-id'; // TODO: Replace with actual auth

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid character ID' }, { status: 400 });
    }

    const character = await Character.findOneAndDelete({ _id: id, userId });

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Character deleted successfully', character },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE /api/characters/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete character', details: error.message },
      { status: 500 }
    );
  }
}

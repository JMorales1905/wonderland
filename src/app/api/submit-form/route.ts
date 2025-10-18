import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const client = await clientPromise;
    const db = client.db('TestGround');
    const collection = db.collection('Wonderland');
    
    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
    });
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
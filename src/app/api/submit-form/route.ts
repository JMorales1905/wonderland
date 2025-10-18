import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const client = await clientPromise;
    const db = client.db('your_database_name');
    const collection = db.collection('your_collection_name');
    
    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
    });
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
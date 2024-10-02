import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const requests = await prisma.registrationRequest.findMany({
      where: { status: 'PENDING' },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching registration requests:', error);
    return NextResponse.json({ error: 'Error fetching registration requests' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
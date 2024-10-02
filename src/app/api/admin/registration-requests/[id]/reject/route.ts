import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.registrationRequest.update({
      where: { id: params.id },
      data: { status: 'REJECTED' },
    });

    return NextResponse.json({ message: 'Registration request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting registration request:', error);
    return NextResponse.json({ error: 'Error rejecting registration request' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const count = await prisma.vehicle.count({
    where: {
      estado: 'En reparación'
    }
  });
  return NextResponse.json({ count });
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { taskId } = await request.json();

  await prisma.task.delete({
    where: { id: taskId },
  });

  return NextResponse.json({ success: true });
}

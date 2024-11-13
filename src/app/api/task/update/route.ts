import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { taskId, title, completed } = await request.json();
  
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { title, completed },
  });

  return NextResponse.json(updatedTask);
}

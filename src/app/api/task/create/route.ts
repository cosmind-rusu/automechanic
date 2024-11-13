import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { usuario, title } = await request.json();
  
  const task = await prisma.task.create({
    data: {
      title,
      usuario,
    },
  });

  return NextResponse.json(task);
}

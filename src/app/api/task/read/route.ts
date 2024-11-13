import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usuario = searchParams.get("usuario") as string;
  
  const tasks = await prisma.task.findMany({
    where: { usuario },
  });

  return NextResponse.json(tasks);
}

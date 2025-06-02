import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { nombre, apellido, telefono, usuario, password } = await request.json();
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newRequest = await prisma.registrationRequest.create({
      data: {
        nombre,
        apellido,
        telefono: parseInt(telefono),
        usuario,
        password: hashedPassword,
      },
    });
    
    return NextResponse.json({ message: 'Registration request submitted successfully', id: newRequest.id });
  } catch (error) {
    console.error('Error submitting registration request:', error);
    return NextResponse.json({ error: 'Error submitting registration request' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
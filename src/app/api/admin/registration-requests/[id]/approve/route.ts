import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const requestData = await prisma.registrationRequest.findUnique({
      where: { id: params.id },
    });

    if (!requestData) {
      return NextResponse.json({ error: 'Registration request not found' }, { status: 404 });
    }

    // Create new user
    await prisma.user.create({
      data: {
        nombre: requestData.nombre,
        apellido: requestData.apellido,
        telefono: requestData.telefono,
        usuario: requestData.usuario,
        password: requestData.password, // Note: password is already hashed
        rol: 'EMPLEADO', // Default role, adjust as needed
      },
    });

    // Update request status
    await prisma.registrationRequest.update({
      where: { id: params.id },
      data: { status: 'APPROVED' },
    });

    return NextResponse.json({ message: 'Registration request approved successfully' });
  } catch (error) {
    console.error('Error approving registration request:', error);
    return NextResponse.json({ error: 'Error approving registration request' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, telefono } = await request.json();
    const [nombre, apellido] = name.split(' ');
    
    const updatedEmployee = await prisma.user.update({
      where: { id: params.id },
      data: { nombre, apellido, telefono },
    });
    
    return NextResponse.json({ id: updatedEmployee.id, name, telefono });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating employee' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting employee' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }

    const employee = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        telefono: true,
        rol: true,
        usuario: true,
      },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error al obtener detalles del empleado:', error);
    return NextResponse.json({ error: 'Error al obtener detalles del empleado' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }

    const body = await request.json();
    const { nombre, apellido, telefono, rol } = body;

    if (!nombre || !apellido || !telefono || !rol) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const updatedEmployee = await prisma.user.update({
      where: { id },
      data: {
        nombre,
        apellido,
        telefono: parseInt(telefono, 10),
        rol,
      },
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error('Error al actualizar el empleado:', error);
    return NextResponse.json({ error: 'Error al actualizar el empleado' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el empleado:', error);
    return NextResponse.json({ error: 'Error al eliminar el empleado' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      include: {
        empleados: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json({ error: 'Error fetching vehicle' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        ...data,
        fechaEntrada: new Date(data.fechaEntrada),
        fechaSalida: data.fechaSalida ? new Date(data.fechaSalida) : null,
        empleados: {
          set: [], // Limpiamos la relación anterior
          connect: data.empleados?.map((id: string) => ({ id })),
        },
      },
      include: {
        empleados: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });
    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json({ error: 'Error updating vehicle' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.vehicle.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json({ error: 'Error deleting vehicle' }, { status: 500 });
  }
}

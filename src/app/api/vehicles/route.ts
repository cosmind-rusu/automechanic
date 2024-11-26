import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
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
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json({ error: 'Error fetching vehicles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newVehicle = await prisma.vehicle.create({
      data: {
        ...data,
        fechaEntrada: new Date(data.fechaEntrada),
        fechaSalida: data.fechaSalida ? new Date(data.fechaSalida) : null,
        empleados: {
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
    return NextResponse.json(newVehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ error: 'Error creating vehicle' }, { status: 500 });
  }
}

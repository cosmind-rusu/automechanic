import { NextResponse } from 'next/server';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Obtener la lista de empleados con las columnas definidas en el esquema
    const employees: Pick<User, 'id' | 'nombre' | 'apellido' | 'telefono' | 'rol'>[] = await prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        apellido: true,
        telefono: true,
        rol: true, // Incluye el rol para futuras referencias
      },
    });

    // Transformar empleados para ajustarse al formato de respuesta esperado
    const transformedEmployees = employees.map((employee) => ({
      id: employee.id,
      name: `${employee.nombre} ${employee.apellido}`,
      telefono: employee.telefono,
      rol: employee.rol,
    }));

    return NextResponse.json(transformedEmployees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Error fetching employees' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const { name, telefono } = await request.json();
    const [nombre, apellido] = name.split(' ');

    // Crear un nuevo empleado
    const newEmployee = await prisma.user.create({
      data: {
        nombre,
        apellido,
        telefono,
        rol: 'EMPLEADO',
        usuario: name.toLowerCase().replace(' ', '.'),
        password: 'defaultPassword', // Maneja las contraseñas de forma segura en producción
      },
    });

    return NextResponse.json({
      id: newEmployee.id,
      name: `${newEmployee.nombre} ${newEmployee.apellido}`,
      telefono: newEmployee.telefono,
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Error creating employee' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, telefono, rol } = await request.json();
    const [nombre, apellido] = name.split(' ');

    // Actualizar los datos del empleado
    const updatedEmployee = await prisma.user.update({
      where: { id },
      data: { nombre, apellido, telefono, rol },
    });

    return NextResponse.json({
      id: updatedEmployee.id,
      name: `${updatedEmployee.nombre} ${updatedEmployee.apellido}`,
      telefono: updatedEmployee.telefono,
      rol: updatedEmployee.rol,
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: 'Error updating employee' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    // Eliminar empleado por ID
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: 'Error deleting employee' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('1234', 10)

  const user = await prisma.user.upsert({
    where: { usuario: 'cr' },
    update: {},
    create: {
      nombre: 'Cosmin',
      apellido: 'Rusu',
      telefono: 123456789,
      usuario: 'cr',
      password: hashedPassword,
      rol: 'JEFE_MECANICO',
    },
  })

  console.log({ user })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
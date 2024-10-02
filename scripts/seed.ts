import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('1234', 10)

  const user = await prisma.user.upsert({
    where: { usuario: 'cd' },
    update: {},
    create: {
      nombre: 'Cosmin',
      apellido: 'Daniel',
      telefono: 1234567890,
      usuario: 'cd',
      password: hashedPassword,
      rol: 'MECANICO',
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
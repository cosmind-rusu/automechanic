/*
  Warnings:

  - You are about to drop the column `employeeId` on the `ClockIn` table. All the data in the column will be lost.
  - Added the required column `usuario` to the `ClockIn` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClockIn" DROP CONSTRAINT "ClockIn_employeeId_fkey";

-- AlterTable
ALTER TABLE "ClockIn" DROP COLUMN "employeeId",
ADD COLUMN     "usuario" TEXT NOT NULL;

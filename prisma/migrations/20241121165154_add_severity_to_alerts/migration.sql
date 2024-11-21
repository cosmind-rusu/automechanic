-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- AlterTable
ALTER TABLE "GeneralAlert" ADD COLUMN     "severity" "Severity" NOT NULL DEFAULT 'INFO';

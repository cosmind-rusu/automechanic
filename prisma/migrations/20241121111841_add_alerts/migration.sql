/*
  Warnings:

  - You are about to drop the column `currentQty` on the `InventoryAlert` table. All the data in the column will be lost.
  - You are about to drop the column `minQty` on the `InventoryAlert` table. All the data in the column will be lost.
  - You are about to drop the column `resolvedAt` on the `InventoryAlert` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `InventoryItem` table. All the data in the column will be lost.
  - Added the required column `message` to the `InventoryAlert` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InventoryAlert" DROP CONSTRAINT "InventoryAlert_itemId_fkey";

-- AlterTable
ALTER TABLE "InventoryAlert" DROP COLUMN "currentQty",
DROP COLUMN "minQty",
DROP COLUMN "resolvedAt",
ADD COLUMN     "message" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InventoryItem" DROP COLUMN "unit";

-- AddForeignKey
ALTER TABLE "InventoryAlert" ADD CONSTRAINT "InventoryAlert_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

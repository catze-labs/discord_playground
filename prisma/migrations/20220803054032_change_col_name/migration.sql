/*
  Warnings:

  - You are about to drop the column `dicordUUID` on the `UserToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[discordUUID]` on the table `UserToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discordUUID` to the `UserToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `UserToken_dicordUUID_key` ON `UserToken`;

-- AlterTable
ALTER TABLE `UserToken` DROP COLUMN `dicordUUID`,
    ADD COLUMN `discordUUID` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserToken_discordUUID_key` ON `UserToken`(`discordUUID`);

/*
  Warnings:

  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `blog` DROP FOREIGN KEY `Blog_categoryId_fkey`;

-- DropIndex
DROP INDEX `Category_slug_key` ON `category`;

-- AlterTable
ALTER TABLE `category` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`slug`);

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`slug`) ON DELETE SET NULL ON UPDATE CASCADE;

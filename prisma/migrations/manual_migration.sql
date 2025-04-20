-- Step 1: Create a temporary table to store category data
CREATE TABLE `_temp_category` (
  `slug` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`slug`)
);

-- Step 2: Copy data from Category to temp table
INSERT INTO `_temp_category` (`slug`, `name`, `createdAt`, `updatedAt`)
SELECT `slug`, `name`, `createdAt`, `updatedAt` FROM `Category`;

-- Step 3: Check the actual column names in the database
SHOW COLUMNS FROM `Category`;
SHOW COLUMNS FROM `Blog`;

-- Step 4: Drop foreign key constraint
ALTER TABLE `Blog` DROP FOREIGN KEY `Blog_categoryId_fkey`;

-- Step 5: Drop original Category table
DROP TABLE `Category`;

-- Step 6: Rename temp table to Category
RENAME TABLE `_temp_category` TO `Category`;

-- Step 7: Add foreign key constraint back
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_categoryId_fkey`
FOREIGN KEY (`categoryId`) REFERENCES `Category`(`slug`) ON DELETE SET NULL ON UPDATE CASCADE;

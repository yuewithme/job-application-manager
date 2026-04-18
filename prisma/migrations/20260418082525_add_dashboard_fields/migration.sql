-- AlterTable
ALTER TABLE `application` ADD COLUMN `deadlineAt` DATETIME(3) NULL,
    ADD COLUMN `nextAction` VARCHAR(191) NULL,
    ADD COLUMN `nextActionAt` DATETIME(3) NULL;

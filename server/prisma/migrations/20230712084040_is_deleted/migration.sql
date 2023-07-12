-- AlterTable
ALTER TABLE `emailvalidationtokens` MODIFY `expiresAt` DATETIME(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 DAY);

-- AlterTable
ALTER TABLE `passwordresettokens` MODIFY `expiresAt` DATETIME(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 5 MINUTE);

-- AlterTable
ALTER TABLE `question` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `quiz` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

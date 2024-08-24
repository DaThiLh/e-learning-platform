/*
  Warnings:

  - The primary key for the `ShoppingCart` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Section` MODIFY `duration` TIME(0) NULL DEFAULT '00:00:00';

-- AlterTable
ALTER TABLE `ShoppingCart` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`learner_id`, `course_id`);

-- CreateIndex
CREATE INDEX `idx_date_and_tied_difference_on_promotional_programm` ON `PromotionalProgram`(`day_start`, `day_end`, `tier_difference`);

-- CreateIndex
CREATE INDEX `idx_date_and_tier_difference_on_promotional_programm` ON `PromotionalProgram`(`day_start`, `day_end`, `tier_difference`);

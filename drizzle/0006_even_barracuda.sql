CREATE TABLE `student_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`courseId` int NOT NULL,
	`courseSlug` varchar(255) NOT NULL,
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `student_enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `student_profiles` DROP INDEX `student_profiles_userId_unique`;--> statement-breakpoint
ALTER TABLE `student_profiles` ADD CONSTRAINT `student_profiles_cpf_unique` UNIQUE(`cpf`);--> statement-breakpoint
ALTER TABLE `student_profiles` DROP COLUMN `userId`;
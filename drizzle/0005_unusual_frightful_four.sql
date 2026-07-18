CREATE TABLE `student_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`cpf` varchar(14) NOT NULL,
	`address` varchar(255) NOT NULL,
	`number` varchar(20) NOT NULL,
	`neighborhood` varchar(120) NOT NULL,
	`city` varchar(120) NOT NULL,
	`cep` varchar(9) NOT NULL,
	`birthDate` varchar(10) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_profiles_userId_unique` UNIQUE(`userId`)
);

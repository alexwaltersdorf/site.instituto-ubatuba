CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`enrollmentId` int NOT NULL,
	`userName` varchar(255) NOT NULL,
	`courseName` varchar(500) NOT NULL,
	`institution` varchar(255) NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	`validationUrl` text,
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text NOT NULL,
	`institution` varchar(255) NOT NULL,
	`institutionLogo` text,
	`platform` varchar(255),
	`platformUrl` text NOT NULL,
	`category` enum('tecnologia','saude','administracao','educacao','meio_ambiente','esporte','idiomas','direito','ciencias','artes') NOT NULL,
	`duration` varchar(100),
	`level` enum('iniciante','intermediario','avancado') NOT NULL DEFAULT 'iniciante',
	`coverImage` text,
	`tags` text,
	`featured` boolean NOT NULL DEFAULT false,
	`active` boolean NOT NULL DEFAULT true,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`status` enum('inscrito','em_andamento','concluido','cancelado') NOT NULL DEFAULT 'inscrito',
	`progress` int DEFAULT 0,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`certificateId` int,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`)
);

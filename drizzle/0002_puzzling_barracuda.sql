CREATE TABLE `ethics_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`protocol` varchar(20) NOT NULL,
	`category` enum('corrupcao','assedio','fraude','conflito_interesses','desvio_recursos','discriminacao','outros') NOT NULL,
	`description` text NOT NULL,
	`evidence` text,
	`anonymous` boolean NOT NULL DEFAULT true,
	`contactEmail` varchar(320),
	`status` enum('recebido','em_analise','concluido','arquivado') NOT NULL DEFAULT 'recebido',
	`read` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ethics_reports_id` PRIMARY KEY(`id`),
	CONSTRAINT `ethics_reports_protocol_unique` UNIQUE(`protocol`)
);

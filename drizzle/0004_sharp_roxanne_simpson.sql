CREATE TABLE `superLikes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromUserId` int NOT NULL,
	`toUserId` int NOT NULL,
	`streak` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `superLikes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vetConsultations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`petId` int NOT NULL,
	`symptoms` text NOT NULL,
	`aiResponse` text,
	`severity` varchar(50),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `vetConsultations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `comments` ADD `audioUrl` varchar(512);--> statement-breakpoint
ALTER TABLE `comments` ADD `audioDuration` int;--> statement-breakpoint
ALTER TABLE `comments` ADD `sentiment` varchar(50);
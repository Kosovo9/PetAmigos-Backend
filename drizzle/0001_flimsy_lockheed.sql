CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int NOT NULL,
	`content` text NOT NULL,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userAId` int NOT NULL,
	`userBId` int NOT NULL,
	`connectionType` enum('following','friend','blocked') DEFAULT 'following',
	`mutual` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `connections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `healthRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`recordType` enum('vaccine','microchip','surgery','checkup','other') NOT NULL,
	`provider` varchar(255),
	`certificateUrl` varchar(512),
	`certificateHash` varchar(255),
	`verifiedByAi` boolean DEFAULT false,
	`verifiedAt` timestamp,
	`expiryDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `healthRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loveStories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`ownerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`photos` json,
	`likes` int DEFAULT 0,
	`commentsCount` int DEFAULT 0,
	`verified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loveStories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketplaceListings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`category` enum('food','toys','accessories','services','courses') NOT NULL,
	`price` decimal(10,2),
	`affiliateSource` enum('amazon','mercado_libre','temu','internal'),
	`affiliateLink` varchar(512),
	`commissionRate` float,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `marketplaceListings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petAId` int NOT NULL,
	`petBId` int NOT NULL,
	`compatibilityScore` float,
	`matchReason` json,
	`interactionCount` int DEFAULT 0,
	`lastInteraction` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`species` enum('dog','cat','bird','reptile','exotic','other') NOT NULL,
	`breed` varchar(255),
	`temperament` json,
	`dateOfBirth` timestamp,
	`gender` enum('male','female','unknown'),
	`location` varchar(255),
	`bio` text,
	`photos` json,
	`pedigreeData` json,
	`healthStatus` json,
	`avatarUrl` varchar(512),
	`personalityVector` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playdates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizerId` int NOT NULL,
	`petIds` json,
	`location` varchar(255),
	`scheduledAt` timestamp,
	`durationMinutes` int,
	`status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `playdates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tier` enum('free','basic','premium','enterprise') DEFAULT 'free',
	`stripeSubscriptionId` varchar(255),
	`status` enum('active','cancelled','expired') DEFAULT 'active',
	`renewsAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `location` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` varchar(512);--> statement-breakpoint
ALTER TABLE `users` ADD `preferences` json;
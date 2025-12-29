CREATE TABLE `communities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`avatarUrl` varchar(512),
	`bannerUrl` varchar(512),
	`ownerId` int NOT NULL,
	`settings` json,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `communities_id` PRIMARY KEY(`id`),
	CONSTRAINT `communities_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `communityMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`userId` int NOT NULL,
	`role` varchar(50) DEFAULT 'member',
	`joinedAt` timestamp DEFAULT (now()),
	CONSTRAINT `communityMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communityPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`communityId` int NOT NULL,
	`authorId` int NOT NULL,
	`content` text,
	`mediaUrls` json,
	`approved` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `communityPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `datingMatches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user1Id` int NOT NULL,
	`user2Id` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `datingMatches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `datingProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`breed` varchar(255) NOT NULL,
	`age` int NOT NULL,
	`gender` varchar(50) NOT NULL,
	`lookingFor` varchar(50) NOT NULL,
	`locationJson` json NOT NULL,
	`radius` int DEFAULT 50,
	`bio` text,
	`pics` json NOT NULL,
	`isVisible` boolean DEFAULT true,
	CONSTRAINT `datingProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `datingProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `moderationTickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`targetId` int NOT NULL,
	`targetType` varchar(50) NOT NULL,
	`reason` text NOT NULL,
	`status` varchar(50) DEFAULT 'pending',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `moderationTickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `swipes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromUserId` int NOT NULL,
	`toUserId` int NOT NULL,
	`liked` boolean NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `swipes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `openId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `clerkId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_clerkId_unique` UNIQUE(`clerkId`);
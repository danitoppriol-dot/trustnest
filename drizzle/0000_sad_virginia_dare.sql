CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int,
	`action` varchar(100) NOT NULL,
	`targetUserId` int,
	`targetType` varchar(50),
	`targetId` int,
	`details` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user1Id` int NOT NULL,
	`user2Id` int NOT NULL,
	`lastMessageAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`documentType` enum('government_id','selfie','property_photo','other') NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` text,
	`mimeType` varchar(100),
	`fileSize` int,
	`encryptionAlgorithm` varchar(50) DEFAULT 'AES-256-GCM',
	`encryptionKeyId` varchar(100),
	`expiresAt` timestamp,
	`verificationId` int,
	`propertyId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId1` int NOT NULL,
	`userId2` int NOT NULL,
	`compatibilityScore` tinyint,
	`budgetMatch` tinyint,
	`scheduleMatch` tinyint,
	`cleanlinessMatch` tinyint,
	`lifestyleMatch` tinyint,
	`petsMatch` tinyint,
	`explanation` text,
	`status` enum('active','archived','rejected') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matchingProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`budget` decimal(10,2),
	`sleepSchedule` varchar(50),
	`cleanlinessLevel` tinyint,
	`smokingPreference` varchar(50),
	`drinkingPreference` varchar(50),
	`petsAllowed` boolean,
	`lastMatchedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matchingProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `matchingProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`senderId` int NOT NULL,
	`content` longtext NOT NULL,
	`isRead` boolean DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`landlordId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext,
	`price` decimal(10,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'EUR',
	`country` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL,
	`address` varchar(255),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`roomCount` int,
	`bathroomCount` int,
	`squareMeters` int,
	`amenities` json,
	`status` enum('active','inactive','rented') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`age` int,
	`nationality` varchar(100),
	`languages` json,
	`budgetMin` decimal(10,2),
	`budgetMax` decimal(10,2),
	`workType` enum('student','remote','office','freelance','other'),
	`sleepSchedule` enum('early_bird','night_owl','flexible'),
	`cleanlinessLevel` tinyint,
	`smokingPreference` enum('no_smoking','occasional','regular'),
	`drinkingPreference` enum('no_drinking','occasional','regular'),
	`petsAllowed` boolean DEFAULT false,
	`petDetails` text,
	`socialLevel` tinyint,
	`interests` json,
	`bio` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `userProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`phoneNumber` varchar(20),
	`profilePictureUrl` text,
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`userType` enum('tenant','landlord','both') NOT NULL DEFAULT 'tenant',
	`loginMethod` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`trustBadge` enum('not_verified','verified') NOT NULL DEFAULT 'not_verified',
	`emailVerified` boolean DEFAULT false,
	`emailVerifiedAt` timestamp,
	`phoneVerified` boolean DEFAULT false,
	`phoneVerifiedAt` timestamp,
	`phoneOtpAttempts` int DEFAULT 0,
	`idVerified` boolean DEFAULT false,
	`idVerifiedAt` timestamp,
	`selfieVerified` boolean DEFAULT false,
	`selfieVerifiedAt` timestamp,
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`rejectionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `verifications_userId_unique` UNIQUE(`userId`)
);

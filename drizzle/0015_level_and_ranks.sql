CREATE TABLE `assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`level` integer,
	`score` integer NOT NULL,
	`passed` integer,
	`detail` text NOT NULL,
	`taken_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `assessments_kind_time` ON `assessments` (`kind`,`taken_at`);--> statement-breakpoint
CREATE TABLE `milestones` (
	`key` text PRIMARY KEY NOT NULL,
	`achieved_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skill_ratings` (
	`skill` text PRIMARY KEY NOT NULL,
	`rating` real NOT NULL,
	`spread` real NOT NULL,
	`answers` integer DEFAULT 0 NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);

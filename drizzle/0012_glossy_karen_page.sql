CREATE TABLE `flags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`subject` text NOT NULL,
	`detail` text,
	`reason` text NOT NULL,
	`note` text,
	`context` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`resolved_at` integer
);

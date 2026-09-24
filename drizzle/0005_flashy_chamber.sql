CREATE TABLE `practice_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`item` text NOT NULL,
	`correct` integer NOT NULL,
	`detail` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `practice_log_kind_time` ON `practice_log` (`kind`,`created_at`);
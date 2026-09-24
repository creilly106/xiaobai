CREATE TABLE `cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`word_id` integer NOT NULL,
	`deck_id` integer,
	`mode` text NOT NULL,
	`state` text DEFAULT 'new' NOT NULL,
	`stability` real DEFAULT 0 NOT NULL,
	`difficulty` real DEFAULT 0 NOT NULL,
	`due` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`last_review` integer,
	`elapsed_days` real DEFAULT 0 NOT NULL,
	`scheduled_days` real DEFAULT 0 NOT NULL,
	`reps` integer DEFAULT 0 NOT NULL,
	`lapses` integer DEFAULT 0 NOT NULL,
	`suspended` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`deck_id`) REFERENCES `decks`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cards_word_mode_unique` ON `cards` (`word_id`,`mode`);--> statement-breakpoint
CREATE TABLE `decks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`card_id` integer NOT NULL,
	`rating` integer NOT NULL,
	`reviewed_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`duration_ms` integer DEFAULT 0 NOT NULL,
	`prev_state` text,
	`next_due` integer NOT NULL,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`daily_new_limit` integer DEFAULT 15 NOT NULL,
	`daily_review_limit` integer DEFAULT 200 NOT NULL,
	`retention_target` real DEFAULT 0.9 NOT NULL,
	`streak_days` integer DEFAULT 0 NOT NULL,
	`last_study_date` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `words` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hanzi` text NOT NULL,
	`pinyin` text NOT NULL,
	`meaning` text NOT NULL,
	`hsk_level` integer,
	`frequency` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `words_hanzi_unique` ON `words` (`hanzi`);
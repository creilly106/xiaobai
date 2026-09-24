CREATE TABLE `sentence_tags` (
	`sentence_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`sentence_id`, `tag_id`),
	FOREIGN KEY (`sentence_id`) REFERENCES `sentences`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sentences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hanzi` text NOT NULL,
	`pinyin` text NOT NULL,
	`meaning` text NOT NULL,
	`difficulty` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sentences_hanzi_unique` ON `sentences` (`hanzi`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'custom' NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);--> statement-breakpoint
CREATE TABLE `word_tags` (
	`word_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`word_id`, `tag_id`),
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`word_id` integer,
	`sentence_id` integer,
	`deck_id` integer,
	`mode` text NOT NULL,
	`state` text DEFAULT 'new' NOT NULL,
	`stability` real DEFAULT 0 NOT NULL,
	`difficulty` real DEFAULT 0 NOT NULL,
	`due` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`last_review` integer,
	`elapsed_days` real DEFAULT 0 NOT NULL,
	`scheduled_days` real DEFAULT 0 NOT NULL,
	`learning_steps` integer DEFAULT 0 NOT NULL,
	`reps` integer DEFAULT 0 NOT NULL,
	`lapses` integer DEFAULT 0 NOT NULL,
	`suspended` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sentence_id`) REFERENCES `sentences`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`deck_id`) REFERENCES `decks`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_cards`("id", "word_id", "deck_id", "mode", "state", "stability", "difficulty", "due", "last_review", "elapsed_days", "scheduled_days", "learning_steps", "reps", "lapses", "suspended", "created_at") SELECT "id", "word_id", "deck_id", "mode", "state", "stability", "difficulty", "due", "last_review", "elapsed_days", "scheduled_days", "learning_steps", "reps", "lapses", "suspended", "created_at" FROM `cards`;--> statement-breakpoint
DROP TABLE `cards`;--> statement-breakpoint
ALTER TABLE `__new_cards` RENAME TO `cards`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `cards_word_mode_unique` ON `cards` (`word_id`,`mode`);--> statement-breakpoint
CREATE UNIQUE INDEX `cards_sentence_mode_unique` ON `cards` (`sentence_id`,`mode`);
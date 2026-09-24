CREATE TABLE `dictionary` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`simplified` text NOT NULL,
	`traditional` text NOT NULL,
	`pinyin` text NOT NULL,
	`pinyin_plain` text NOT NULL,
	`pinyin_tones` text NOT NULL,
	`definitions` text NOT NULL,
	`proper` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX `dictionary_simplified` ON `dictionary` (`simplified`);--> statement-breakpoint
CREATE INDEX `dictionary_pinyin_plain` ON `dictionary` (`pinyin_plain`);--> statement-breakpoint
CREATE INDEX `dictionary_pinyin_tones` ON `dictionary` (`pinyin_tones`);--> statement-breakpoint
ALTER TABLE `sentences` ADD `note` text;--> statement-breakpoint
ALTER TABLE `words` ADD `source` text DEFAULT 'hsk' NOT NULL;--> statement-breakpoint
ALTER TABLE `words` ADD `note` text;
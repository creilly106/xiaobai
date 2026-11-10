CREATE INDEX `cards_due_idx` ON `cards` (`due`);--> statement-breakpoint
CREATE INDEX `reviews_reviewed_at_idx` ON `reviews` (`reviewed_at`);--> statement-breakpoint
CREATE INDEX `reviews_card_idx` ON `reviews` (`card_id`);
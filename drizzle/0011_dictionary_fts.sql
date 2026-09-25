-- Full-text index over the dictionary's English definitions, for fast
-- English search (see src/lib/queries/lookup.ts). It stores no text of its
-- own: it indexes the dictionary table, and is rebuilt after each import.
CREATE VIRTUAL TABLE IF NOT EXISTS `dictionary_fts` USING fts5(definitions, content='dictionary', content_rowid='id', tokenize='porter unicode61');
--> statement-breakpoint
INSERT INTO `dictionary_fts`(`dictionary_fts`) VALUES('rebuild');

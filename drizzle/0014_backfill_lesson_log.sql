-- The daily goal now counts finished lessons from practice_log (kind 'lesson'),
-- logged each time one is finished. Copy in last week's finishes so the goal's
-- week view keeps them.
INSERT INTO `practice_log` (`kind`, `item`, `correct`, `created_at`)
SELECT 'lesson', `lesson_id`, 1, `completed_at`
FROM `lesson_progress`
WHERE `status` = 'done' AND `completed_at` > (unixepoch() - 8 * 86400) * 1000;

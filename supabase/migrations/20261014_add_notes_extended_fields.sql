-- Add new columns to notes table for PDF preview, study guide content, and action buttons
-- These columns are all OPTIONAL (nullable) to maintain backward compatibility

ALTER TABLE notes ADD COLUMN IF NOT EXISTS content TEXT DEFAULT NULL;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS preview_pdf_url TEXT DEFAULT NULL;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS action_button_text TEXT DEFAULT NULL;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS action_button_url TEXT DEFAULT NULL;

-- Add comment documentation
COMMENT ON COLUMN notes.content IS 'Optional AI-written rich Markdown chapter study guide with key concepts, solved questions, and board exam tips';
COMMENT ON COLUMN notes.preview_pdf_url IS 'Optional Google Drive PDF preview URL for on-page embedded viewer (auto-converted from share links)';
COMMENT ON COLUMN notes.action_button_text IS 'Optional custom action button label (e.g. Download Answer Key, View Solved Exercises)';
COMMENT ON COLUMN notes.action_button_url IS 'Optional custom action button target URL';

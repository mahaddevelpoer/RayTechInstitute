// Current robot preview entry. Run preview-codi-robot.mjs first.
// Visual/interaction checks only; this never loads speech models.
// Actual neural inference remains separately available in codi-audio-check.mjs.
await import('./check-codi-robot-preview.mjs');

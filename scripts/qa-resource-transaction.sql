-- Test real constraints and service-role permissions without committing content.
-- These tables were checked for external-action triggers before this test.
BEGIN;
SET LOCAL ROLE service_role;
DO $test$
BEGIN
  IF EXISTS(SELECT 1 FROM public.gazettes WHERE id='__qa_gazette_20261022') OR EXISTS(SELECT 1 FROM public.notes WHERE id='__qa_note_20261022') THEN
    RAISE EXCEPTION 'QA identity already exists; refusing to overwrite it';
  END IF;
  INSERT INTO public.gazettes(id,title,board,class_slug,year,session,pdf_url,content,action_button_text,action_button_url)
  VALUES('__qa_gazette_20261022','Uncommitted QA fixture','BISE Lahore','11th-class',2026,'1st Annual','https://www.biselahore.com/qa-test.pdf','QA content','Open document','https://www.biselahore.com/qa-test.pdf');
  INSERT INTO public.notes(id,title,class_slug,subject_slug,chapter_number,chapter_title,pdf_url,description,file_size,download_count,last_updated,content,preview_pdf_url,action_button_text,action_button_url)
  VALUES('__qa_note_20261022','Uncommitted QA fixture','11th-class','computer-science',1,'QA chapter','https://cssaspirants.pk/wp-content/uploads/2026/07/computer-science-2026.pdf','QA description','PDF',0,'2026-10-22','QA content',null,null,null);
  UPDATE public.gazettes SET title='Updated QA fixture' WHERE id='__qa_gazette_20261022';
  UPDATE public.notes SET title='Updated QA fixture' WHERE id='__qa_note_20261022';
  IF NOT EXISTS(SELECT 1 FROM public.gazettes WHERE id='__qa_gazette_20261022' AND title='Updated QA fixture' AND action_button_text='Open document') THEN RAISE EXCEPTION 'Gazette round trip failed'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.notes WHERE id='__qa_note_20261022' AND title='Updated QA fixture' AND content='QA content') THEN RAISE EXCEPTION 'Note round trip failed'; END IF;
  DELETE FROM public.gazettes WHERE id='__qa_gazette_20261022';
  DELETE FROM public.notes WHERE id='__qa_note_20261022';
  IF EXISTS(SELECT 1 FROM public.gazettes WHERE id='__qa_gazette_20261022') OR EXISTS(SELECT 1 FROM public.notes WHERE id='__qa_note_20261022') THEN RAISE EXCEPTION 'QA delete failed'; END IF;
END
$test$;
ROLLBACK;
SELECT 'gazette-and-note-create-read-edit-delete-passed-with-rollback' AS result;

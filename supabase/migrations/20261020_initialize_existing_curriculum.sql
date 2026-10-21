-- Move the existing visible starter directory into the CMS once, without
-- replacing administrator records. Resource tables remain untouched.
INSERT INTO public.classes (id, slug, title, numeric_grade, description, is_active)
VALUES
 ('class-11', '11th-class', '11th Class (1st Year HSSC-I)', 11, 'Chapter notes, MCQs and past papers for Intermediate Part I.', true),
 ('class-12', '12th-class', '12th Class (2nd Year HSSC-II)', 12, 'Chapter notes, MCQs and past papers for Intermediate Part II.', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.subjects (id, class_slug, slug, title, icon_name, description)
SELECT seed.* FROM (VALUES
 ('subj-11-cs', '11th-class', 'computer-science', 'Computer Science', 'Code', 'Computing concepts and programming practice. Follow your current board textbook.'),
 ('subj-11-phy', '11th-class', 'physics', 'Physics', 'Atom', 'First-year physics study resources.'),
 ('subj-11-math', '11th-class', 'mathematics', 'Mathematics', 'Calculator', 'First-year mathematics study resources.'),
 ('subj-12-cs', '12th-class', 'computer-science', 'Computer Science', 'Code', 'Second-year computer science study resources.'),
 ('subj-12-phy', '12th-class', 'physics', 'Physics', 'Atom', 'Second-year physics study resources.'),
 ('subj-12-chem', '12th-class', 'chemistry', 'Chemistry', 'FlaskConical', 'Second-year chemistry study resources.')
) AS seed(id, class_slug, slug, title, icon_name, description)
WHERE EXISTS (SELECT 1 FROM public.classes c WHERE c.slug = seed.class_slug)
AND NOT EXISTS (SELECT 1 FROM public.subjects s WHERE s.class_slug = seed.class_slug AND s.slug = seed.slug)
ON CONFLICT DO NOTHING;

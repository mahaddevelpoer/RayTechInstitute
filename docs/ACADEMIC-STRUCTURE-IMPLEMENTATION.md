# Academic structure implementation

Status: published successfully. Hosting workflow 41685574455 deployed commit 97c014d622e5dd2dafe3ea9c3500328fa9ca738f; database migration and secure-dispatch version 62 are deployed. Article releases are separate.

## Confirmed architecture

- Public academic content and programming lessons remain build-time static pages.
- Program navigation does not query Supabase from visitors' browsers.
- Existing class, subject, book, chapter, topic, note and MCQ identities are retained.
- Student private progress and results remain separate from the public catalog.
- The supplied UML is a desired organization, not proof of an official syllabus or implemented teacher permissions.

## Completed locally

- [x] Optional program name and semester number on academic classes.
- [x] Admin create/edit fields, normalized placement validation and duplicate-semester warning.
- [x] Server validation before storage; database constraints prevent partial or duplicate placements.
- [x] Admin refresh and static export retain program and semester metadata.
- [x] Static class directory groups published semesters under programs in numerical order.
- [x] Subjects retain their existing class routes; semester context appears on the subject directory.
- [x] Ungrouped legacy resources remain accessible without guessing their semester.
- [x] Programming tracks retain their separate course/module/lesson structure.
- [x] Failed class saves no longer update the local class list before server confirmation.

## Required before release

- [x] User confirmed existing DIT Computer Networking and MS Office belong to Semester 1. The local migration assigns the existing `dit-intermediate` class to DIT Semester 1 without changing any resource references. Production placement was applied after the user authorised this release.
- [ ] Confirm the official remaining syllabus before creating additional semesters or subjects. Do not invent four semesters with five subjects from the diagram alone.
- [x] With release authorization, apply migration `20261103160000_academic_program_semesters.sql` before deploying admin and Edge changes. Existing fields are nullable, so legacy content is preserved.
- [x] Deploy the updated secure-dispatch dependency and frontend after migration. New form fields have the required database columns.
- [x] Rebuild the static catalog and verify the actual export before release.
- [ ] A real signed-in administrator save using the user's Google session was not performed. Server validation, migration read-back and anonymous access rejection were verified; these do not substitute for a signed-in UI check.

## Separate work, not claimed complete

Teacher assignment/grading permissions, enrollment policy and certificates shown in the diagram need their own implementation and acceptance checks. No teacher access has been granted and no new role or certificate is silently advertised as available.

## Local checks

Run sequentially to limit memory use:

```text
node --max-old-space-size=256 --test --test-concurrency=1 scripts/academic-structure.test.mjs scripts/resource-reliability.test.mjs
node --max-old-space-size=256 --test scripts/academic-migration.test.mjs
node --max-old-space-size=256 scripts/check-academic-types.mjs
```

The migration was applied transactionally with a private backup and read-back checks. Four classes, seven subjects, four notes and 265 MCQs remain; existing class identities and all legacy fields are preserved. DIT is Semester 1. Secure-dispatch version 62 retains Firebase administrator verification. Anonymous catalog access is denied with HTTP 401 and the verified custom-domain origin is allowed.

Full-project TypeScript checking passed on GitHub in the successful release workflow. The local machine was kept on focused checks after its earlier capped full-project attempt ran out of memory.

Focused validation covered migration replay, legacy subject references, duplicate placements, old-client compatibility and notes/MCQ regressions. The complete source checks, static build, academic browser navigation and existing resource-page browser checks passed on GitHub. Screenshots were reviewed at mobile/light and desktop/charcoal sizes.

The successful workflow verified deployed pages against the exact export. Additional direct live requests returned HTTP 200 for the classes directory, existing DIT subject, chapter notes and chapter MCQs routes. The public classes HTML contains both Academic Programs and Programming Courses.

## Card release checks

- Whole-card click targets keep child links independent.
- Long descriptions are clamped to three lines.
- Program subjects begin at the earliest published semester without duplicate subject cards.
- The interactive classes directory receives only its small public navigation props from the server, rather than importing the full article/question catalog into its client module.
- The GitHub workflow runs full application checks, migration replay and mobile/desktop light/charcoal browser flows against the actual export before Hosting publication.

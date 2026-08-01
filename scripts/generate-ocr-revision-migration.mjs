/* global console, process */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ocrRevisionTopics } from './ocr-j277-revision-content.mjs';

const migrationPath = process.argv[2];
if (!migrationPath) {
  throw new Error('Pass the migration file path to generate.');
}

function sqlString(value) {
  return `'${value.replaceAll("'", "''")}'`;
}

function sqlArray(values) {
  if (!values.length) return `'{}'::text[]`;
  return `array[${values.map(sqlString).join(', ')}]::text[]`;
}

const contentRows = ocrRevisionTopics
  .map(
    (topic) =>
      `    (${sqlString(topic.topicSlug)}, ${sqlArray(topic.objectives)}, ${sqlArray(topic.supplementKeys)})`,
  )
  .join(',\n');

const sql = `alter table public.topics
  add column if not exists revision_objectives text[] not null default '{}',
  add column if not exists revision_supplement_keys text[] not null default '{}';

with revision_content (topic_slug, revision_objectives, revision_supplement_keys) as (
  values
${contentRows}
)
update public.topics as topic
set
  revision_objectives = revision_content.revision_objectives,
  revision_supplement_keys = revision_content.revision_supplement_keys,
  updated_at = now()
from revision_content, public.units as unit, public.subjects as subject
where topic.slug = revision_content.topic_slug
  and topic.unit_id = unit.id
  and unit.subject_id = subject.id
  and subject.slug = 'ocr-gcse-computer-science';
`;

const resolvedMigrationPath = resolve(process.cwd(), migrationPath);
writeFileSync(resolvedMigrationPath, sql, 'utf8');
console.log(`Generated OCR revision backfill for ${ocrRevisionTopics.length} topics in ${resolvedMigrationPath}.`);

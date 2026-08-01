begin;

create extension if not exists pgtap with schema extensions;

select plan(12);

select has_column('public', 'topics', 'revision_objectives', 'topics has revision objectives');
select has_column('public', 'topics', 'revision_supplement_keys', 'topics has revision supplement keys');

select is(
  (select column_default from information_schema.columns where table_schema = 'public' and table_name = 'topics' and column_name = 'revision_objectives'),
  '''{}''::text[]',
  'revision objectives default to an empty array'
);

select is(
  (select column_default from information_schema.columns where table_schema = 'public' and table_name = 'topics' and column_name = 'revision_supplement_keys'),
  '''{}''::text[]',
  'revision supplement keys default to an empty array'
);

select ok(
  (select bool_and(is_nullable = 'NO') from information_schema.columns where table_schema = 'public' and table_name = 'topics' and column_name in ('revision_objectives', 'revision_supplement_keys')),
  'revision content columns are not nullable'
);

select is(
  (
    select count(*)::integer
    from public.topics topic
    join public.units unit on unit.id = topic.unit_id
    join public.subjects subject on subject.id = unit.subject_id
    where subject.slug = 'ocr-gcse-computer-science'
  ),
  41,
  'the OCR hierarchy contains exactly 41 topics'
);

select is(
  (
    select count(*)::integer
    from public.topics topic
    join public.units unit on unit.id = topic.unit_id
    join public.subjects subject on subject.id = unit.subject_id
    where subject.slug = 'ocr-gcse-computer-science'
      and cardinality(topic.revision_objectives) = 0
  ),
  0,
  'every OCR topic has revision objectives'
);

select is(
  (
    select count(*)::integer
    from public.topics topic
    cross join lateral unnest(topic.revision_objectives) objective
    join public.units unit on unit.id = topic.unit_id
    join public.subjects subject on subject.id = unit.subject_id
    where subject.slug = 'ocr-gcse-computer-science'
      and btrim(objective) = ''
  ),
  0,
  'OCR objective arrays contain no blank entries'
);

select ok(
  (
    select bool_and(cardinality(topic.revision_objectives) = 0 and cardinality(topic.revision_supplement_keys) = 0)
    from public.topics topic
    join public.units unit on unit.id = topic.unit_id
    join public.subjects subject on subject.id = unit.subject_id
    where subject.slug = 'pearson-btec-level-3-extended-certificate-it-aaq'
  ),
  'BTEC topics retain empty revision content'
);

select is(
  (
    select array_agg(topic.topic_name order by topic.topic_name)
    from public.topics topic
    join public.units unit on unit.id = topic.unit_id
    join public.subjects subject on subject.id = unit.subject_id
    where subject.slug = 'ocr-gcse-computer-science'
      and cardinality(topic.revision_supplement_keys) > 0
  ),
  array['4.3 Logic gates and Truth tables', '7.4 Flowcharts']::text[],
  'only topics 4.3 and 7.4 have revision supplements'
);

select ok(
  exists(select 1 from public.topics where topic_name = '4.3 Logic gates and Truth tables' and revision_supplement_keys = array['logic_gates_reference'])
    and exists(select 1 from public.topics where topic_name = '7.4 Flowcharts' and revision_supplement_keys = array['flowchart_symbols_reference']),
  '4.3 and 7.4 have their intended supplement keys'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000101', true);

select is(
  (
    select count(*)::integer
    from public.topics topic
    join public.units unit on unit.id = topic.unit_id
    join public.subjects subject on subject.id = unit.subject_id
    where subject.slug = 'ocr-gcse-computer-science'
      and cardinality(topic.revision_objectives) > 0
  ),
  41,
  'an authenticated student can read all OCR objectives through topic RLS'
);

select * from finish();

rollback;

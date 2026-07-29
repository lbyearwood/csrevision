with btec_tests as (
  insert into public.tests (
    topic_id, slug, test_title, test_description, default_mode,
    default_time_limit_seconds, default_feedback_policy, randomise_questions,
    shuffle_options, question_pool_enabled, marking_method, status, created_by
  )
  select
    topic.id,
    'essential-concepts',
    topic.topic_name || ': Essential concepts',
    'A short practice test covering the essential concepts in ' || topic.topic_name || '.',
    'practice',
    300,
    'score_and_summary',
    true,
    true,
    false,
    'auto_marked',
    'published',
    null
  from public.topics as topic
  join public.units as unit on unit.id = topic.unit_id
  where unit.subject_id = '50000000-0000-4000-8000-000000000002'
  on conflict (topic_id, slug) do update
  set
    test_title = excluded.test_title,
    test_description = excluded.test_description,
    default_time_limit_seconds = excluded.default_time_limit_seconds,
    default_feedback_policy = excluded.default_feedback_policy,
    marking_method = excluded.marking_method,
    status = excluded.status,
    updated_at = now()
  returning id, topic_id
),
btec_versions as (
  insert into public.test_versions (
    test_id, version_number, status, total_marks, estimated_duration_seconds,
    published_at, published_by, version_notes
  )
  select
    test.id,
    1,
    'published',
    1,
    300,
    now(),
    null,
    'Initial local BTEC practice resource.'
  from btec_tests as test
  on conflict (test_id, version_number) do update
  set
    status = excluded.status,
    total_marks = excluded.total_marks,
    estimated_duration_seconds = excluded.estimated_duration_seconds,
    published_at = excluded.published_at,
    published_by = excluded.published_by,
    version_notes = excluded.version_notes,
    updated_at = now()
  returning id, test_id
),
btec_questions as (
  insert into public.questions (
    test_version_id, question_order, question_type, question_text, max_marks,
    difficulty, correct_answer, mark_scheme, accepted_keywords,
    common_misconceptions, student_explanation
  )
  select
    version.id,
    1,
    'multiple_choice',
    'Which BTEC content topic is the focus of this practice test?',
    1,
    'foundation',
    to_jsonb(topic.topic_name),
    'Award one mark for identifying the named BTEC content topic.',
    array[topic.topic_name],
    array['Selecting a neighbouring specification topic rather than the named topic.'],
    'This test checks the essential concepts for ' || topic.topic_name || '.'
  from btec_versions as version
  join btec_tests as test on test.id = version.test_id
  join public.topics as topic on topic.id = test.topic_id
  on conflict (test_version_id, question_order) do update
  set
    question_text = excluded.question_text,
    max_marks = excluded.max_marks,
    difficulty = excluded.difficulty,
    correct_answer = excluded.correct_answer,
    mark_scheme = excluded.mark_scheme,
    accepted_keywords = excluded.accepted_keywords,
    common_misconceptions = excluded.common_misconceptions,
    student_explanation = excluded.student_explanation,
    updated_at = now()
  returning id, test_version_id
)
insert into public.question_options (question_id, option_text, is_correct, option_order, feedback)
select question.id, option.option_text, option.is_correct, option.option_order, option.feedback
from btec_questions as question
join public.test_versions as version on version.id = question.test_version_id
join public.tests as test on test.id = version.test_id
join public.topics as topic on topic.id = test.topic_id
cross join lateral (
  values
    (topic.topic_name, true, 1, 'Correct - this is the named topic.'),
    ('A different BTEC content topic', false, 2, 'Review the topic heading before you continue.'),
    ('An unrelated course activity', false, 3, 'This does not match the topic heading.'),
    ('A teacher administration task', false, 4, 'This is not a student content topic.')
) as option(option_text, is_correct, option_order, feedback);

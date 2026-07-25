-- Local development seed data for Codex agents.
-- This file is intentionally deterministic so `npx.cmd supabase db reset --local`
-- can recreate the same teacher, students, class, course, tests, and dashboard data.
-- Do not copy these credentials or IDs into production.

set check_function_bodies = off;

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_token_current,
  reauthentication_token,
  phone_change,
  phone_change_token,
  email_change_confirm_status,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_sso_user,
  is_anonymous
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000001',
    'authenticated',
    'authenticated',
    'j.doe@school.example',
    extensions.crypt('Localdev1!', extensions.gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    '{"provider":"email","providers":["email"],"app_role":"teacher"}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000101',
    'authenticated',
    'authenticated',
    'asingh5827@students.local',
    extensions.crypt('Localdev1!', extensions.gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    '{"provider":"email","providers":["email"],"app_role":"student"}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000102',
    'authenticated',
    'authenticated',
    'rmehta4120@students.local',
    extensions.crypt('Localdev1!', extensions.gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    '{"provider":"email","providers":["email"],"app_role":"student"}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000103',
    'authenticated',
    'authenticated',
    'dpatel9144@students.local',
    extensions.crypt('Localdev1!', extensions.gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    '{"provider":"email","providers":["email"],"app_role":"student"}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000104',
    'authenticated',
    'authenticated',
    'vkumar3021@students.local',
    extensions.crypt('Localdev1!', extensions.gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    '{"provider":"email","providers":["email"],"app_role":"student"}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000105',
    'authenticated',
    'authenticated',
    'mkhan7712@students.local',
    extensions.crypt('Localdev1!', extensions.gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    '{"provider":"email","providers":["email"],"app_role":"student"}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    false,
    false
  )
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  confirmation_token = excluded.confirmation_token,
  recovery_token = excluded.recovery_token,
  email_change_token_new = excluded.email_change_token_new,
  email_change = excluded.email_change,
  email_change_token_current = excluded.email_change_token_current,
  reauthentication_token = excluded.reauthentication_token,
  phone_change = excluded.phone_change,
  phone_change_token = excluded.phone_change_token,
  email_change_confirm_status = excluded.email_change_confirm_status,
  raw_app_meta_data = excluded.raw_app_meta_data,
  updated_at = now();

insert into auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '01000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    jsonb_build_object('sub', '00000000-0000-4000-8000-000000000001', 'email', 'j.doe@school.example', 'email_verified', true, 'phone_verified', false),
    'email',
    now(),
    now(),
    now()
  ),
  (
    '01000000-0000-4000-8000-000000000101',
    '00000000-0000-4000-8000-000000000101',
    '00000000-0000-4000-8000-000000000101',
    jsonb_build_object('sub', '00000000-0000-4000-8000-000000000101', 'email', 'asingh5827@students.local', 'email_verified', true, 'phone_verified', false),
    'email',
    now(),
    now(),
    now()
  ),
  (
    '01000000-0000-4000-8000-000000000102',
    '00000000-0000-4000-8000-000000000102',
    '00000000-0000-4000-8000-000000000102',
    jsonb_build_object('sub', '00000000-0000-4000-8000-000000000102', 'email', 'rmehta4120@students.local', 'email_verified', true, 'phone_verified', false),
    'email',
    now(),
    now(),
    now()
  ),
  (
    '01000000-0000-4000-8000-000000000103',
    '00000000-0000-4000-8000-000000000103',
    '00000000-0000-4000-8000-000000000103',
    jsonb_build_object('sub', '00000000-0000-4000-8000-000000000103', 'email', 'dpatel9144@students.local', 'email_verified', true, 'phone_verified', false),
    'email',
    now(),
    now(),
    now()
  ),
  (
    '01000000-0000-4000-8000-000000000104',
    '00000000-0000-4000-8000-000000000104',
    '00000000-0000-4000-8000-000000000104',
    jsonb_build_object('sub', '00000000-0000-4000-8000-000000000104', 'email', 'vkumar3021@students.local', 'email_verified', true, 'phone_verified', false),
    'email',
    now(),
    now(),
    now()
  ),
  (
    '01000000-0000-4000-8000-000000000105',
    '00000000-0000-4000-8000-000000000105',
    '00000000-0000-4000-8000-000000000105',
    jsonb_build_object('sub', '00000000-0000-4000-8000-000000000105', 'email', 'mkhan7712@students.local', 'email_verified', true, 'phone_verified', false),
    'email',
    now(),
    now(),
    now()
  )
on conflict (provider_id, provider) do update
set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  updated_at = now();

insert into public.profiles (id, auth_user_id, role, display_name, username, account_status)
values
  ('10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'teacher', 'J. Doe', null, 'active'),
  ('10000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000101', 'student', 'A Singh', 'asingh5827', 'active'),
  ('10000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000102', 'student', 'R Mehta', 'rmehta4120', 'active'),
  ('10000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000103', 'student', 'D Patel', 'dpatel9144', 'active'),
  ('10000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000104', 'student', 'V Kumar', 'vkumar3021', 'active'),
  ('10000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000105', 'student', 'M Khan', 'mkhan7712', 'active')
on conflict (id) do update
set
  auth_user_id = excluded.auth_user_id,
  role = excluded.role,
  display_name = excluded.display_name,
  username = excluded.username,
  account_status = excluded.account_status,
  updated_at = now();

insert into public.teacher_profiles (id, profile_id, email)
values ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'j.doe@school.example')
on conflict (id) do update
set
  profile_id = excluded.profile_id,
  email = excluded.email,
  updated_at = now();

insert into public.student_profiles (
  id,
  profile_id,
  first_name,
  surname,
  student_id,
  internal_auth_email,
  account_status,
  created_by
)
values
  ('30000000-0000-4000-8000-000000000101', '10000000-0000-4000-8000-000000000101', 'Ananya', 'Singh', '2587', 'asingh5827@students.local', 'active', '10000000-0000-4000-8000-000000000001'),
  ('30000000-0000-4000-8000-000000000102', '10000000-0000-4000-8000-000000000102', 'Rohan', 'Mehta', '2410', 'rmehta4120@students.local', 'active', '10000000-0000-4000-8000-000000000001'),
  ('30000000-0000-4000-8000-000000000103', '10000000-0000-4000-8000-000000000103', 'Diya', 'Patel', '2468', 'dpatel9144@students.local', 'active', '10000000-0000-4000-8000-000000000001'),
  ('30000000-0000-4000-8000-000000000104', '10000000-0000-4000-8000-000000000104', 'Vikram', 'Kumar', '2390', 'vkumar3021@students.local', 'active', '10000000-0000-4000-8000-000000000001'),
  ('30000000-0000-4000-8000-000000000105', '10000000-0000-4000-8000-000000000105', 'Maya', 'Khan', '2472', 'mkhan7712@students.local', 'active', '10000000-0000-4000-8000-000000000001')
on conflict (id) do update
set
  profile_id = excluded.profile_id,
  first_name = excluded.first_name,
  surname = excluded.surname,
  student_id = excluded.student_id,
  internal_auth_email = excluded.internal_auth_email,
  account_status = excluded.account_status,
  created_by = excluded.created_by,
  updated_at = now();

insert into public.classes (id, slug, class_name, academic_year, year_group, owner_teacher_id, status)
values
  ('40000000-0000-4000-8000-000000000001', '8a-computing', '8A Computing', '2026/27', '8', '20000000-0000-4000-8000-000000000001', 'active'),
  ('40000000-0000-4000-8000-000000000002', '9b-computer-science', '9B Computer Science', '2026/27', '9', '20000000-0000-4000-8000-000000000001', 'active')
on conflict (id) do update
set
  slug = excluded.slug,
  class_name = excluded.class_name,
  academic_year = excluded.academic_year,
  year_group = excluded.year_group,
  owner_teacher_id = excluded.owner_teacher_id,
  status = excluded.status,
  updated_at = now();

insert into public.class_memberships (id, class_id, student_id, status)
values
  ('41000000-0000-4000-8000-000000000101', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000101', 'active'),
  ('41000000-0000-4000-8000-000000000102', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000102', 'active'),
  ('41000000-0000-4000-8000-000000000103', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000103', 'active'),
  ('41000000-0000-4000-8000-000000000104', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000104', 'active'),
  ('41000000-0000-4000-8000-000000000105', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000105', 'active')
on conflict (id) do update
set
  class_id = excluded.class_id,
  student_id = excluded.student_id,
  status = excluded.status,
  updated_at = now();

insert into public.subjects (id, slug, subject_name, exam_board, course_code, year_group, description, status, display_order)
values (
  '50000000-0000-4000-8000-000000000001',
  'ocr-gcse-computer-science',
  'OCR GCSE Computer Science',
  'OCR',
  'J277',
  'GCSE',
  'GCSE computer science revision and assessment content.',
  'active',
  1
)
on conflict (id) do update
set
  slug = excluded.slug,
  subject_name = excluded.subject_name,
  exam_board = excluded.exam_board,
  course_code = excluded.course_code,
  year_group = excluded.year_group,
  description = excluded.description,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.units (id, subject_id, slug, unit_name, unit_code, description, status, display_order)
values
  ('51000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', 'hardware', 'Hardware', '1.1', 'Systems architecture, memory, storage, and networks.', 'active', 1),
  ('51000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000001', 'programming', 'Programming', '2.1', 'Programming fundamentals and algorithms.', 'active', 2)
on conflict (id) do update
set
  subject_id = excluded.subject_id,
  slug = excluded.slug,
  unit_name = excluded.unit_name,
  unit_code = excluded.unit_code,
  description = excluded.description,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.topics (id, unit_id, slug, topic_name, description, keywords, status, display_order)
values
  ('52000000-0000-4000-8000-000000000001', '51000000-0000-4000-8000-000000000001', 'cpu', 'CPU', 'CPU components and the fetch-decode-execute cycle.', array['control unit', 'ALU', 'registers', 'cache', 'fetch-decode-execute'], 'active', 1),
  ('52000000-0000-4000-8000-000000000002', '51000000-0000-4000-8000-000000000001', 'memory', 'Memory', 'RAM, ROM, cache and virtual memory.', array['RAM', 'ROM', 'virtual memory'], 'active', 2),
  ('52000000-0000-4000-8000-000000000003', '51000000-0000-4000-8000-000000000002', 'searching-algorithms', 'Searching Algorithms', 'Linear search and binary search.', array['linear search', 'binary search'], 'active', 1)
on conflict (id) do update
set
  unit_id = excluded.unit_id,
  slug = excluded.slug,
  topic_name = excluded.topic_name,
  description = excluded.description,
  keywords = excluded.keywords,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.tests (
  id,
  topic_id,
  slug,
  test_title,
  test_description,
  default_mode,
  default_time_limit_seconds,
  default_feedback_policy,
  randomise_questions,
  shuffle_options,
  status,
  created_by
)
values
  ('53000000-0000-4000-8000-000000000001', '52000000-0000-4000-8000-000000000001', 'cpu-knowledge-check', 'CPU Knowledge Check', 'Checks CPU components and the fetch-decode-execute cycle.', 'practice', 900, 'full_review', true, true, 'published', '10000000-0000-4000-8000-000000000001'),
  ('53000000-0000-4000-8000-000000000002', '52000000-0000-4000-8000-000000000001', 'cpu-timed-assessment', 'CPU Timed Assessment', 'One-attempt assessment for CPU topic understanding.', 'assigned', 1200, 'score_only', true, true, 'published', '10000000-0000-4000-8000-000000000001')
on conflict (id) do update
set
  topic_id = excluded.topic_id,
  slug = excluded.slug,
  test_title = excluded.test_title,
  test_description = excluded.test_description,
  default_mode = excluded.default_mode,
  default_time_limit_seconds = excluded.default_time_limit_seconds,
  default_feedback_policy = excluded.default_feedback_policy,
  randomise_questions = excluded.randomise_questions,
  shuffle_options = excluded.shuffle_options,
  status = excluded.status,
  created_by = excluded.created_by,
  updated_at = now();

insert into public.test_versions (id, test_id, version_number, status, total_marks, estimated_duration_seconds, published_at, published_by, version_notes)
values
  ('54000000-0000-4000-8000-000000000001', '53000000-0000-4000-8000-000000000001', 1, 'published', 4, 900, now(), '10000000-0000-4000-8000-000000000001', 'Local seed practice version.'),
  ('54000000-0000-4000-8000-000000000002', '53000000-0000-4000-8000-000000000002', 1, 'published', 4, 1200, now(), '10000000-0000-4000-8000-000000000001', 'Local seed assigned version.')
on conflict (id) do nothing;

insert into public.questions (
  id,
  test_version_id,
  question_order,
  question_type,
  question_text,
  max_marks,
  correct_answer,
  accepted_keywords,
  student_explanation
)
values
  ('55000000-0000-4000-8000-000000000001', '54000000-0000-4000-8000-000000000001', 1, 'multiple_choice', 'Which CPU component manages the execution of instructions?', 1, to_jsonb('56000000-0000-4000-8000-000000000001'::text), '{}', 'The Control Unit coordinates fetching, decoding and executing instructions.'),
  ('55000000-0000-4000-8000-000000000002', '54000000-0000-4000-8000-000000000001', 2, 'multiple_choice', 'Which CPU component performs arithmetic and logic operations?', 1, to_jsonb('56000000-0000-4000-8000-000000000005'::text), '{}', 'The ALU performs arithmetic and logical comparisons.'),
  ('55000000-0000-4000-8000-000000000003', '54000000-0000-4000-8000-000000000001', 3, 'true_false', 'Cache memory is usually faster than main memory.', 1, to_jsonb('56000000-0000-4000-8000-000000000009'::text), '{}', 'Cache is small, fast memory close to the CPU.'),
  ('55000000-0000-4000-8000-000000000004', '54000000-0000-4000-8000-000000000001', 4, 'short_fixed', 'Name the cycle where the CPU fetches, decodes and executes instructions.', 1, to_jsonb('fetch-decode-execute'::text), array['fetch decode execute', 'fetch-decode-execute cycle'], 'This is the fetch-decode-execute cycle.'),
  ('55000000-0000-4000-8000-000000000011', '54000000-0000-4000-8000-000000000002', 1, 'multiple_choice', 'What is the main purpose of the Control Unit?', 1, to_jsonb('56000000-0000-4000-8000-000000000011'::text), '{}', 'The Control Unit directs the operation of the CPU.'),
  ('55000000-0000-4000-8000-000000000012', '54000000-0000-4000-8000-000000000002', 2, 'multiple_choice', 'A higher clock speed usually means the CPU can...', 1, to_jsonb('56000000-0000-4000-8000-000000000015'::text), '{}', 'Clock speed affects how many instruction cycles can happen each second.'),
  ('55000000-0000-4000-8000-000000000013', '54000000-0000-4000-8000-000000000002', 3, 'true_false', 'The CPU stores files permanently when the computer is off.', 1, to_jsonb('56000000-0000-4000-8000-000000000020'::text), '{}', 'Permanent file storage is handled by storage devices, not the CPU.'),
  ('55000000-0000-4000-8000-000000000014', '54000000-0000-4000-8000-000000000002', 4, 'short_fixed', 'Name one register used during the fetch-decode-execute cycle.', 1, to_jsonb('program counter'::text), array['pc', 'memory address register', 'mar', 'memory data register', 'mdr', 'current instruction register', 'cir'], 'Registers used in this cycle include the Program Counter, MAR, MDR and CIR.')
on conflict (id) do nothing;

insert into public.question_options (id, question_id, option_text, is_correct, option_order, feedback)
values
  ('56000000-0000-4000-8000-000000000001', '55000000-0000-4000-8000-000000000001', 'Control Unit', true, 1, 'Correct.'),
  ('56000000-0000-4000-8000-000000000002', '55000000-0000-4000-8000-000000000001', 'Hard Disk', false, 2, 'A hard disk is storage, not a CPU control component.'),
  ('56000000-0000-4000-8000-000000000003', '55000000-0000-4000-8000-000000000001', 'RAM', false, 3, 'RAM is main memory.'),
  ('56000000-0000-4000-8000-000000000004', '55000000-0000-4000-8000-000000000001', 'Monitor', false, 4, 'A monitor is an output device.'),
  ('56000000-0000-4000-8000-000000000005', '55000000-0000-4000-8000-000000000002', 'Arithmetic Logic Unit', true, 1, 'Correct.'),
  ('56000000-0000-4000-8000-000000000006', '55000000-0000-4000-8000-000000000002', 'Cache', false, 2, 'Cache is fast memory.'),
  ('56000000-0000-4000-8000-000000000007', '55000000-0000-4000-8000-000000000002', 'ROM', false, 3, 'ROM stores startup instructions.'),
  ('56000000-0000-4000-8000-000000000008', '55000000-0000-4000-8000-000000000002', 'Address bus', false, 4, 'The address bus carries memory addresses.'),
  ('56000000-0000-4000-8000-000000000009', '55000000-0000-4000-8000-000000000003', 'True', true, 1, 'Correct.'),
  ('56000000-0000-4000-8000-000000000010', '55000000-0000-4000-8000-000000000003', 'False', false, 2, 'Cache is usually faster than main memory.'),
  ('56000000-0000-4000-8000-000000000011', '55000000-0000-4000-8000-000000000011', 'Directs the operation of the CPU', true, 1, 'Correct.'),
  ('56000000-0000-4000-8000-000000000012', '55000000-0000-4000-8000-000000000011', 'Stores long-term files', false, 2, 'Long-term files are kept in storage.'),
  ('56000000-0000-4000-8000-000000000013', '55000000-0000-4000-8000-000000000011', 'Displays output to the user', false, 3, 'A display device handles output.'),
  ('56000000-0000-4000-8000-000000000014', '55000000-0000-4000-8000-000000000011', 'Cools the processor', false, 4, 'Cooling is handled by cooling hardware.'),
  ('56000000-0000-4000-8000-000000000015', '55000000-0000-4000-8000-000000000012', 'Run more instruction cycles per second', true, 1, 'Correct.'),
  ('56000000-0000-4000-8000-000000000016', '55000000-0000-4000-8000-000000000012', 'Store more files permanently', false, 2, 'Storage capacity is not clock speed.'),
  ('56000000-0000-4000-8000-000000000017', '55000000-0000-4000-8000-000000000012', 'Improve monitor resolution', false, 3, 'Screen resolution is not clock speed.'),
  ('56000000-0000-4000-8000-000000000018', '55000000-0000-4000-8000-000000000012', 'Increase internet bandwidth', false, 4, 'Network bandwidth is not CPU clock speed.'),
  ('56000000-0000-4000-8000-000000000019', '55000000-0000-4000-8000-000000000013', 'True', false, 1, 'The CPU does not permanently store files.'),
  ('56000000-0000-4000-8000-000000000020', '55000000-0000-4000-8000-000000000013', 'False', true, 2, 'Correct.')
on conflict (id) do nothing;

insert into public.test_assignments (
  id,
  test_version_id,
  assigned_by,
  class_id,
  start_at,
  due_at,
  time_limit_seconds,
  attempt_limit,
  feedback_policy,
  status
)
values (
  '57000000-0000-4000-8000-000000000001',
  '54000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000001',
  '2026-07-25T08:00:00Z',
  '2026-08-31T22:59:00Z',
  1200,
  1,
  'score_only',
  'open'
)
on conflict (id) do update
set
  test_version_id = excluded.test_version_id,
  assigned_by = excluded.assigned_by,
  class_id = excluded.class_id,
  start_at = excluded.start_at,
  due_at = excluded.due_at,
  time_limit_seconds = excluded.time_limit_seconds,
  attempt_limit = excluded.attempt_limit,
  feedback_policy = excluded.feedback_policy,
  status = excluded.status,
  updated_at = now();

insert into public.test_attempts (
  id,
  student_id,
  class_id_at_attempt,
  test_id,
  test_version_id,
  attempt_type,
  attempt_number,
  status,
  started_at,
  submitted_at,
  duration_seconds,
  time_limit_seconds,
  score,
  max_score,
  percentage,
  marking_status,
  feedback_status,
  points_awarded,
  suspicious_event_count
)
values
  ('58000000-0000-4000-8000-000000000101', '30000000-0000-4000-8000-000000000101', '40000000-0000-4000-8000-000000000001', '53000000-0000-4000-8000-000000000001', '54000000-0000-4000-8000-000000000001', 'practice', 1, 'feedback_released', '2026-07-05T09:12:00Z', '2026-07-05T09:22:00Z', 600, 900, 3, 4, 75, 'marked', 'released', 95, 1),
  ('58000000-0000-4000-8000-000000000102', '30000000-0000-4000-8000-000000000102', '40000000-0000-4000-8000-000000000001', '53000000-0000-4000-8000-000000000001', '54000000-0000-4000-8000-000000000001', 'practice', 1, 'feedback_released', '2026-07-04T10:00:00Z', '2026-07-04T10:08:00Z', 480, 900, 4, 4, 100, 'marked', 'released', 125, 0)
on conflict (id) do update
set
  student_id = excluded.student_id,
  class_id_at_attempt = excluded.class_id_at_attempt,
  test_id = excluded.test_id,
  test_version_id = excluded.test_version_id,
  attempt_type = excluded.attempt_type,
  attempt_number = excluded.attempt_number,
  status = excluded.status,
  started_at = excluded.started_at,
  submitted_at = excluded.submitted_at,
  duration_seconds = excluded.duration_seconds,
  time_limit_seconds = excluded.time_limit_seconds,
  score = excluded.score,
  max_score = excluded.max_score,
  percentage = excluded.percentage,
  marking_status = excluded.marking_status,
  feedback_status = excluded.feedback_status,
  points_awarded = excluded.points_awarded,
  suspicious_event_count = excluded.suspicious_event_count,
  updated_at = now();

insert into public.student_answers (
  id,
  attempt_id,
  question_id,
  answer,
  answer_text,
  is_correct,
  marks_awarded,
  max_marks,
  marked_by,
  feedback
)
values
  ('61000000-0000-4000-8000-000000000101', '58000000-0000-4000-8000-000000000101', '55000000-0000-4000-8000-000000000001', to_jsonb('56000000-0000-4000-8000-000000000001'::text), null, true, 1, 1, 'system', 'Correct answer.'),
  ('61000000-0000-4000-8000-000000000102', '58000000-0000-4000-8000-000000000101', '55000000-0000-4000-8000-000000000002', to_jsonb('56000000-0000-4000-8000-000000000007'::text), null, false, 0, 1, 'system', 'Review this question and try again.'),
  ('61000000-0000-4000-8000-000000000103', '58000000-0000-4000-8000-000000000101', '55000000-0000-4000-8000-000000000003', to_jsonb('56000000-0000-4000-8000-000000000009'::text), null, true, 1, 1, 'system', 'Correct answer.'),
  ('61000000-0000-4000-8000-000000000104', '58000000-0000-4000-8000-000000000101', '55000000-0000-4000-8000-000000000004', to_jsonb('fetch decode execute cycle'::text), 'fetch decode execute cycle', true, 1, 1, 'system', 'Accepted answer.'),
  ('61000000-0000-4000-8000-000000000201', '58000000-0000-4000-8000-000000000102', '55000000-0000-4000-8000-000000000001', to_jsonb('56000000-0000-4000-8000-000000000001'::text), null, true, 1, 1, 'system', 'Correct answer.'),
  ('61000000-0000-4000-8000-000000000202', '58000000-0000-4000-8000-000000000102', '55000000-0000-4000-8000-000000000002', to_jsonb('56000000-0000-4000-8000-000000000005'::text), null, true, 1, 1, 'system', 'Correct answer.'),
  ('61000000-0000-4000-8000-000000000203', '58000000-0000-4000-8000-000000000102', '55000000-0000-4000-8000-000000000003', to_jsonb('56000000-0000-4000-8000-000000000009'::text), null, true, 1, 1, 'system', 'Correct answer.'),
  ('61000000-0000-4000-8000-000000000204', '58000000-0000-4000-8000-000000000102', '55000000-0000-4000-8000-000000000004', to_jsonb('fetch-decode-execute'::text), 'fetch-decode-execute', true, 1, 1, 'system', 'Accepted answer.')
on conflict (id) do update
set
  attempt_id = excluded.attempt_id,
  question_id = excluded.question_id,
  answer = excluded.answer,
  answer_text = excluded.answer_text,
  is_correct = excluded.is_correct,
  marks_awarded = excluded.marks_awarded,
  max_marks = excluded.max_marks,
  marked_by = excluded.marked_by,
  feedback = excluded.feedback,
  updated_at = now();

insert into public.points_transactions (id, student_id, related_attempt_id, points, reason, created_by, metadata, created_at)
values
  ('59000000-0000-4000-8000-000000000101', '30000000-0000-4000-8000-000000000101', '58000000-0000-4000-8000-000000000101', 320, 'Local seed points for dashboard and leaderboard QA', 'system', '{"seed":"local-mvp"}'::jsonb, '2026-07-05T09:22:00Z'),
  ('59000000-0000-4000-8000-000000000102', '30000000-0000-4000-8000-000000000102', '58000000-0000-4000-8000-000000000102', 360, 'Local seed points for dashboard and leaderboard QA', 'system', '{"seed":"local-mvp"}'::jsonb, '2026-07-04T10:08:00Z'),
  ('59000000-0000-4000-8000-000000000103', '30000000-0000-4000-8000-000000000103', null, 260, 'Local seed points for dashboard and leaderboard QA', 'system', '{"seed":"local-mvp"}'::jsonb, '2026-07-03T11:25:00Z'),
  ('59000000-0000-4000-8000-000000000104', '30000000-0000-4000-8000-000000000104', null, 300, 'Local seed points for dashboard and leaderboard QA', 'system', '{"seed":"local-mvp"}'::jsonb, '2026-07-06T12:45:00Z'),
  ('59000000-0000-4000-8000-000000000105', '30000000-0000-4000-8000-000000000105', null, 160, 'Local seed points for dashboard and leaderboard QA', 'system', '{"seed":"local-mvp"}'::jsonb, '2026-07-01T15:10:00Z')
on conflict (id) do update
set
  student_id = excluded.student_id,
  related_attempt_id = excluded.related_attempt_id,
  points = excluded.points,
  reason = excluded.reason,
  created_by = excluded.created_by,
  metadata = excluded.metadata,
  created_at = excluded.created_at;

insert into public.leaderboard_snapshots (
  id,
  period_type,
  class_id,
  student_id,
  display_name,
  student_public_id,
  points,
  status_name,
  rank,
  calculated_at
)
values
  ('60000000-0000-4000-8000-000000000102', 'all_time', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000102', 'R Mehta - ID 2410', '2410', 360, 'Learner', 1, now()),
  ('60000000-0000-4000-8000-000000000101', 'all_time', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000101', 'A Singh - ID 2587', '2587', 320, 'Learner', 2, now()),
  ('60000000-0000-4000-8000-000000000104', 'all_time', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000104', 'V Kumar - ID 2390', '2390', 300, 'Learner', 3, now()),
  ('60000000-0000-4000-8000-000000000103', 'all_time', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000103', 'D Patel - ID 2468', '2468', 260, 'Learner', 4, now()),
  ('60000000-0000-4000-8000-000000000105', 'all_time', '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000105', 'M Khan - ID 2472', '2472', 160, 'Starter', 5, now())
on conflict (id) do update
set
  period_type = excluded.period_type,
  class_id = excluded.class_id,
  student_id = excluded.student_id,
  display_name = excluded.display_name,
  student_public_id = excluded.student_public_id,
  points = excluded.points,
  status_name = excluded.status_name,
  rank = excluded.rank,
  calculated_at = now();

insert into public.attempt_events (
  id,
  attempt_id,
  student_id,
  event_type,
  route,
  event_detail,
  user_agent,
  created_at
)
values (
  '62000000-0000-4000-8000-000000000101',
  '58000000-0000-4000-8000-000000000101',
  '30000000-0000-4000-8000-000000000101',
  'tab_hidden',
  '/student/test',
  '{"seed":"local-mvp"}'::jsonb,
  'local-seed',
  '2026-07-05T09:17:00Z'
)
on conflict (id) do update
set
  attempt_id = excluded.attempt_id,
  student_id = excluded.student_id,
  event_type = excluded.event_type,
  route = excluded.route,
  event_detail = excluded.event_detail,
  user_agent = excluded.user_agent,
  created_at = excluded.created_at;

insert into public.audit_logs (id, actor_profile_id, action, target_type, target_id, detail, created_at)
values (
  '63000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  'local_seed_applied',
  'database',
  null,
  '{"seed":"local-mvp"}'::jsonb,
  now()
)
on conflict (id) do update
set
  actor_profile_id = excluded.actor_profile_id,
  action = excluded.action,
  target_type = excluded.target_type,
  target_id = excluded.target_id,
  detail = excluded.detail,
  created_at = now();

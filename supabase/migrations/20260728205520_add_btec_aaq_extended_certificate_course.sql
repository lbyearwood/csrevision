insert into public.subjects (
  id, slug, subject_name, exam_board, course_code, year_group, description, status, display_order
)
values (
  '50000000-0000-4000-8000-000000000002',
  'pearson-btec-level-3-extended-certificate-it-aaq',
  'Pearson BTEC Level 3 National Extended Certificate in IT',
  'Pearson',
  'AAQ IT',
  '12-13',
  'Pearson BTEC Level 3 National Extended Certificate in Information Technology (AAQ).',
  'active',
  2
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

insert into public.units (
  id, subject_id, slug, unit_name, unit_code, description, status, display_order
)
values
  ('51000000-0000-4000-8000-000000000011', '50000000-0000-4000-8000-000000000002', 'unit-1-information-technology-systems', '1. Information Technology Systems', '1', 'Information technology systems, their components, connectivity, online systems and data protection.', 'active', 1),
  ('51000000-0000-4000-8000-000000000012', '50000000-0000-4000-8000-000000000002', 'unit-2-cyber-security-and-incident-management', '2. Cyber Security and Incident Management', '2', 'Cyber security threats, system vulnerabilities, network security, governance and incident management.', 'active', 2),
  ('51000000-0000-4000-8000-000000000013', '50000000-0000-4000-8000-000000000002', 'unit-3-website-development', '3. Website Development', '3', 'Website principles, design skills, development processes and testing against client requirements.', 'active', 3),
  ('51000000-0000-4000-8000-000000000014', '50000000-0000-4000-8000-000000000002', 'unit-4-relational-database-development', '4. Relational Database Development', '4', 'Relational database principles, design, development, testing, review and optimisation.', 'active', 4)
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

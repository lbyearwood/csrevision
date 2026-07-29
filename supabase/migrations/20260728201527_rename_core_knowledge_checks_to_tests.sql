update public.tests
set
  test_title = replace(test_title, 'Core knowledge check', 'Core knowledge test'),
  updated_at = now()
where test_title ilike '%Core knowledge check%';

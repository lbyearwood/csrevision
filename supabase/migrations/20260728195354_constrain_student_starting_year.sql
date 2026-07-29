alter table public.student_profiles
  add constraint student_profiles_initial_year_group_range
  check (initial_year_group is null or initial_year_group between 7 and 13);

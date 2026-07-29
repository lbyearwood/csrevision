create table public.class_courses (
  class_id uuid not null references public.classes(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (class_id, subject_id)
);

create index class_courses_subject_idx on public.class_courses (subject_id);

alter table public.class_courses enable row level security;

create policy "class courses read by owner members admin"
on public.class_courses for select
to authenticated
using (
  app_private.teacher_owns_class(class_id)
  or app_private.student_in_class(class_id)
  or app_private.is_admin()
);

create policy "class courses managed by owner or admin"
on public.class_courses for insert
to authenticated
with check (app_private.teacher_owns_class(class_id) or app_private.is_admin());

create policy "class courses removed by owner or admin"
on public.class_courses for delete
to authenticated
using (app_private.teacher_owns_class(class_id) or app_private.is_admin());

grant select, insert, delete on public.class_courses to authenticated;

insert into public.class_courses (class_id, subject_id)
select
  class_record.id,
  case
    when nullif(regexp_replace(class_record.year_group, '\\D', '', 'g'), '')::smallint in (10, 11)
      then '50000000-0000-4000-8000-000000000001'::uuid
    when nullif(regexp_replace(class_record.year_group, '\\D', '', 'g'), '')::smallint in (12, 13)
      then '50000000-0000-4000-8000-000000000002'::uuid
  end
from public.classes as class_record
where not class_record.is_system
  and nullif(regexp_replace(class_record.year_group, '\\D', '', 'g'), '')::smallint in (10, 11, 12, 13)
  and exists (
    select 1
    from public.subjects
    where id = case
      when nullif(regexp_replace(class_record.year_group, '\\D', '', 'g'), '')::smallint in (10, 11)
        then '50000000-0000-4000-8000-000000000001'::uuid
      else '50000000-0000-4000-8000-000000000002'::uuid
    end
  )
on conflict (class_id, subject_id) do nothing;

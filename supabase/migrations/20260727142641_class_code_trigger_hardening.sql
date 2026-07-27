create or replace function app_private.protect_class_managed_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  generated_code text;
  position integer;
begin
  if current_user = 'authenticated' then
    if tg_op = 'INSERT' then
      if new.is_system then
        raise exception 'System class flags are managed by the server.';
      end if;

      if new.join_code is not null then
        raise exception 'Class join codes are managed by the server.';
      end if;
    elsif tg_op = 'UPDATE' then
      if old.is_system is distinct from new.is_system then
        raise exception 'System class flags are managed by the server.';
      end if;

      if old.join_code is distinct from new.join_code then
        raise exception 'Class join codes are managed by the server.';
      end if;

      if old.is_system and new.status <> 'active' then
        raise exception 'System classes cannot be archived.';
      end if;

      if old.is_system and new.accepting_students then
        raise exception 'System classes cannot accept student join codes.';
      end if;
    end if;
  end if;

  if new.is_system then
    new.join_code := null;
    new.accepting_students := false;
    new.status := 'active';
  elsif new.join_code is null then
    loop
      generated_code := '';
      for position in 1..6 loop
        generated_code := generated_code || substr(alphabet, floor(random() * length(alphabet) + 1)::integer, 1);
      end loop;

      exit when not exists (
        select 1
        from public.classes
        where join_code = generated_code
          and id <> new.id
      );
    end loop;

    new.join_code := generated_code;
  end if;

  return new;
end
$$;

drop trigger if exists classes_protect_managed_fields on public.classes;

create trigger classes_protect_managed_fields
before insert or update on public.classes
for each row execute function app_private.protect_class_managed_fields();

revoke all on function app_private.protect_class_managed_fields() from public;
grant execute on function app_private.protect_class_managed_fields() to service_role;

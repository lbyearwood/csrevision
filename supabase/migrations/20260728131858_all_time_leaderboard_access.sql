-- The all-time board contains only the public leaderboard snapshot fields.
-- It deliberately includes archived students so historic achievement remains visible.
create policy "all time leaderboard is readable by signed in users"
on public.leaderboard_snapshots for select
to authenticated
using (period_type = 'all_time');

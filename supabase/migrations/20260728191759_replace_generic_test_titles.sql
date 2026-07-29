update public.tests as test
set test_title = topic.topic_name || ' | Core knowledge check',
    updated_at = now()
from public.topics as topic
where topic.id = test.topic_id
  and test.test_title ~* 'test\\s*1$';

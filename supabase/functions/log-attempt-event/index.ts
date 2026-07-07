import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, getRequester } from '../_shared/supabase.ts';

const allowedEvents = new Set([
  'copy_attempt',
  'paste_attempt',
  'cut_attempt',
  'right_click_attempt',
  'print_attempt',
  'tab_hidden',
  'window_blur',
  'page_leave_attempt',
  'reload_attempt',
  'fullscreen_exit',
  'suspicious_focus_loss',
]);

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    if (requester.role !== 'student') return errorResponse('Student permission required', 403);
    const body = await req.json();
    const attemptId = String(body.attemptId ?? '');
    const eventType = String(body.eventType ?? '');
    if (!allowedEvents.has(eventType)) return errorResponse('Unsupported event type', 422);

    const { data: student } = await service.from('student_profiles').select('id').eq('profile_id', requester.id).single();
    if (!student) return errorResponse('Student profile not found', 403);

    const { data: attempt } = await service
      .from('test_attempts')
      .select('id, student_id, status, suspicious_event_count')
      .eq('id', attemptId)
      .eq('student_id', student.id)
      .single();
    if (!attempt) return errorResponse('Attempt not found', 404);
    if (attempt.status !== 'in_progress') return jsonResponse({ logged: false, reason: 'attempt_not_active' });

    const since = new Date(Date.now() - 5000).toISOString();
    const { data: recent } = await service
      .from('attempt_events')
      .select('id')
      .eq('attempt_id', attemptId)
      .eq('event_type', eventType)
      .gte('created_at', since)
      .maybeSingle();
    if (recent) return jsonResponse({ logged: false, reason: 'rate_limited' });

    const { error } = await service.from('attempt_events').insert({
      attempt_id: attemptId,
      student_id: student.id,
      event_type: eventType,
      route: body.route ?? null,
      event_detail: body.metadata ?? {},
      user_agent: req.headers.get('User-Agent'),
    });
    if (error) throw error;

    await service
      .from('test_attempts')
      .update({ suspicious_event_count: (attempt.suspicious_event_count ?? 0) + 1 })
      .eq('id', attemptId);

    return jsonResponse({ logged: true });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to log event', 400);
  }
});

import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, getRequester } from '../_shared/supabase.ts';

const allowedEventTypes = new Set(['session_started', 'page_view', 'heartbeat', 'page_hidden', 'page_visible']);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function routeFrom(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const route = value.slice(0, 160);
  return route.startsWith('/student') || route.startsWith('/teacher') ? route : null;
}

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    const body = await req.json();
    const eventType = String(body.eventType ?? '');
    const route = routeFrom(body.route);

    if (!allowedEventTypes.has(eventType)) return errorResponse('Unsupported activity event', 422);

    let sessionId = typeof body.sessionId === 'string' && uuidPattern.test(body.sessionId) ? body.sessionId : null;
    if (sessionId) {
      const { data: existing } = await service
        .from('activity_sessions')
        .select('id')
        .eq('id', sessionId)
        .eq('profile_id', requester.id)
        .is('ended_at', null)
        .maybeSingle();
      if (!existing) sessionId = null;
    }

    if (!sessionId) {
      const { data: created, error: createError } = await service
        .from('activity_sessions')
        .insert({ profile_id: requester.id, role: requester.role })
        .select('id')
        .single();
      if (createError || !created) throw createError ?? new Error('Unable to create activity session');
      sessionId = created.id;
    } else {
      const { error: touchError } = await service
        .from('activity_sessions')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', sessionId)
        .eq('profile_id', requester.id);
      if (touchError) throw touchError;
    }

    const { error: eventError } = await service.from('activity_events').insert({
      session_id: sessionId,
      profile_id: requester.id,
      event_type: eventType,
      route,
    });
    if (eventError) throw eventError;

    return jsonResponse({ sessionId });
  } catch (error) {
    console.error('Activity logging failed', error);
    return errorResponse(error instanceof Error ? error.message : 'Unable to log activity', 400);
  }
});

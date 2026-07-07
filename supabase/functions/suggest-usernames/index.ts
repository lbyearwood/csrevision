import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { buildUsernameStem } from '../_shared/identity.ts';
import { createServiceClient, getRequester, requireStaff } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    await requireStaff(requester);
    const body = await req.json();
    const stem = buildUsernameStem(String(body.firstName ?? ''), String(body.surname ?? ''));
    const { data: existingRows } = await service.from('profiles').select('username').like('username', `${stem}%`);
    const existing = new Set((existingRows ?? []).map((row) => row.username));
    const suggestions: string[] = [];

    for (let suffix = 1000; suffix <= 9999 && suggestions.length < 3; suffix += 1) {
      const candidate = `${stem}${suffix}`;
      if (!existing.has(candidate)) suggestions.push(candidate);
    }

    return jsonResponse({ suggestions });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to suggest usernames', 400);
  }
});

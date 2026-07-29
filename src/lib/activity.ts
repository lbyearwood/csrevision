import { supabase } from './supabaseClient';

type ActivityEventType = 'session_started' | 'page_view' | 'heartbeat' | 'page_hidden' | 'page_visible';

const sessionStorageKey = 'csrevision.activitySessionId';
let sessionStart: Promise<void> | null = null;

async function sendActivity(eventType: ActivityEventType, route: string, sessionId: string | null): Promise<string | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.functions.invoke<{ sessionId: string }>('log-activity', {
    body: { eventType, route, sessionId },
  });
  if (error) throw error;
  return data?.sessionId ?? null;
}

export async function startActivitySession(route: string): Promise<void> {
  if (!supabase || window.sessionStorage.getItem(sessionStorageKey)) return;

  sessionStart ??= sendActivity('session_started', route, null)
    .then((sessionId) => {
      if (sessionId) window.sessionStorage.setItem(sessionStorageKey, sessionId);
    })
    .finally(() => {
      sessionStart = null;
    });
  await sessionStart;
}

export async function logActivity(eventType: Exclude<ActivityEventType, 'session_started'>, route: string): Promise<void> {
  await startActivitySession(route);
  const sessionId = window.sessionStorage.getItem(sessionStorageKey);
  const returnedSessionId = await sendActivity(eventType, route, sessionId);
  if (returnedSessionId && returnedSessionId !== sessionId) {
    window.sessionStorage.setItem(sessionStorageKey, returnedSessionId);
  }
}

export function clearActivitySession(): void {
  window.sessionStorage.removeItem(sessionStorageKey);
}

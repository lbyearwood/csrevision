const LOCAL_SUPABASE_UNAVAILABLE_MESSAGE =
  'Local Supabase is unavailable. Start or restart Supabase, then retry.';

const LOCAL_SCHEMA_OUTDATED_MESSAGE =
  'The Local Supabase schema is out of date. Apply the latest migrations or run the documented local reset, then retry. See Planning/Setup/SUPABASE_SETUP.md.';

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error && 'message' in error) return String(error.message);
  return typeof error === 'string' ? error : '';
}

export async function withLocalSupabaseTimeout<T>(
  action: Promise<T>,
  timeoutMs = 5_000,
): Promise<T> {
  let rejectForTimeout: ((reason?: unknown) => void) | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    rejectForTimeout = reject;
  });
  const timeoutId = globalThis.setTimeout(() => {
    rejectForTimeout?.(new Error('Local Supabase request timed out'));
  }, timeoutMs);

  try {
    return await Promise.race([action, timeout]);
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

export function toLocalSupabaseError(error: unknown, fallback: string): Error {
  const message = errorMessage(error).trim();
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('failed to fetch') ||
    lowerMessage.includes('fetch error') ||
    lowerMessage.includes('functionsfetcherror') ||
    lowerMessage.includes('networkerror') ||
    lowerMessage.includes('network request failed') ||
    lowerMessage.includes('name resolution failed') ||
    lowerMessage.includes('connection refused') ||
    lowerMessage.includes('failed to send a request to the edge function') ||
    lowerMessage.includes('load failed') ||
    lowerMessage.includes('aborted') ||
    lowerMessage.includes('timeout') ||
    lowerMessage.includes('timed out') ||
    lowerMessage.includes('edge function failed')
  ) {
    return new Error(LOCAL_SUPABASE_UNAVAILABLE_MESSAGE);
  }

  if (
    lowerMessage.includes('schema cache') ||
    lowerMessage.includes('does not exist') ||
    lowerMessage.includes('undefined column') ||
    lowerMessage.includes('could not find the table') ||
    lowerMessage.includes('could not find the column')
  ) {
    return new Error(LOCAL_SCHEMA_OUTDATED_MESSAGE);
  }

  return new Error(message || fallback);
}

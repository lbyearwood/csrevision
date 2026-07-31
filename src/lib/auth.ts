import { studentUsernameToEmail } from './identity';
import { isSupabaseConfigured, supabase } from './supabaseClient';
import { toLocalSupabaseError, withLocalSupabaseTimeout } from './supabaseErrors';
import type { UserRole } from '../types/domain';

export interface SignInResult {
  role: UserRole;
  displayName: string;
}

const SUPABASE_REQUIRED_MESSAGE =
  'Local Supabase is required. Start Supabase, create .env.local with local values, then sign in again.';

async function loadSignedInProfile(expectedRoles: UserRole[]): Promise<SignInResult> {
  if (!supabase) throw new Error('Supabase is not configured');

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw userError ?? new Error('Authentication failed');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, display_name, account_status')
    .eq('auth_user_id', userData.user.id)
    .maybeSingle();

  if (profileError) throw new Error(profileError.message);
  if (!profile) {
    await supabase.auth.signOut();
    throw new Error('Account profile not found. Contact your teacher or administrator.');
  }
  if (profile.account_status !== 'active') {
    await supabase.auth.signOut();
    throw new Error(
      profile.account_status === 'inactive'
        ? 'This account is inactive. Contact your teacher or administrator.'
        : 'This account is archived. Contact your teacher or administrator.',
    );
  }

  const role = profile.role as UserRole;
  if (!expectedRoles.includes(role)) {
    await supabase.auth.signOut();
    throw new Error('This account cannot access that area');
  }

  return { role, displayName: profile.display_name };
}

export async function signInStudent(username: string, password: string): Promise<SignInResult> {
  if (!isSupabaseConfigured || !supabase) throw new Error(SUPABASE_REQUIRED_MESSAGE);

  try {
    return await withLocalSupabaseTimeout((async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: studentUsernameToEmail(username),
        password,
      });
      if (error) throw error;
      return loadSignedInProfile(['student']);
    })());
  } catch (error) {
    throw toLocalSupabaseError(error, 'Could not sign in');
  }
}

export async function signInStaff(email: string, password: string): Promise<SignInResult> {
  if (!isSupabaseConfigured || !supabase) throw new Error(SUPABASE_REQUIRED_MESSAGE);

  try {
    return await withLocalSupabaseTimeout((async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return loadSignedInProfile(['teacher', 'admin']);
    })());
  } catch (error) {
    throw toLocalSupabaseError(error, 'Could not sign in');
  }
}

export async function restoreSignedInSession(): Promise<SignInResult | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session) return null;

  return loadSignedInProfile(['student', 'teacher', 'admin']);
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
}

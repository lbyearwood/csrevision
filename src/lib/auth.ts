import { studentUsernameToEmail } from './identity';
import { isSupabaseConfigured, supabase } from './supabaseClient';
import type { UserRole } from '../types/domain';

export interface SignInResult {
  role: UserRole;
  displayName: string;
}

async function loadSignedInProfile(expectedRoles: UserRole[]): Promise<SignInResult> {
  if (!supabase) throw new Error('Supabase is not configured');

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw userError ?? new Error('Authentication failed');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('auth_user_id', userData.user.id)
    .eq('account_status', 'active')
    .single();

  if (profileError || !profile) throw profileError ?? new Error('Active profile not found');

  const role = profile.role as UserRole;
  if (!expectedRoles.includes(role)) {
    await supabase.auth.signOut();
    throw new Error('This account cannot access that area');
  }

  return { role, displayName: profile.display_name };
}

export async function signInStudent(username: string, password: string): Promise<SignInResult> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithPassword({
      email: studentUsernameToEmail(username),
      password,
    });
    if (error) throw error;
    return loadSignedInProfile(['student']);
  }

  return { role: 'student', displayName: 'A. Singh' };
}

export async function signInStaff(email: string, password: string): Promise<SignInResult> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return loadSignedInProfile(['teacher', 'admin']);
  }

  return { role: 'teacher', displayName: 'J. Doe' };
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
}

import { studentUsernameToEmail } from './identity';
import { isSupabaseConfigured, supabase } from './supabaseClient';
import type { UserRole } from '../types/domain';

export interface SignInResult {
  role: UserRole;
  displayName: string;
}

export async function signInStudent(username: string, password: string): Promise<SignInResult> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithPassword({
      email: studentUsernameToEmail(username),
      password,
    });
    if (error) throw error;
  }

  return { role: 'student', displayName: 'A. Singh' };
}

export async function signInStaff(email: string, password: string): Promise<SignInResult> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  return { role: 'teacher', displayName: 'J. Doe' };
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
}

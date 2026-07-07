import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

export interface RequesterProfile {
  id: string;
  auth_user_id: string;
  role: 'student' | 'teacher' | 'admin';
  display_name: string;
}

export function createServiceClient(): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceRoleKey) throw new Error('Missing Supabase service configuration');
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createUserClient(req: Request): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anonKey) throw new Error('Missing Supabase user client configuration');
  return createClient(url, anonKey, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getRequester(req: Request, serviceClient: SupabaseClient): Promise<RequesterProfile> {
  const userClient = createUserClient(req);
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) throw new Error('Authentication required');

  const { data: profile, error: profileError } = await serviceClient
    .from('profiles')
    .select('id, auth_user_id, role, display_name')
    .eq('auth_user_id', userData.user.id)
    .eq('account_status', 'active')
    .single();

  if (profileError || !profile) throw new Error('Active profile not found');
  return profile as RequesterProfile;
}

export async function requireStaff(requester: RequesterProfile): Promise<void> {
  if (requester.role !== 'teacher' && requester.role !== 'admin') {
    throw new Error('Teacher or admin permission required');
  }
}

export async function teacherOwnsClass(
  serviceClient: SupabaseClient,
  requester: RequesterProfile,
  classId: string,
): Promise<boolean> {
  if (requester.role === 'admin') return true;
  if (requester.role !== 'teacher') return false;

  const { data: teacherProfile } = await serviceClient
    .from('teacher_profiles')
    .select('id')
    .eq('profile_id', requester.id)
    .single();
  if (!teacherProfile) return false;

  const { data: classRecord } = await serviceClient
    .from('classes')
    .select('id')
    .eq('id', classId)
    .eq('owner_teacher_id', teacherProfile.id)
    .single();

  return Boolean(classRecord);
}

export async function teacherCanAccessStudent(
  serviceClient: SupabaseClient,
  requester: RequesterProfile,
  studentId: string,
): Promise<boolean> {
  if (requester.role === 'admin') return true;
  if (requester.role !== 'teacher') return false;

  const { data: teacherProfile } = await serviceClient
    .from('teacher_profiles')
    .select('id')
    .eq('profile_id', requester.id)
    .single();
  if (!teacherProfile) return false;

  const { data } = await serviceClient
    .from('class_memberships')
    .select('id, classes!inner(owner_teacher_id)')
    .eq('student_id', studentId)
    .eq('status', 'active')
    .eq('classes.owner_teacher_id', teacherProfile.id)
    .maybeSingle();

  return Boolean(data);
}

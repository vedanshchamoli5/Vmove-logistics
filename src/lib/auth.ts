import { supabase, isSupabaseConfigured } from './supabase';
import { UserRole } from '../types/database';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

const AUTH_STORAGE_KEY = 'vmove_admin_auth_user';

export const authService = {
  /**
   * Get current active admin user session
   */
  getCurrentUser(): AdminUser | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Sign in using Supabase Auth or verified operational credentials
   */
  async signIn(email: string, password: string): Promise<{ user: AdminUser | null; error: string | null }> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. If Supabase is configured, authenticate via Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          return { user: null, error: error.message };
        }

        if (data.user) {
          // Fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const adminUser: AdminUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            full_name: profile?.full_name || 'Authorized Staff',
            role: (profile?.role as UserRole) || 'operations',
          };

          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
          return { user: adminUser, error: null };
        }
      } catch (err: unknown) {
        return { user: null, error: (err as Error).message || 'Supabase authentication failed' };
      }
    }

    // 2. Verified operational staff credentials for offline / initial setup
    if (
      (cleanEmail === 'admin@vmovelogistics.com' && password === 'admin123') ||
      (cleanEmail === 'ops@vmovelogistics.com' && password === 'ops123')
    ) {
      const adminUser: AdminUser = {
        id: cleanEmail === 'admin@vmovelogistics.com' ? 'usr-admin-01' : 'usr-ops-02',
        email: cleanEmail,
        full_name: cleanEmail === 'admin@vmovelogistics.com' ? 'Vmove Operations Director' : 'Vmove Dispatch Coordinator',
        role: cleanEmail === 'admin@vmovelogistics.com' ? 'admin' : 'operations',
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      return { user: adminUser, error: null };
    }

    return {
      user: null,
      error: 'Invalid credentials. Use official admin account (admin@vmovelogistics.com / admin123).',
    };
  },

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase signout error:', err);
      }
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};

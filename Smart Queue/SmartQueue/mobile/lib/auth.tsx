import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { type AuthUser, getToken, getUser, setToken, setUser } from '@/lib/tokenStore';

type AuthState =
  | { status: 'loading'; token: null; user: null }
  | { status: 'signed_out'; token: null; user: null }
  | { status: 'signed_in'; token: string; user: AuthUser };

type AuthContextValue = {
  state: AuthState;
  signIn: (args: { email: string; password: string }) => Promise<void>;
  signUp: (args: { name: string; email: string; password: string; role: 'student' | 'admin' }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const SIGNED_OUT: AuthState = { status: 'signed_out', token: null, user: null };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', token: null, user: null });

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const user = await getUser();
        if (token && user) {
          setState({ status: 'signed_in', token, user });
        } else {
          setState(SIGNED_OUT);
        }
      } catch {
        setState(SIGNED_OUT);
      }
    })();
  }, []);

  const signIn = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const res = await api.post('/auth/login', { email, password });
    const token: string = res.data?.token;
    const user: AuthUser = res.data?.user;
    if (!token || !user) throw new Error('Invalid server response');
    // Save to storage FIRST so interceptor can read token immediately
    await setToken(token);
    await setUser(user);
    setState({ status: 'signed_in', token, user });
  }, []);

  const signUp = useCallback(async ({ name, email, password, role }: { name: string; email: string; password: string; role: 'student' | 'admin' }) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    const token: string = res.data?.token;
    const user: AuthUser = res.data?.user;
    if (!token || !user) throw new Error('Invalid server response');
    await setToken(token);
    await setUser(user);
    setState({ status: 'signed_in', token, user });
  }, []);

  const signOut = useCallback(async () => {
    await setToken(null);
    await setUser(null);
    setState(SIGNED_OUT);
  }, []);

  return (
    <AuthContext.Provider value={{ state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

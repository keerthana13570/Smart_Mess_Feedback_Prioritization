import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'smartqueue_jwt';
const USER_KEY = 'smartqueue_user';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
};

async function storeGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try { return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null; }
    catch { return null; }
  }
  try { return await SecureStore.getItemAsync(key); }
  catch { return null; }
}

async function storeSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try { if (typeof localStorage !== 'undefined') localStorage.setItem(key, value); }
    catch {}
    return;
  }
  try { await SecureStore.setItemAsync(key, value); }
  catch {}
}

async function storeDel(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try { if (typeof localStorage !== 'undefined') localStorage.removeItem(key); }
    catch {}
    return;
  }
  try { await SecureStore.deleteItemAsync(key); }
  catch {}
}

export async function setToken(token: string | null): Promise<void> {
  if (!token) { await storeDel(TOKEN_KEY); return; }
  await storeSet(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return storeGet(TOKEN_KEY);
}

export async function setUser(user: AuthUser | null): Promise<void> {
  if (!user) { await storeDel(USER_KEY); return; }
  await storeSet(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<AuthUser | null> {
  const raw = await storeGet(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthUser; }
  catch { return null; }
}

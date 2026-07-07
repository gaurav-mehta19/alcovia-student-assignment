import Constants from 'expo-constants';

const TIMEOUT_MS = 10000;

function resolveBaseUrl(): string {
  const override = process.env.EXPO_PUBLIC_API_URL;
  if (override) return override.replace(/\/$/, '');
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  const host = hostUri?.split(':')[0] ?? 'localhost';
  return `http://${host}:3000/api`;
}

export const BASE_URL = resolveBaseUrl();

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      const message = body?.error ?? `Request failed (${res.status})`;
      throw new ApiError(message, body?.code ?? 'INTERNAL', res.status);
    }
    return body as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError('The request timed out', 'TIMEOUT', 0);
    }
    throw new ApiError('Could not reach the server', 'NETWORK', 0);
  } finally {
    clearTimeout(timer);
  }
}

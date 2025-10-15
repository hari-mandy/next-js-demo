// src/lib/auth-utils.ts
import Cookies from 'js-cookie';

// Token storage keys
const AUTH_TOKEN_KEY = 'woo_auth_token';

// Save auth tokens
export const setAuthTokens = (authToken: string) => {
  Cookies.set(AUTH_TOKEN_KEY, authToken, {
    sameSite: 'lax'
  });
};

// Get auth token
export const getAuthToken = (): string | null => {
  return Cookies.get(AUTH_TOKEN_KEY) || null;
};

// Clear all auth data
export const clearAuthData = () => {
  Cookies.remove(AUTH_TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Get user ID from token (decode JWT)
export const getUserIdFromToken = (token?: string): string | null => {
  const authToken = token || getAuthToken();
  if (!authToken) return null;

  try {
    const base64Url = authToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    return decoded.data?.user?.id || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
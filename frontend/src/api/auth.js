import { apiFetch, setAuthToken } from './http.js';

export async function signup({ username, email, password, role = ['user'] }) {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, roles: role }),
    skipAuth: true
  });
}

export async function signin({ usernameOrEmail, password }) {
  const data = await apiFetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ usernameOrEmail, password }),
    skipAuth: true
  });

  if (data?.accessToken) {
    setAuthToken(data.accessToken);
  }

  return data;
}

export function logout() {
  setAuthToken(null);
}

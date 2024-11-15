const tokenKey = "authToken";

let token: string | null = null;

export const authToken = {
  get: (): string | null => {
    if (token) return token;
    return localStorage[tokenKey] ?? null;
  },
  set: (newToken: string) => {
    localStorage[tokenKey] = newToken;
    token = newToken;
  },
  remove: () => {
    localStorage.removeItem(tokenKey);
    token = null;
  },
};

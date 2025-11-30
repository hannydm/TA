const computeDefaultBase = () => {
  if (typeof window === 'undefined') {
    return 'http://127.0.0.1:7000';
  }
  const { protocol, hostname } = window.location;
  const defaultPort = '7000';
  return `${protocol}//${hostname}:${defaultPort}`;
};

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  computeDefaultBase();

export const buildApiUrl = (path: string) => {
  if (!path) {
    return API_BASE_URL;
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const parseJson = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export interface ApiError extends Error {
  status?: number;
  payload?: unknown;
}

export const buildApiError = async (response: Response): Promise<ApiError> => {
  const error: ApiError = new Error(response.statusText || 'Request failed');
  error.status = response.status;
  error.payload = await parseJson(response);
  return error;
};

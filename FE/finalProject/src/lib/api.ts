const computeDefaultBase = () => {
  if (typeof window === 'undefined') {
    return ''; // Return empty string for SSR to avoid localhost issues
  }

  const { protocol, hostname, port } = window.location;

  // Production domain: Nginx handles /api/ proxy, so use origin without port
  if (hostname === 'digiworld.biz.id') {
    console.log('[DEBUG] Detected production domain:', hostname);
    return `${protocol}//${hostname}`;
  }

  // Local development: backend runs on port 8000
  const backendPort = port === '8080' ? '8000' : '8000';
  console.log('[DEBUG] Detected local/dev environment:', hostname, backendPort);
  return `${protocol}//${hostname}:${backendPort}`;
};

export const API_BASE_URL =
  (typeof window !== 'undefined' && window.location.hostname === 'digiworld.biz.id')
    ? `${window.location.protocol}//${window.location.hostname}`
    : (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
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

/**
 * Normalisasi URL avatar dari backend supaya:
 * - Tidak memakai avatar default bawaan (`default.jpg` dkk)
 * - Untuk domain produksi, SELALU memakai hostname domain (bukan IP)
 *   dan protokol yang sama dengan halaman (https), sehingga:
 *   - IP publik backend tidak kelihatan di Network tab
 *   - Tidak terjadi mixed‑content (https halaman vs http avatar).
 */
export const resolveAvatarUrl = (
  avatarPath: string | null | undefined,
): string | null => {
  if (!avatarPath) {
    return null;
  }

  const raw = String(avatarPath).trim();
  if (!raw) return null;

  const lower = raw.toLowerCase();
  const filename = lower.split('/').pop() || lower;

  // Abaikan placeholder default
  if (
    filename === 'default.jpg' ||
    filename === 'default.jpeg' ||
    filename === 'default.png'
  ) {
    return null;
  }

  // 1) Jika backend mengirim URL absolut (dengan IP atau host apa pun),
  //    ambil hanya path‑nya lalu gabungkan dengan API_BASE_URL lewat buildApiUrl,
  //    supaya origin selalu sama dengan API (tidak terlihat IP).
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const url = new URL(raw);
      const path = url.pathname + url.search;
      return buildApiUrl(path);
    } catch {
      // Jika parsing gagal, kembalikan apa adanya (kasus langka).
      return raw;
    }
  }

  // 2) Path relatif/absolut:
  //    - Jika sudah diawali '/', gunakan apa adanya.
  //    - Jika hanya nama file, anggap berada di /media/<file>.
  const path = raw.startsWith('/') ? raw : `/media/${raw}`;

  // Di semua lingkungan, gabungkan dengan API_BASE_URL (yang sudah
  // disesuaikan dengan domain / IP masing‑masing).
  return buildApiUrl(path);
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

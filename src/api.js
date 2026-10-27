export class ApiError extends Error {
  constructor(message, status = 0, code = '') { super(message); this.status = status; this.code = code; }
}
export function publicUrl(value) {
  try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; }
}
export function createApi(base, getToken = () => null, onUnauthorized = () => {}) {
  const root = base.replace(/\/+$/, '');
  return async (path, { signal, body, method = 'GET', auth = true } = {}) => {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    signal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(abort, 60000);
    try {
      const token = auth ? getToken() : null;
      const response = await fetch(`${root}/api${path}`, {
        method, signal: controller.signal,
        headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const json = await response.json().catch(() => null);
      if (!response.ok || json?.success !== true) {
        if (auth && (response.status === 401 || json?.error?.code === 'ACCOUNT_SUSPENDED')) onUnauthorized();
        throw new ApiError(json?.error?.message || `Máy chủ trả về lỗi ${response.status}. Vui lòng thử lại.`, response.status, json?.error?.code);
      }
      return json.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (signal?.aborted) throw error;
      throw new ApiError(error.name === 'AbortError' ? 'Máy chủ phản hồi chậm. Vui lòng thử lại sau một phút.' : 'Không kết nối được máy chủ. Kiểm tra Internet và cấu hình CORS của backend.');
    } finally { clearTimeout(timeout); signal?.removeEventListener('abort', abort); }
  };
}

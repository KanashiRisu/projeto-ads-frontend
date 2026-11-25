export interface JwtClaims {
  exp?: number;
  nome?: string;
  perfil?: string;
  [key: string]: unknown;
}

export function decodificarJwtPayload(token: string): JwtClaims | null {
  try {
    const partes = token.split('.');
    if (partes.length !== 3) return null;

    const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(base64 + padding), caractere => caractere.charCodeAt(0));
    const texto = new TextDecoder('utf-8').decode(bytes);
    const payload = JSON.parse(texto);

    return payload && typeof payload === 'object' ? payload as JwtClaims : null;
  } catch {
    return null;
  }
}

export function jwtExpirado(token: string | null | undefined): boolean {
  if (!token) return true;
  const payload = decodificarJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)) return true;
  return Date.now() >= payload.exp * 1000;
}

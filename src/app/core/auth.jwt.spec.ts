import { decodificarJwtPayload, jwtExpirado } from './auth.jwt';

function token(payload: object): string {
  const base64 = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `header.${base64}.assinatura`;
}

describe('JWT utilitário', () => {
  it('decodifica payload Base64URL', () => {
    const payload = decodificarJwtPayload(token({ nome: 'Ana', perfil: 'OPERADOR', exp: 4102444800 }));
    expect(payload?.nome).toBe('Ana');
    expect(payload?.perfil).toBe('OPERADOR');
  });

  it('identifica token expirado', () => {
    expect(jwtExpirado(token({ exp: 1 }))).toBe(true);
  });

  it('identifica token válido', () => {
    expect(jwtExpirado(token({ exp: 4102444800 }))).toBe(false);
  });

  it('trata token malformado como expirado', () => {
    expect(jwtExpirado('token-malformado')).toBe(true);
  });
});

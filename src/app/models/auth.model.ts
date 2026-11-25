export interface LoginRequest {
  email: string;
  senha: string;
}
export interface LoginResponse {
  token: string;
  tipo: string;
  expiraEmSegundos: number;
  nome?: string;
  perfil?: string;
}

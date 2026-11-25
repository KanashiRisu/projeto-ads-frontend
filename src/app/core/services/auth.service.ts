import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../models/auth.model';
import { decodificarJwtPayload, jwtExpirado } from '../auth.jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private chave = 'financeiro.sessao';
  private sessao = signal<LoginResponse | null>(this.restaurar());
  readonly token = computed(() => this.sessao()?.token ?? null);
  readonly autenticado = computed(() => {
    const token = this.token();
    return !!token && !jwtExpirado(token);
  });
  readonly claims = computed(() => {
    const token = this.token();
    return token ? decodificarJwtPayload(token) : null;
  });
  readonly nome = computed(() => {
    const daResposta = this.sessao()?.nome;
    const doToken = this.claims()?.nome;
    return (typeof daResposta === 'string' && daResposta.trim())
      ? daResposta
      : (typeof doToken === 'string' && doToken.trim())
        ? doToken
        : 'Usuário autenticado';
  });
  readonly perfil = computed(() => {
    const daResposta = this.sessao()?.perfil;
    const doToken = this.claims()?.perfil;
    if (typeof daResposta === 'string') return daResposta;
    return typeof doToken === 'string' ? doToken : null;
  });

  constructor() {
    if (typeof window !== 'undefined') {
      window.setInterval(() => {
        if (this.sessao() && !this.autenticado()) {
          this.logout();
          this.router.navigate(['/login']);
        }
      }, 30_000);
    }
  }

  login(dados: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`, dados
    ).pipe(tap(res => {
      if (!res?.token || jwtExpirado(res.token)) {
        throw new Error('O servidor devolveu um token inválido ou expirado.');
      }
      sessionStorage.setItem(this.chave, JSON.stringify(res));
      this.sessao.set(res);
    }));
  }

  logout() {
    sessionStorage.removeItem(this.chave);
    this.sessao.set(null);
  }

  private restaurar(): LoginResponse | null {
    try {
      const valor = JSON.parse(sessionStorage.getItem(this.chave) ?? 'null') as LoginResponse | null;
      if (!valor?.token || jwtExpirado(valor.token)) {
        sessionStorage.removeItem(this.chave);
        return null;
      }
      return valor;
    } catch {
      sessionStorage.removeItem(this.chave);
      return null;
    }
  }
}

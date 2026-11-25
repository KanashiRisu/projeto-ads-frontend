import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  imports: [RouterOutlet,RouterLink,RouterLinkActive],
  selector: 'app-main-layout',
  styleUrl: './main-layout.css',
  templateUrl: './main-layout.html',
})
export class MainLayout {
  readonly auth = inject(AuthService);
  readonly podeGerenciarUsuarios = computed(() =>
    (this.auth.perfil() ?? '').toUpperCase() !== 'OPERADOR'
  );
  private router = inject(Router);
  sair() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}

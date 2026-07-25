import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioAutenticadoService } from '@/core/autenticacao/services/usuario-autenticado.service';

@Component({
    selector: 'app-header-site',
    templateUrl: './header-site.component.html',
    styleUrls: ['./header-site.component.scss'],
    standalone: false
})
export class HeaderSiteComponent {

  constructor(
    private usuarioAutenticadoService: UsuarioAutenticadoService,
    private router: Router
    ) {}

  user$ = this.usuarioAutenticadoService.retornarUser()

  logout() {
    this.usuarioAutenticadoService.logout()
    this.router.navigate(["/"])
  }

}

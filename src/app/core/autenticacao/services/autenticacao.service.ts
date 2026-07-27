import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { Login } from '@/core/autenticacao/models/login.model';
import { TokenJwt } from '@/core/autenticacao/models/token-jwt.model';
import { UsuarioAutenticadoService } from '@/core/autenticacao/services/usuario-autenticado.service';
import { environment } from 'environments/environment';
import { RefreshToken } from '@/core/autenticacao/models/refresh-token.model';
import { TokenService } from '@/core/autenticacao/services/token.service';

@Injectable({
    providedIn: 'root'
})
export class AutenticacaoService {
    private readonly api = environment.api;

    constructor(
        private http: HttpClient,
        private usuarioAutenticadoService: UsuarioAutenticadoService,
        private tokenService: TokenService
    ) {}

    login(email: string, senha: string): Observable<TokenJwt> {
        const dados: Login = {email, senha};

        return this.http
            .post<TokenJwt>(`${this.api}/login`, dados)
            .pipe(
                tap((tokens) => {
                    this.usuarioAutenticadoService.salvarTokens(tokens);
                })
            );
    }

    renovarToken(): Observable<TokenJwt> {
      const dados: RefreshToken = {
          refreshToken: this.tokenService.retornarRefreshToken()
      };

      return this.http
          .post<TokenJwt>(`${this.api}/login/refresh`, dados)
          .pipe(
              tap((tokens) => {
                  this.usuarioAutenticadoService.salvarTokens(tokens);
              })
          );
    }
}
import {Injectable} from '@angular/core';
import {
    BehaviorSubject,
    Observable
} from 'rxjs';
import jwt_decode from 'jwt-decode';

import {TokenJwt} from '@/core/autenticacao/models/token-jwt.model';
import {TokenPayload} from '@/core/autenticacao/models/token-payload.model';
import {TokenService} from '@/core/autenticacao/services/token.service';
import {AutorizacaoService} from '@/core/autorizacao/services/autorizacao.service';

@Injectable({
    providedIn: 'root'
})
export class UsuarioAutenticadoService {
    private readonly usuarioSubject =
        new BehaviorSubject<TokenPayload | null>(
            null
        );

    constructor(
        private tokenService: TokenService,
        private autorizacaoService:
            AutorizacaoService
    ) {
        if (this.tokenService.possuiToken()) {
            this.decodificarJWT();
        }
    }

    decodificarJWT(): void {
        const token =
            this.tokenService.retornarToken();

        if (!token) {
            this.usuarioSubject.next(null);
            return;
        }

        try {
            const usuario =
                jwt_decode<TokenPayload>(token);

            this.usuarioSubject.next(usuario);
        } catch {
            this.tokenService.excluirTokens();
            this.autorizacaoService.limpar();
            this.usuarioSubject.next(null);
        }
    }

    retornarUser():
        Observable<TokenPayload | null> {
        return this.usuarioSubject.asObservable();
    }

    retornarToken(): string {
        return this.tokenService.retornarToken();
    }

    salvarTokens(tokens: TokenJwt): void {
        this.tokenService.salvarToken(
            tokens.token
        );

        this.tokenService.salvarRefreshToken(
            tokens.refreshToken
        );

        this.decodificarJWT();
    }

    logout(): void {
        this.tokenService.excluirTokens();
        this.autorizacaoService.limpar();
        this.usuarioSubject.next(null);
    }

    estaLogado(): boolean {
        return this.tokenService.possuiToken();
    }
}
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TokenService } from '@/core/autenticacao/services/token.service';
import { environment } from 'environments/environment';

@Injectable()
export class AutenticacaoInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        if (!this.deveAdicionarToken(request)) {
            return next.handle(request);
        }

        const token = this.tokenService.retornarToken();

        const requestAutenticada = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next.handle(requestAutenticada);
    }

    private deveAdicionarToken(
        request: HttpRequest<unknown>
    ): boolean {
        const pertenceApi = request.url.startsWith(
            environment.api
        );

        const pertenceAutenticacao = request.url.startsWith(
            `${environment.api}/login`
        );

        return (
            pertenceApi &&
            !pertenceAutenticacao &&
            this.tokenService.possuiToken()
        );
    }
}
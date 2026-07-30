import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import {
    Injectable,
    Injector
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
    catchError,
    finalize,
    Observable,
    shareReplay,
    switchMap,
    throwError
} from 'rxjs';

import { TokenJwt } from '@/core/autenticacao/models/token-jwt.model';
import { AutenticacaoService } from '@/core/autenticacao/services/autenticacao.service';
import { MensagemAutenticacaoService } from '@/core/autenticacao/services/mensagem-autenticacao.service';
import { TokenService } from '@/core/autenticacao/services/token.service';
import { UsuarioAutenticadoService } from '@/core/autenticacao/services/usuario-autenticado.service';
import { environment } from 'environments/environment';

@Injectable()
export class AutenticacaoInterceptor implements HttpInterceptor {
    private refreshEmAndamento$:
        Observable<TokenJwt> | null = null;

    private sessaoEncerrada = false;

    constructor(
        private tokenService: TokenService,
        private usuarioAutenticadoService:
            UsuarioAutenticadoService,
        private mensagemAutenticacaoService:
            MensagemAutenticacaoService,
        private toastr: ToastrService,
        private router: Router,
        private injector: Injector
    ) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        if (!this.ehRequisicaoProtegida(request)) {
            return next.handle(request);
        }

        const requestPreparada =
            this.adicionarTokenSeDisponivel(request);

        return next.handle(requestPreparada).pipe(
            catchError((erro: unknown) => {
                if (this.ehErroAcessoNegado(erro)) {
                    this.notificarAcessoNegado();

                    return throwError(() => erro);
                }

                if (!this.ehErroNaoAutenticado(erro)) {
                    return throwError(() => erro);
                }

                if (
                    !this.tokenService
                        .possuiRefreshToken()
                ) {
                    this.encerrarSessaoLocal();

                    return throwError(() => erro);
                }

                return this.renovarERepetir(
                    request,
                    next
                );
            })
        );
    }

    private ehRequisicaoProtegida(
        request: HttpRequest<unknown>
    ): boolean {
        const api =
            environment.api.replace(
                /\/+$/,
                ''
            );

        const pertenceApi =
            request.url === api ||
            request.url.startsWith(
                `${api}/`
            );

        if (!pertenceApi) {
            return false;
        }

        const urlSemParametros =
            request.url.split('?')[0];

        const rotasPublicas =
            new Set<string>([
                `${api}/login`,
                `${api}/login/refresh`,
                `${api}/login/logout`,
                `${api}/login/sso`
            ]);

        return !rotasPublicas.has(
            urlSemParametros
        );
    }

    private adicionarTokenSeDisponivel(
        request: HttpRequest<unknown>
    ): HttpRequest<unknown> {
        if (!this.tokenService.possuiToken()) {
            return request;
        }

        this.sessaoEncerrada = false;

        return this.adicionarToken(
            request,
            this.tokenService.retornarToken()
        );
    }

    private adicionarToken(
        request: HttpRequest<unknown>,
        token: string
    ): HttpRequest<unknown> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private ehErroNaoAutenticado(
        erro: unknown
    ): erro is HttpErrorResponse {
        return (
            erro instanceof HttpErrorResponse &&
            erro.status === 401
        );
    }

    private ehErroAcessoNegado(
        erro: unknown
    ): erro is HttpErrorResponse {
        return (
            erro instanceof HttpErrorResponse &&
            erro.status === 403
        );
    }

    private renovarERepetir(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return this.obterRefreshCompartilhado().pipe(
            switchMap((tokens) => {
                const requestRenovada =
                    this.adicionarToken(
                        request,
                        tokens.token
                    );

                return next.handle(
                    requestRenovada
                );
            }),
            catchError((erro: unknown) => {
                this.encerrarSessaoLocal();

                return throwError(() => erro);
            })
        );
    }

    private obterRefreshCompartilhado():
        Observable<TokenJwt> {
        if (!this.refreshEmAndamento$) {
            const autenticacaoService =
                this.injector.get(
                    AutenticacaoService
                );

            this.refreshEmAndamento$ =
                autenticacaoService
                    .renovarToken()
                    .pipe(
                        finalize(() => {
                            this.refreshEmAndamento$ =
                                null;
                        }),
                        shareReplay({
                            bufferSize: 1,
                            refCount: false
                        })
                    );
        }

        return this.refreshEmAndamento$;
    }

    private encerrarSessaoLocal(): void {
        if (this.sessaoEncerrada) {
            return;
        }

        this.sessaoEncerrada = true;

        this.usuarioAutenticadoService.logout();

        this.toastr.warning(
            this.mensagemAutenticacaoService
                .obterMensagemSessaoExpirada()
        );

        this.router.navigate(['/login']);
    }

    private notificarAcessoNegado(): void {
        this.toastr.error(
            this.mensagemAutenticacaoService
                .obterMensagemAcessoNegado()
        );
    }
}
import {
    HttpErrorResponse,
    HttpHandler,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
    of,
    Subject,
    throwError
} from 'rxjs';

import { TokenJwt } from '@/core/autenticacao/models/token-jwt.model';
import { AutenticacaoService } from '@/core/autenticacao/services/autenticacao.service';
import { TokenService } from '@/core/autenticacao/services/token.service';
import { UsuarioAutenticadoService } from '@/core/autenticacao/services/usuario-autenticado.service';
import { environment } from 'environments/environment';

import { AutenticacaoInterceptor } from './autenticacao.interceptor';

describe('AutenticacaoInterceptor', () => {
    let interceptor: AutenticacaoInterceptor;
    let tokenServiceMock:
        jasmine.SpyObj<TokenService>;
    let autenticacaoServiceMock:
        jasmine.SpyObj<AutenticacaoService>;
    let usuarioAutenticadoServiceMock:
        jasmine.SpyObj<UsuarioAutenticadoService>;
    let routerMock:
        jasmine.SpyObj<Router>;
    let httpHandlerMock:
        jasmine.SpyObj<HttpHandler>;

    beforeEach(() => {
        tokenServiceMock =
            jasmine.createSpyObj<TokenService>(
                'TokenService',
                [
                    'possuiToken',
                    'retornarToken',
                    'possuiRefreshToken'
                ]
            );

        autenticacaoServiceMock =
            jasmine.createSpyObj<AutenticacaoService>(
                'AutenticacaoService',
                ['renovarToken']
            );

        usuarioAutenticadoServiceMock =
            jasmine.createSpyObj<UsuarioAutenticadoService>(
                'UsuarioAutenticadoService',
                ['logout']
            );

        routerMock = jasmine.createSpyObj<Router>(
            'Router',
            ['navigate']
        );

        httpHandlerMock = jasmine.createSpyObj<HttpHandler>(
            'HttpHandler',
            ['handle']
        );

        const tokensRenovados: TokenJwt = {
            token: 'novo-access-token',
            refreshToken: 'novo-refresh-token'
        };

        tokenServiceMock.possuiToken.and.returnValue(true);

        tokenServiceMock.retornarToken.and.returnValue(
            'access-token'
        );

        tokenServiceMock.possuiRefreshToken.and.returnValue(
            true
        );

        autenticacaoServiceMock.renovarToken.and.returnValue(
            of(tokensRenovados)
        );

        httpHandlerMock.handle.and.returnValue(
            of(
                new HttpResponse({
                    status: 200
                })
            )
        );

        TestBed.configureTestingModule({
            providers: [
                AutenticacaoInterceptor,
                {
                    provide: TokenService,
                    useValue: tokenServiceMock
                },
                {
                    provide: AutenticacaoService,
                    useValue: autenticacaoServiceMock
                },
                {
                    provide: UsuarioAutenticadoService,
                    useValue: usuarioAutenticadoServiceMock
                },
                {
                    provide: Router,
                    useValue: routerMock
                }
            ]
        });

        interceptor = TestBed.inject(
            AutenticacaoInterceptor
        );
    });

    it('deve ser criado', () => {
        expect(interceptor).toBeTruthy();
    });

    it('deve adicionar bearer em requisição protegida da API', () => {
        const request = new HttpRequest(
            'GET',
            `${environment.api}/perfil`
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe();

        const requestEncaminhada =
            httpHandlerMock.handle.calls
                .mostRecent()
                .args[0] as HttpRequest<unknown>;

        expect(
            requestEncaminhada.headers.get(
                'Authorization'
            )
        ).toBe('Bearer access-token');

        expect(
            tokenServiceMock.possuiToken
        ).toHaveBeenCalled();

        expect(
            tokenServiceMock.retornarToken
        ).toHaveBeenCalled();
    });

    it('não deve adicionar bearer quando não houver token', () => {
        tokenServiceMock.possuiToken.and.returnValue(false);

        const request = new HttpRequest(
            'GET',
            `${environment.api}/perfil`
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe();

        const requestEncaminhada =
            httpHandlerMock.handle.calls
                .mostRecent()
                .args[0] as HttpRequest<unknown>;

        expect(
            requestEncaminhada.headers.has(
                'Authorization'
            )
        ).toBeFalse();

        expect(
            tokenServiceMock.retornarToken
        ).not.toHaveBeenCalled();
    });

    [
        '/login',
        '/login/refresh',
        '/login/logout',
        '/login/sso'
    ].forEach((rota) => {
        it(`não deve adicionar bearer em ${rota}`, () => {
            const request = new HttpRequest(
                'POST',
                `${environment.api}${rota}`,
                null
            );

            interceptor
                .intercept(request, httpHandlerMock)
                .subscribe();

            const requestEncaminhada =
                httpHandlerMock.handle.calls
                    .mostRecent()
                    .args[0] as HttpRequest<unknown>;

            expect(
                requestEncaminhada.headers.has(
                    'Authorization'
                )
            ).toBeFalse();

            expect(
                tokenServiceMock.retornarToken
            ).not.toHaveBeenCalled();

            expect(
                autenticacaoServiceMock.renovarToken
            ).not.toHaveBeenCalled();
        });
    });

    it('não deve adicionar bearer em endereço externo', () => {
        const request = new HttpRequest(
            'GET',
            'https://api.externa.com/dados'
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe();

        const requestEncaminhada =
            httpHandlerMock.handle.calls
                .mostRecent()
                .args[0] as HttpRequest<unknown>;

        expect(
            requestEncaminhada.headers.has(
                'Authorization'
            )
        ).toBeFalse();

        expect(
            tokenServiceMock.retornarToken
        ).not.toHaveBeenCalled();

        expect(
            autenticacaoServiceMock.renovarToken
        ).not.toHaveBeenCalled();
    });

    it('deve renovar o token e repetir a requisição após 401', () => {
        const erro401 = new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
            url: `${environment.api}/perfil`
        });

        httpHandlerMock.handle.and.returnValues(
            throwError(() => erro401),
            of(
                new HttpResponse({
                    status: 200,
                    body: {
                        id: 1,
                        nome: 'Administrador'
                    }
                })
            )
        );

        const request = new HttpRequest(
            'GET',
            `${environment.api}/perfil`
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe((response) => {
                expect(response).toBeInstanceOf(
                    HttpResponse
                );
            });

        expect(
            autenticacaoServiceMock.renovarToken
        ).toHaveBeenCalledTimes(1);

        expect(
            httpHandlerMock.handle
        ).toHaveBeenCalledTimes(2);

        const requestRepetida =
            httpHandlerMock.handle.calls
                .argsFor(1)[0] as HttpRequest<unknown>;

        expect(
            requestRepetida.headers.get(
                'Authorization'
            )
        ).toBe('Bearer novo-access-token');

        expect(
            usuarioAutenticadoServiceMock.logout
        ).not.toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });

    it('deve encerrar a sessão quando o refresh for inválido', () => {
        const erroAccessToken = new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
            url: `${environment.api}/perfil`
        });

        const erroRefreshToken = new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
            url: `${environment.api}/login/refresh`,
            error: {
                status: 401,
                erro: 'REFRESH_TOKEN_INVALIDO',
                mensagem: 'Refresh token inválido'
            }
        });

        httpHandlerMock.handle.and.returnValue(
            throwError(() => erroAccessToken)
        );

        autenticacaoServiceMock.renovarToken.and.returnValue(
            throwError(() => erroRefreshToken)
        );

        const request = new HttpRequest(
            'GET',
            `${environment.api}/perfil`
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe({
                next: () => {
                    fail(
                        'A requisição deveria falhar'
                    );
                },
                error: (erro) => {
                    expect(erro).toBe(
                        erroRefreshToken
                    );
                }
            });

        expect(
            autenticacaoServiceMock.renovarToken
        ).toHaveBeenCalledTimes(1);

        expect(
            httpHandlerMock.handle
        ).toHaveBeenCalledTimes(1);

        expect(
            usuarioAutenticadoServiceMock.logout
        ).toHaveBeenCalledTimes(1);

        expect(
            routerMock.navigate
        ).toHaveBeenCalledOnceWith(['/login']);
    });

    it('deve encerrar a sessão quando não houver refresh token', () => {
        const erro401 = new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
            url: `${environment.api}/perfil`
        });

        tokenServiceMock.possuiRefreshToken.and.returnValue(
            false
        );

        httpHandlerMock.handle.and.returnValue(
            throwError(() => erro401)
        );

        const request = new HttpRequest(
            'GET',
            `${environment.api}/perfil`
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe({
                next: () => {
                    fail(
                        'A requisição deveria falhar'
                    );
                },
                error: (erro) => {
                    expect(erro).toBe(erro401);
                }
            });

        expect(
            autenticacaoServiceMock.renovarToken
        ).not.toHaveBeenCalled();

        expect(
            httpHandlerMock.handle
        ).toHaveBeenCalledTimes(1);

        expect(
            usuarioAutenticadoServiceMock.logout
        ).toHaveBeenCalledTimes(1);

        expect(
            routerMock.navigate
        ).toHaveBeenCalledOnceWith(['/login']);
    });

    it('não deve renovar token nem encerrar sessão após 403', () => {
        const erro403 = new HttpErrorResponse({
            status: 403,
            statusText: 'Forbidden',
            url: `${environment.api}/perfil`,
            error: {
                status: 403,
                erro: 'ACESSO_NEGADO',
                mensagem: 'Acesso negado'
            }
        });

        httpHandlerMock.handle.and.returnValue(
            throwError(() => erro403)
        );

        const request = new HttpRequest(
            'GET',
            `${environment.api}/perfil`
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe({
                next: () => {
                    fail(
                        'A requisição deveria falhar'
                    );
                },
                error: (erro) => {
                    expect(erro).toBe(erro403);
                }
            });

        expect(
            autenticacaoServiceMock.renovarToken
        ).not.toHaveBeenCalled();

        expect(
            usuarioAutenticadoServiceMock.logout
        ).not.toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();

        expect(
            httpHandlerMock.handle
        ).toHaveBeenCalledTimes(1);
    });

    it('deve compartilhar um único refresh entre requisições simultâneas', () => {
        const erro401 = new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized'
        });

        const refreshSubject =
            new Subject<TokenJwt>();

        autenticacaoServiceMock.renovarToken.and.returnValue(
            refreshSubject.asObservable()
        );

        let quantidadeChamadas = 0;

        httpHandlerMock.handle.and.callFake(() => {
            quantidadeChamadas++;

            if (quantidadeChamadas <= 2) {
                return throwError(() => erro401);
            }

            return of(
                new HttpResponse({
                    status: 200
                })
            );
        });

        const primeiraRequest = new HttpRequest(
            'GET',
            `${environment.api}/perfil`
        );

        const segundaRequest = new HttpRequest(
            'GET',
            `${environment.api}/permissao`
        );

        interceptor
            .intercept(
                primeiraRequest,
                httpHandlerMock
            )
            .subscribe();

        interceptor
            .intercept(
                segundaRequest,
                httpHandlerMock
            )
            .subscribe();

        expect(
            autenticacaoServiceMock.renovarToken
        ).toHaveBeenCalledTimes(1);

        refreshSubject.next({
            token: 'token-compartilhado',
            refreshToken:
                'novo-refresh-compartilhado'
        });

        refreshSubject.complete();

        expect(
            httpHandlerMock.handle
        ).toHaveBeenCalledTimes(4);

        const primeiraRepeticao =
            httpHandlerMock.handle.calls
                .argsFor(2)[0] as HttpRequest<unknown>;

        const segundaRepeticao =
            httpHandlerMock.handle.calls
                .argsFor(3)[0] as HttpRequest<unknown>;

        expect(
            primeiraRepeticao.headers.get(
                'Authorization'
            )
        ).toBe('Bearer token-compartilhado');

        expect(
            segundaRepeticao.headers.get(
                'Authorization'
            )
        ).toBe('Bearer token-compartilhado');

        expect(
            usuarioAutenticadoServiceMock.logout
        ).not.toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });
});
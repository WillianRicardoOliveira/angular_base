import {
    HttpErrorResponse,
    HttpHandler,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, Subject, throwError } from 'rxjs';

import { TokenJwt } from '@/core/autenticacao/models/token-jwt.model';
import { AutenticacaoService } from '@/core/autenticacao/services/autenticacao.service';
import { MensagemAutenticacaoService } from '@/core/autenticacao/services/mensagem-autenticacao.service';
import { TokenService } from '@/core/autenticacao/services/token.service';
import { UsuarioAutenticadoService } from '@/core/autenticacao/services/usuario-autenticado.service';
import { ContextoOrganizacaoService } from '@/core/organizacao/services/contexto-organizacao.service';
import { environment } from 'environments/environment';

import { AutenticacaoInterceptor } from './autenticacao.interceptor';

describe('AutenticacaoInterceptor', () => {
    let interceptor: AutenticacaoInterceptor;
    let tokenServiceMock: jasmine.SpyObj<TokenService>;
    let autenticacaoServiceMock: jasmine.SpyObj<AutenticacaoService>;
    let usuarioAutenticadoServiceMock:
        jasmine.SpyObj<UsuarioAutenticadoService>;
    let mensagemAutenticacaoServiceMock:
        jasmine.SpyObj<MensagemAutenticacaoService>;
    let contextoOrganizacaoServiceMock:
        jasmine.SpyObj<ContextoOrganizacaoService>;
    let toastrMock: jasmine.SpyObj<ToastrService>;
    let routerMock: jasmine.SpyObj<Router>;
    let httpHandlerMock: jasmine.SpyObj<HttpHandler>;

    beforeEach(() => {
        tokenServiceMock = jasmine.createSpyObj<TokenService>(
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

        mensagemAutenticacaoServiceMock =
            jasmine.createSpyObj<MensagemAutenticacaoService>(
                'MensagemAutenticacaoService',
                [
                    'obterMensagemSessaoExpirada',
                    'obterMensagemAcessoNegado'
                ]
            );

        contextoOrganizacaoServiceMock =
            jasmine.createSpyObj<ContextoOrganizacaoService>(
                'ContextoOrganizacaoService',
                [
                    'retornarIdOrganizacaoAtiva',
                    'limpar'
                ]
            );

        toastrMock = jasmine.createSpyObj<ToastrService>(
            'ToastrService',
            ['warning', 'error']
        );

        routerMock = jasmine.createSpyObj<Router>(
            'Router',
            ['navigate']
        );

        httpHandlerMock = jasmine.createSpyObj<HttpHandler>(
            'HttpHandler',
            ['handle']
        );

        tokenServiceMock.possuiToken.and.returnValue(true);
        tokenServiceMock.retornarToken.and.returnValue(
            'access-token'
        );
        tokenServiceMock.possuiRefreshToken.and.returnValue(
            true
        );

        contextoOrganizacaoServiceMock
            .retornarIdOrganizacaoAtiva
            .and.returnValue(null);

        autenticacaoServiceMock.renovarToken.and.returnValue(
            of({
                token: 'novo-access-token',
                refreshToken: 'novo-refresh-token'
            })
        );

        mensagemAutenticacaoServiceMock
            .obterMensagemSessaoExpirada
            .and.returnValue(
                'Sua sessao expirou. Entre novamente.'
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemAcessoNegado
            .and.returnValue(
                'Voce nao possui permissao para executar esta acao.'
            );

        httpHandlerMock.handle.and.returnValue(
            of(new HttpResponse({status: 200}))
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
                    provide: MensagemAutenticacaoService,
                    useValue: mensagemAutenticacaoServiceMock
                },
                {
                    provide: ContextoOrganizacaoService,
                    useValue: contextoOrganizacaoServiceMock
                },
                {
                    provide: ToastrService,
                    useValue: toastrMock
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

    it('deve adicionar bearer em requisicao protegida da API', () => {
        interceptor
            .intercept(
                criarRequestProtegida('/perfil'),
                httpHandlerMock
            )
            .subscribe();

        const request = obterRequestDaChamada(0);

        expect(
            request.headers.get('Authorization')
        ).toBe('Bearer access-token');

        expect(
            request.headers.has('X-Organizacao-Id')
        ).toBeFalse();

        expect(
            tokenServiceMock.possuiToken
        ).toHaveBeenCalled();

        expect(
            tokenServiceMock.retornarToken
        ).toHaveBeenCalled();
    });

    it('deve adicionar contexto de organizacao em rota operacional', () => {
        contextoOrganizacaoServiceMock
            .retornarIdOrganizacaoAtiva
            .and.returnValue(10);

        interceptor
            .intercept(
                criarRequestProtegida('/perfil'),
                httpHandlerMock
            )
            .subscribe();

        const request = obterRequestDaChamada(0);

        expect(
            request.headers.get('Authorization')
        ).toBe('Bearer access-token');

        expect(
            request.headers.get('X-Organizacao-Id')
        ).toBe('10');
    });

    it('deve adicionar bearer ao consultar permissoes do usuario', () => {
        const request = new HttpRequest(
            'GET',
            `${environment.api}/login/permissoes`
        );

        interceptor
            .intercept(
                request,
                httpHandlerMock
            )
            .subscribe();

        const requestEnviada =
            obterRequestDaChamada(0);

        expect(
            requestEnviada.headers.get(
                'Authorization'
            )
        ).toBe(
            'Bearer access-token'
        );

        expect(
            requestEnviada.headers.has(
                'X-Organizacao-Id'
            )
        ).toBeFalse();

        expect(
            tokenServiceMock.possuiToken
        ).toHaveBeenCalled();

        expect(
            tokenServiceMock.retornarToken
        ).toHaveBeenCalled();

        expect(
            autenticacaoServiceMock.renovarToken
        ).not.toHaveBeenCalled();
    });

    it('deve adicionar contexto ao consultar permissoes do usuario', () => {
        contextoOrganizacaoServiceMock
            .retornarIdOrganizacaoAtiva
            .and.returnValue(10);

        const request = new HttpRequest(
            'GET',
            `${environment.api}/login/permissoes`
        );

        interceptor
            .intercept(
                request,
                httpHandlerMock
            )
            .subscribe();

        const requestEnviada =
            obterRequestDaChamada(0);

        expect(
            requestEnviada.headers.get(
                'Authorization'
            )
        ).toBe(
            'Bearer access-token'
        );

        expect(
            requestEnviada.headers.get(
                'X-Organizacao-Id'
            )
        ).toBe('10');
    });

    it('nao deve adicionar bearer quando nao houver token', () => {
        tokenServiceMock.possuiToken.and.returnValue(false);

        contextoOrganizacaoServiceMock
            .retornarIdOrganizacaoAtiva
            .and.returnValue(10);

        interceptor
            .intercept(
                criarRequestProtegida('/perfil'),
                httpHandlerMock
            )
            .subscribe();

        const request = obterRequestDaChamada(0);

        expect(
            request.headers.has('Authorization')
        ).toBeFalse();

        expect(
            request.headers.has('X-Organizacao-Id')
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
        it(`nao deve adicionar bearer em ${rota}`, () => {
            const request = new HttpRequest(
                'POST',
                `${environment.api}${rota}`,
                null
            );

            interceptor
                .intercept(request, httpHandlerMock)
                .subscribe();

            expect(
                obterRequestDaChamada(0)
                    .headers.has('Authorization')
            ).toBeFalse();

            expect(
                obterRequestDaChamada(0)
                    .headers.has('X-Organizacao-Id')
            ).toBeFalse();

            expect(
                autenticacaoServiceMock.renovarToken
            ).not.toHaveBeenCalled();
        });
    });

    it('nao deve adicionar contexto ao listar organizacoes disponiveis', () => {
        contextoOrganizacaoServiceMock
            .retornarIdOrganizacaoAtiva
            .and.returnValue(10);

        const request = new HttpRequest(
            'GET',
            `${environment.api}/organizacao/disponiveis`
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe();

        const requestEnviada =
            obterRequestDaChamada(0);

        expect(
            requestEnviada.headers.get('Authorization')
        ).toBe('Bearer access-token');

        expect(
            requestEnviada.headers.has('X-Organizacao-Id')
        ).toBeFalse();
    });

    it('nao deve adicionar contexto em endpoint da plataforma', () => {
        contextoOrganizacaoServiceMock
            .retornarIdOrganizacaoAtiva
            .and.returnValue(10);

        const request = new HttpRequest(
            'GET',
            `${environment.api}/plataforma/organizacao`
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe();

        const requestEnviada =
            obterRequestDaChamada(0);

        expect(
            requestEnviada.headers.get('Authorization')
        ).toBe('Bearer access-token');

        expect(
            requestEnviada.headers.has('X-Organizacao-Id')
        ).toBeFalse();
    });

    it('nao deve adicionar bearer em endereco externo', () => {
        const request = new HttpRequest(
            'GET',
            'https://api.externa.com/dados'
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe();

        expect(
            obterRequestDaChamada(0)
                .headers.has('Authorization')
        ).toBeFalse();

        expect(
            obterRequestDaChamada(0)
                .headers.has('X-Organizacao-Id')
        ).toBeFalse();

        expect(
            autenticacaoServiceMock.renovarToken
        ).not.toHaveBeenCalled();
    });

    it('nao deve adicionar bearer em dominio externo parecido com a API', () => {
        const request = new HttpRequest(
            'GET',
            `${environment.api}.evil.com/dados`
        );

        interceptor
            .intercept(
                request,
                httpHandlerMock
            )
            .subscribe();

        const requestEnviada =
            obterRequestDaChamada(0);

        expect(
            requestEnviada.headers.has(
                'Authorization'
            )
        ).toBeFalse();

        expect(
            requestEnviada.headers.has(
                'X-Organizacao-Id'
            )
        ).toBeFalse();

        expect(
            tokenServiceMock.possuiToken
        ).not.toHaveBeenCalled();

        expect(
            tokenServiceMock.retornarToken
        ).not.toHaveBeenCalled();

        expect(
            autenticacaoServiceMock
                .renovarToken
        ).not.toHaveBeenCalled();
    });

    it('deve renovar o token e repetir a requisicao apos 401', () => {
        const erro401 = criarErroHttp(
            401,
            `${environment.api}/perfil`
        );

        httpHandlerMock.handle.and.returnValues(
            throwError(() => erro401),
            of(new HttpResponse({status: 200}))
        );

        interceptor
            .intercept(
                criarRequestProtegida('/perfil'),
                httpHandlerMock
            )
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

        expect(
            obterRequestDaChamada(1)
                .headers.get('Authorization')
        ).toBe('Bearer novo-access-token');

        expect(
            obterRequestDaChamada(1)
                .headers.has('X-Organizacao-Id')
        ).toBeFalse();

        expect(
            usuarioAutenticadoServiceMock.logout
        ).not.toHaveBeenCalled();

        expect(
            contextoOrganizacaoServiceMock.limpar
        ).not.toHaveBeenCalled();

        expect(
            toastrMock.warning
        ).not.toHaveBeenCalled();

        expect(
            toastrMock.error
        ).not.toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });

    it('deve manter contexto ao repetir requisicao apos refresh', () => {
        contextoOrganizacaoServiceMock
            .retornarIdOrganizacaoAtiva
            .and.returnValue(10);

        const erro401 = criarErroHttp(
            401,
            `${environment.api}/perfil`
        );

        httpHandlerMock.handle.and.returnValues(
            throwError(() => erro401),
            of(new HttpResponse({status: 200}))
        );

        interceptor
            .intercept(
                criarRequestProtegida('/perfil'),
                httpHandlerMock
            )
            .subscribe();

        const requestRepetida =
            obterRequestDaChamada(1);

        expect(
            requestRepetida.headers.get('Authorization')
        ).toBe('Bearer novo-access-token');

        expect(
            requestRepetida.headers.get('X-Organizacao-Id')
        ).toBe('10');

        expect(
            contextoOrganizacaoServiceMock.limpar
        ).not.toHaveBeenCalled();
    });

    it('deve encerrar a sessao quando o refresh for invalido', () => {
        const erroAccessToken = criarErroHttp(
            401,
            `${environment.api}/perfil`
        );

        const erroRefreshToken =
            criarErroRefreshInvalido();

        httpHandlerMock.handle.and.returnValue(
            throwError(() => erroAccessToken)
        );

        autenticacaoServiceMock.renovarToken.and.returnValue(
            throwError(() => erroRefreshToken)
        );

        interceptor
            .intercept(
                criarRequestProtegida('/perfil'),
                httpHandlerMock
            )
            .subscribe({
                next: () => {
                    fail('A requisicao deveria falhar');
                },
                error: (erro) => {
                    expect(erro).toBe(
                        erroRefreshToken
                    );
                }
            });

        expectEncerramentoUnico();
        expect(toastrMock.error).not.toHaveBeenCalled();
    });

    it('deve encerrar a sessao quando nao houver refresh token', () => {
        const erro401 = criarErroHttp(
            401,
            `${environment.api}/perfil`
        );

        tokenServiceMock.possuiRefreshToken.and.returnValue(
            false
        );

        httpHandlerMock.handle.and.returnValue(
            throwError(() => erro401)
        );

        interceptor
            .intercept(
                criarRequestProtegida('/perfil'),
                httpHandlerMock
            )
            .subscribe({
                next: () => {
                    fail('A requisicao deveria falhar');
                },
                error: (erro) => {
                    expect(erro).toBe(erro401);
                }
            });

        expect(
            autenticacaoServiceMock.renovarToken
        ).not.toHaveBeenCalled();

        expectEncerramentoUnico();
        expect(toastrMock.error).not.toHaveBeenCalled();
    });

    it('nao deve renovar token nem encerrar sessao apos 403', () => {
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

        interceptor
            .intercept(
                criarRequestProtegida('/perfil'),
                httpHandlerMock
            )
            .subscribe({
                next: () => {
                    fail('A requisicao deveria falhar');
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
            contextoOrganizacaoServiceMock.limpar
        ).not.toHaveBeenCalled();

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemAcessoNegado
        ).toHaveBeenCalledTimes(1);

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Voce nao possui permissao para executar esta acao.'
        );

        expect(
            toastrMock.warning
        ).not.toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });

    it('deve compartilhar um unico refresh entre requisicoes simultaneas', () => {
        const erro401 = criarErroHttp(
            401,
            `${environment.api}/recurso`
        );

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

            return of(new HttpResponse({status: 200}));
        });

        interceptor
            .intercept(
                criarRequestProtegida('/perfil'),
                httpHandlerMock
            )
            .subscribe();

        interceptor
            .intercept(
                criarRequestProtegida('/permissao'),
                httpHandlerMock
            )
            .subscribe();

        expect(
            autenticacaoServiceMock.renovarToken
        ).toHaveBeenCalledTimes(1);

        refreshSubject.next({
            token: 'token-compartilhado',
            refreshToken: 'refresh-compartilhado'
        });

        refreshSubject.complete();

        expect(
            httpHandlerMock.handle
        ).toHaveBeenCalledTimes(4);

        expect(
            obterRequestDaChamada(2)
                .headers.get('Authorization')
        ).toBe('Bearer token-compartilhado');

        expect(
            obterRequestDaChamada(3)
                .headers.get('Authorization')
        ).toBe('Bearer token-compartilhado');

        expect(
            usuarioAutenticadoServiceMock.logout
        ).not.toHaveBeenCalled();

        expect(
            contextoOrganizacaoServiceMock.limpar
        ).not.toHaveBeenCalled();

        expect(
            toastrMock.warning
        ).not.toHaveBeenCalled();

        expect(
            toastrMock.error
        ).not.toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });

    it('deve encerrar a sessao uma unica vez quando o refresh compartilhado falhar', () => {
        const erro401 = criarErroHttp(
            401,
            `${environment.api}/recurso`
        );

        const erroRefresh =
            criarErroRefreshInvalido();

        const refreshSubject =
            new Subject<TokenJwt>();

        autenticacaoServiceMock.renovarToken.and.returnValue(
            refreshSubject.asObservable()
        );

        httpHandlerMock.handle.and.returnValue(
            throwError(() => erro401)
        );

        interceptor
            .intercept(
                criarRequestProtegida('/perfil'),
                httpHandlerMock
            )
            .subscribe({
                error: (erro) => {
                    expect(erro).toBe(erroRefresh);
                }
            });

        interceptor
            .intercept(
                criarRequestProtegida('/permissao'),
                httpHandlerMock
            )
            .subscribe({
                error: (erro) => {
                    expect(erro).toBe(erroRefresh);
                }
            });

        expect(
            autenticacaoServiceMock.renovarToken
        ).toHaveBeenCalledTimes(1);

        refreshSubject.error(erroRefresh);

        expectEncerramentoUnico();
    });

    function criarRequestProtegida(
        rota: string
    ): HttpRequest<unknown> {
        return new HttpRequest(
            'GET',
            `${environment.api}${rota}`
        );
    }

    function criarErroHttp(
        status: number,
        url: string
    ): HttpErrorResponse {
        return new HttpErrorResponse({
            status,
            statusText:
                status === 401
                    ? 'Unauthorized'
                    : 'Erro',
            url
        });
    }

    function criarErroRefreshInvalido():
        HttpErrorResponse {
        return new HttpErrorResponse({
            status: 401,
            statusText: 'Unauthorized',
            url: `${environment.api}/login/refresh`,
            error: {
                status: 401,
                erro: 'REFRESH_TOKEN_INVALIDO',
                mensagem: 'Refresh token invalido'
            }
        });
    }

    function obterRequestDaChamada(
        indice: number
    ): HttpRequest<unknown> {
        return httpHandlerMock.handle.calls
            .argsFor(indice)[0] as HttpRequest<unknown>;
    }

    function expectEncerramentoUnico(): void {
        expect(
            usuarioAutenticadoServiceMock.logout
        ).toHaveBeenCalledTimes(1);

        expect(
            contextoOrganizacaoServiceMock.limpar
        ).toHaveBeenCalledTimes(1);

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemSessaoExpirada
        ).toHaveBeenCalledTimes(1);

        expect(
            toastrMock.warning
        ).toHaveBeenCalledOnceWith(
            'Sua sessao expirou. Entre novamente.'
        );

        expect(
            routerMock.navigate
        ).toHaveBeenCalledOnceWith(['/login']);
    }
});
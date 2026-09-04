import {
    TestBed
} from '@angular/core/testing';

import {
    ActivatedRouteSnapshot,
    Router,
    UrlTree
} from '@angular/router';

import {
    ToastrService
} from 'ngx-toastr';

import {
    MensagemAutenticacaoService
} from '@/core/autenticacao/services/mensagem-autenticacao.service';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    PermissaoGuard
} from './permissao.guard';

describe('PermissaoGuard', () => {

    const urlTreeMock =
        {} as UrlTree;

    const autorizacaoServiceMock = {
        possuiPermissao:
            jasmine.createSpy(
                'possuiPermissao'
            ),
        possuiAlgumaPermissao:
            jasmine.createSpy(
                'possuiAlgumaPermissao'
            )
    };

    const mensagemAutenticacaoServiceMock = {
        obterMensagemAcessoNegado:
            jasmine.createSpy(
                'obterMensagemAcessoNegado'
            )
    };

    const toastrMock = {
        error:
            jasmine.createSpy(
                'error'
            )
    };

    const routerMock = {
        createUrlTree:
            jasmine.createSpy(
                'createUrlTree'
            )
    };

    beforeEach(() => {
        autorizacaoServiceMock
            .possuiPermissao
            .calls
            .reset();

        autorizacaoServiceMock
            .possuiPermissao
            .and
            .returnValue(false);

        autorizacaoServiceMock
            .possuiAlgumaPermissao
            .calls
            .reset();

        autorizacaoServiceMock
            .possuiAlgumaPermissao
            .and
            .returnValue(false);

        mensagemAutenticacaoServiceMock
            .obterMensagemAcessoNegado
            .calls
            .reset();

        mensagemAutenticacaoServiceMock
            .obterMensagemAcessoNegado
            .and
            .returnValue(
                'Você não possui permissão para executar esta ação.'
            );

        toastrMock.error
            .calls
            .reset();

        routerMock.createUrlTree
            .calls
            .reset();

        routerMock.createUrlTree
            .and
            .returnValue(
                urlTreeMock
            );

        TestBed.configureTestingModule({
            providers: [
                {
                    provide:
                        AutorizacaoService,
                    useValue:
                        autorizacaoServiceMock
                },
                {
                    provide:
                        MensagemAutenticacaoService,
                    useValue:
                        mensagemAutenticacaoServiceMock
                },
                {
                    provide:
                        ToastrService,
                    useValue:
                        toastrMock
                },
                {
                    provide:
                        Router,
                    useValue:
                        routerMock
                }
            ]
        });
    });

    it(
        'deve permitir acesso quando possuir a permissao unica',
        () => {

            autorizacaoServiceMock
                .possuiPermissao
                .and
                .returnValue(true);

            const route =
                criarRouteComPermissao(
                    ChavePermissao
                        .UsuarioListar
                );

            const resultado =
                executarGuard(route);

            expect(resultado)
                .toBeTrue();

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledOnceWith(
                ChavePermissao
                    .UsuarioListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiAlgumaPermissao
            ).not.toHaveBeenCalled();

            esperarAcessoPermitido();
        }
    );

    it(
        'deve bloquear acesso quando nao possuir a permissao unica',
        () => {

            const route =
                criarRouteComPermissao(
                    ChavePermissao
                        .UsuarioListar
                );

            const resultado =
                executarGuard(route);

            expect(resultado)
                .toBe(
                    urlTreeMock
                );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledOnceWith(
                ChavePermissao
                    .UsuarioListar
            );

            expect(
                autorizacaoServiceMock
                    .possuiAlgumaPermissao
            ).not.toHaveBeenCalled();

            esperarAcessoBloqueado();
        }
    );

    it(
        'deve permitir acesso quando possuir uma das permissoes alternativas',
        () => {

            const permissoes = [
                ChavePermissao
                    .EmpresaCriar,
                ChavePermissao
                    .EmpresaListar
            ];

            autorizacaoServiceMock
                .possuiAlgumaPermissao
                .and
                .returnValue(true);

            const route =
                criarRouteComPermissoes(
                    permissoes
                );

            const resultado =
                executarGuard(route);

            expect(resultado)
                .toBeTrue();

            expect(
                autorizacaoServiceMock
                    .possuiAlgumaPermissao
            ).toHaveBeenCalledOnceWith(
                permissoes
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).not.toHaveBeenCalled();

            esperarAcessoPermitido();
        }
    );

    it(
        'deve bloquear quando nao possuir nenhuma permissao alternativa',
        () => {

            const permissoes = [
                ChavePermissao
                    .EmpresaCriar,
                ChavePermissao
                    .EmpresaListar
            ];

            const route =
                criarRouteComPermissoes(
                    permissoes
                );

            const resultado =
                executarGuard(route);

            expect(resultado)
                .toBe(
                    urlTreeMock
                );

            expect(
                autorizacaoServiceMock
                    .possuiAlgumaPermissao
            ).toHaveBeenCalledOnceWith(
                permissoes
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).not.toHaveBeenCalled();

            esperarAcessoBloqueado();
        }
    );

    it(
        'deve bloquear quando a lista de permissoes estiver vazia',
        () => {

            const route =
                criarRouteComPermissoes(
                    []
                );

            const resultado =
                executarGuard(route);

            expect(resultado)
                .toBe(
                    urlTreeMock
                );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).not.toHaveBeenCalled();

            expect(
                autorizacaoServiceMock
                    .possuiAlgumaPermissao
            ).not.toHaveBeenCalled();

            esperarAcessoBloqueado();
        }
    );

    it(
        'deve bloquear quando a rota nao informar permissao',
        () => {

            const route = {
                data: {}
            } as ActivatedRouteSnapshot;

            const resultado =
                executarGuard(route);

            expect(resultado)
                .toBe(
                    urlTreeMock
                );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).not.toHaveBeenCalled();

            expect(
                autorizacaoServiceMock
                    .possuiAlgumaPermissao
            ).not.toHaveBeenCalled();

            esperarAcessoBloqueado();
        }
    );

    function criarRouteComPermissao(
        permissao:
            ChavePermissao
    ): ActivatedRouteSnapshot {

        return {
            data: {
                permissao
            }
        } as unknown as ActivatedRouteSnapshot;
    }

    function criarRouteComPermissoes(
        permissoes:
            readonly ChavePermissao[]
    ): ActivatedRouteSnapshot {

        return {
            data: {
                permissoes
            }
        } as unknown as ActivatedRouteSnapshot;
    }

    function executarGuard(
        route:
            ActivatedRouteSnapshot
    ) {
        return TestBed
            .runInInjectionContext(
                () =>
                    PermissaoGuard(
                        route
                    )
            );
    }

    function esperarAcessoPermitido():
        void {

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemAcessoNegado
        ).not.toHaveBeenCalled();

        expect(
            toastrMock.error
        ).not.toHaveBeenCalled();

        expect(
            routerMock.createUrlTree
        ).not.toHaveBeenCalled();
    }

    function esperarAcessoBloqueado():
        void {

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemAcessoNegado
        ).toHaveBeenCalledTimes(1);

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Você não possui permissão para executar esta ação.'
        );

        expect(
            routerMock.createUrlTree
        ).toHaveBeenCalledOnceWith(
            [
                '/'
            ]
        );
    }
});
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
        possuiPermissao: jasmine.createSpy(
            'possuiPermissao'
        )
    };

    const mensagemAutenticacaoServiceMock = {
        obterMensagemAcessoNegado:
            jasmine
                .createSpy(
                    'obterMensagemAcessoNegado'
                )
                .and.returnValue(
                    'Você não possui permissão para executar esta ação.'
                )
    };

    const toastrMock = {
        error: jasmine.createSpy('error')
    };

    const routerMock = {
        createUrlTree: jasmine
            .createSpy('createUrlTree')
            .and.returnValue(urlTreeMock)
    };

    beforeEach(() => {
        autorizacaoServiceMock
            .possuiPermissao
            .calls
            .reset();

        mensagemAutenticacaoServiceMock
            .obterMensagemAcessoNegado
            .calls
            .reset();

        mensagemAutenticacaoServiceMock
            .obterMensagemAcessoNegado
            .and.returnValue(
                'Você não possui permissão para executar esta ação.'
            );

        toastrMock
            .error
            .calls
            .reset();

        routerMock
            .createUrlTree
            .calls
            .reset();

        routerMock
            .createUrlTree
            .and.returnValue(
                urlTreeMock
            );

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: AutorizacaoService,
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
                    provide: ToastrService,
                    useValue: toastrMock
                },
                {
                    provide: Router,
                    useValue: routerMock
                }
            ]
        });
    });

    it('deve permitir acesso quando usuário possuir a permissão', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(true);

        const route =
            criarRoute(
                ChavePermissao.UsuarioListar
            );

        const resultado =
            executarGuard(route);

        expect(resultado).toBeTrue();

        expect(
            autorizacaoServiceMock
                .possuiPermissao
        ).toHaveBeenCalledOnceWith(
            ChavePermissao.UsuarioListar
        );

        expect(
            toastrMock.error
        ).not.toHaveBeenCalled();

        expect(
            routerMock.createUrlTree
        ).not.toHaveBeenCalled();
    });

    it('deve bloquear acesso quando usuário não possuir a permissão', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(false);

        const route =
            criarRoute(
                ChavePermissao.UsuarioListar
            );

        const resultado =
            executarGuard(route);

        expect(resultado).toBe(
            urlTreeMock
        );

        expect(
            autorizacaoServiceMock
                .possuiPermissao
        ).toHaveBeenCalledOnceWith(
            ChavePermissao.UsuarioListar
        );

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
            ['/']
        );
    });

    it('deve bloquear acesso quando a rota não informar a permissão', () => {
        const route =
            criarRoute();

        const resultado =
            executarGuard(route);

        expect(resultado).toBe(
            urlTreeMock
        );

        expect(
            autorizacaoServiceMock
                .possuiPermissao
        ).not.toHaveBeenCalled();

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
            ['/']
        );
    });

    function criarRoute(
        permissao?: ChavePermissao
    ): ActivatedRouteSnapshot {
        return {
            data: permissao
                ? {
                    permissao
                }
                : {}
        } as ActivatedRouteSnapshot;
    }

    function executarGuard(
        route: ActivatedRouteSnapshot
    ) {
        return TestBed.runInInjectionContext(
            () => PermissaoGuard(route)
        );
    }
});
import {
    TestBed
} from '@angular/core/testing';

import {
    Router,
    UrlTree
} from '@angular/router';

import {
    firstValueFrom,
    of,
    throwError
} from 'rxjs';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    ProximaEtapaConfiguracao
} from '@/domain/configuracao/configuracao-inicial/models/estado-configuracao-inicial.model';

import {
    ConfiguracaoInicialService
} from '@/domain/configuracao/configuracao-inicial/services/configuracao-inicial.service';

import {
    ConfiguracaoInicialPendenteGuard
} from './configuracao-inicial-pendente.guard';

describe(
    'ConfiguracaoInicialPendenteGuard',
    () => {

        let service:
            jasmine.SpyObj<
                ConfiguracaoInicialService
            >;

        let autorizacaoService:
            jasmine.SpyObj<
                AutorizacaoService
            >;

        let router:
            jasmine.SpyObj<
                Router
            >;

        let urlTree:
            UrlTree;

        beforeEach(() => {
            service =
                jasmine.createSpyObj<
                    ConfiguracaoInicialService
                >(
                    'ConfiguracaoInicialService',
                    [
                        'consultar'
                    ]
                );

            autorizacaoService =
                jasmine.createSpyObj<
                    AutorizacaoService
                >(
                    'AutorizacaoService',
                    [
                        'possuiAlgumaPermissao'
                    ]
                );

            router =
                jasmine.createSpyObj<
                    Router
                >(
                    'Router',
                    [
                        'createUrlTree'
                    ]
                );

            urlTree =
                {} as UrlTree;

            autorizacaoService
                .possuiAlgumaPermissao
                .and
                .returnValue(true);

            router.createUrlTree
                .and
                .returnValue(
                    urlTree
                );

            TestBed.configureTestingModule({
                providers: [
                    {
                        provide:
                            ConfiguracaoInicialService,
                        useValue:
                            service
                    },
                    {
                        provide:
                            AutorizacaoService,
                        useValue:
                            autorizacaoService
                    },
                    {
                        provide:
                            Router,
                        useValue:
                            router
                    }
                ]
            });
        });

        it(
            'deve permitir acesso enquanto houver etapa pendente',
            async () => {

                service.consultar
                    .and
                    .returnValue(
                        of({
                            empresaCadastrada:
                                false,
                            proximaEtapa:
                                ProximaEtapaConfiguracao
                                    .Empresa
                        })
                    );

                const resultado =
                    await executarGuard();

                expect(resultado)
                    .toBeTrue();

                expect(
                    service.consultar
                ).toHaveBeenCalledTimes(1);

                expect(
                    autorizacaoService
                        .possuiAlgumaPermissao
                ).not.toHaveBeenCalled();

                expect(
                    router.createUrlTree
                ).not.toHaveBeenCalled();
            }
        );

        it(
            'deve permitir acesso para qualquer etapa futura',
            async () => {

                const etapaFutura =
                    'ESTABELECIMENTO' as unknown as
                    ProximaEtapaConfiguracao;

                service.consultar
                    .and
                    .returnValue(
                        of({
                            empresaCadastrada:
                                true,
                            proximaEtapa:
                                etapaFutura
                        })
                    );

                const resultado =
                    await executarGuard();

                expect(resultado)
                    .toBeTrue();

                expect(
                    autorizacaoService
                        .possuiAlgumaPermissao
                ).not.toHaveBeenCalled();

                expect(
                    router.createUrlTree
                ).not.toHaveBeenCalled();
            }
        );

        it(
            'deve redirecionar para empresas quando estiver concluida e possuir acesso',
            async () => {

                service.consultar
                    .and
                    .returnValue(
                        of({
                            empresaCadastrada:
                                true,
                            proximaEtapa:
                                null
                        })
                    );

                autorizacaoService
                    .possuiAlgumaPermissao
                    .and
                    .returnValue(true);

                const resultado =
                    await executarGuard();

                expect(resultado)
                    .toBe(urlTree);

                expect(
                    autorizacaoService
                        .possuiAlgumaPermissao
                ).toHaveBeenCalledOnceWith([
                    ChavePermissao
                        .EmpresaCriar,
                    ChavePermissao
                        .EmpresaListar
                ]);

                expect(
                    router.createUrlTree
                ).toHaveBeenCalledOnceWith([
                    '/configuracao/empresas'
                ]);
            }
        );

        it(
            'deve redirecionar para inicio quando estiver concluida e nao possuir acesso a empresas',
            async () => {

                service.consultar
                    .and
                    .returnValue(
                        of({
                            empresaCadastrada:
                                true,
                            proximaEtapa:
                                null
                        })
                    );

                autorizacaoService
                    .possuiAlgumaPermissao
                    .and
                    .returnValue(false);

                const resultado =
                    await executarGuard();

                expect(resultado)
                    .toBe(urlTree);

                expect(
                    autorizacaoService
                        .possuiAlgumaPermissao
                ).toHaveBeenCalledOnceWith([
                    ChavePermissao
                        .EmpresaCriar,
                    ChavePermissao
                        .EmpresaListar
                ]);

                expect(
                    router.createUrlTree
                ).toHaveBeenCalledOnceWith([
                    '/'
                ]);
            }
        );

        it(
            'deve permitir exibir a tela de erro quando a consulta falhar',
            async () => {

                service.consultar
                    .and
                    .returnValue(
                        throwError(
                            () =>
                                new Error(
                                    'Falha na consulta'
                                )
                        )
                    );

                const resultado =
                    await executarGuard();

                expect(resultado)
                    .toBeTrue();

                expect(
                    autorizacaoService
                        .possuiAlgumaPermissao
                ).not.toHaveBeenCalled();

                expect(
                    router.createUrlTree
                ).not.toHaveBeenCalled();
            }
        );

        async function executarGuard():
            Promise<boolean | UrlTree> {

            const resultado =
                TestBed
                    .runInInjectionContext(
                        () =>
                            ConfiguracaoInicialPendenteGuard()
                    );

            return firstValueFrom(
                resultado
            );
        }
    }
);
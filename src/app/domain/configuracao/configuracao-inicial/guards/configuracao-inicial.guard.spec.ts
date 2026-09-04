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
    ProximaEtapaConfiguracao
} from '@/domain/configuracao/configuracao-inicial/models/estado-configuracao-inicial.model';

import {
    ConfiguracaoInicialService
} from '@/domain/configuracao/configuracao-inicial/services/configuracao-inicial.service';

import {
    ConfiguracaoInicialGuard
} from './configuracao-inicial.guard';

describe('ConfiguracaoInicialGuard', () => {

    let service:
        jasmine.SpyObj<
            ConfiguracaoInicialService
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
                        Router,
                    useValue:
                        router
                }
            ]
        });
    });

    it(
        'deve permitir acesso quando nao houver proxima etapa',
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

            const resultado =
                await executarGuard();

            expect(resultado)
                .toBeTrue();

            expect(
                service.consultar
            ).toHaveBeenCalledTimes(1);

            expect(
                router.createUrlTree
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve redirecionar quando empresa for a proxima etapa',
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
                .toBe(urlTree);

            expect(
                router.createUrlTree
            ).toHaveBeenCalledOnceWith(
                [
                    '/configuracao-inicial'
                ]
            );
        }
    );

    it(
        'deve redirecionar para qualquer etapa futura',
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
                .toBe(urlTree);

            expect(
                router.createUrlTree
            ).toHaveBeenCalledOnceWith(
                [
                    '/configuracao-inicial'
                ]
            );
        }
    );

    it(
        'deve redirecionar para configuracao inicial quando a consulta falhar',
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
                .toBe(urlTree);

            expect(
                router.createUrlTree
            ).toHaveBeenCalledOnceWith(
                [
                    '/configuracao-inicial'
                ]
            );
        }
    );

    async function executarGuard():
        Promise<boolean | UrlTree> {

        const resultado =
            TestBed
                .runInInjectionContext(
                    () =>
                        ConfiguracaoInicialGuard()
                );

        return firstValueFrom(
            resultado
        );
    }
});
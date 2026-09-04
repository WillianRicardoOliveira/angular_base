import {
    inject
} from '@angular/core';

import {
    Router,
    UrlTree
} from '@angular/router';

import {
    catchError,
    map,
    Observable,
    of
} from 'rxjs';

import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

import {
    ConfiguracaoInicialService
} from '@/domain/configuracao/configuracao-inicial/services/configuracao-inicial.service';

export const ConfiguracaoInicialGuard =
    (): Observable<boolean | UrlTree> => {

        const service =
            inject(
                ConfiguracaoInicialService
            );

        const contextoOrganizacaoService =
            inject(
                ContextoOrganizacaoService
            );

        const router =
            inject(
                Router
            );

        return service
            .consultar()
            .pipe(
                map((estado) => {
                    contextoOrganizacaoService
                        .confirmarOrganizacaoPronta();

                    if (
                        estado.proximaEtapa ===
                        null
                    ) {
                        return true;
                    }

                    return router.createUrlTree([
                        '/configuracao-inicial'
                    ]);
                }),
                catchError(
                    () =>
                        of(
                            router.createUrlTree([
                                '/configuracao-inicial'
                            ])
                        )
                )
            );
    };
import {
    HttpClient
} from '@angular/common/http';

import {
    Injectable
} from '@angular/core';

import {
    BehaviorSubject,
    catchError,
    distinctUntilChanged,
    finalize,
    map,
    Observable,
    of,
    shareReplay,
    tap,
    throwError
} from 'rxjs';

import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

import {
    ContextoConfiguracaoInicial,
    EstadoConfiguracaoInicial
} from '@/domain/configuracao/configuracao-inicial/models/estado-configuracao-inicial.model';

import {
    environment
} from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConfiguracaoInicialService {

    private readonly endpoint =
        `${environment.api}/configuracao/inicial`;

    private readonly contextoSubject =
        new BehaviorSubject<
            ContextoConfiguracaoInicial
        >({
            idOrganizacao: null,
            carregando: false,
            erro: false,
            estado: null
        });

    private carregamentoEmAndamento:
        Observable<
            EstadoConfiguracaoInicial
        > | null = null;

    private idOrganizacaoCarregamento:
        number | null = null;

    private versaoCarregamento = 0;

    constructor(
        private readonly http:
            HttpClient,
        private readonly contextoOrganizacaoService:
            ContextoOrganizacaoService
    ) {
    }

    consultar(
        forcarAtualizacao = false
    ): Observable<EstadoConfiguracaoInicial> {

        const idOrganizacao =
            this.contextoOrganizacaoService
                .retornarIdOrganizacaoAtiva();

        if (idOrganizacao === null) {
            this.limparEstado();

            return throwError(
                () =>
                    new Error(
                        'Nenhuma organização ativa.'
                    )
            );
        }

        const contextoAtual =
            this.contextoSubject.value;

        const estadoPertenceAOrganizacao =
            contextoAtual.idOrganizacao ===
            idOrganizacao;

        if (
            !forcarAtualizacao &&
            estadoPertenceAOrganizacao &&
            contextoAtual.estado
        ) {
            return of(
                contextoAtual.estado
            );
        }

        if (
            !forcarAtualizacao &&
            estadoPertenceAOrganizacao &&
            contextoAtual.erro
        ) {
            return throwError(
                () =>
                    new Error(
                        'Não foi possível carregar a configuração inicial.'
                    )
            );
        }

        const carregamentoPertenceAOrganizacao =
            this.idOrganizacaoCarregamento ===
            idOrganizacao;

        if (
            !forcarAtualizacao &&
            carregamentoPertenceAOrganizacao &&
            this.carregamentoEmAndamento
        ) {
            return this
                .carregamentoEmAndamento;
        }

        const versaoConsulta =
            ++this.versaoCarregamento;

        this.idOrganizacaoCarregamento =
            idOrganizacao;

        this.contextoSubject.next({
            idOrganizacao,
            carregando: true,
            erro: false,
            estado:
                estadoPertenceAOrganizacao
                    ? contextoAtual.estado
                    : null
        });

        const carregamento =
            this.http
                .get<
                    EstadoConfiguracaoInicial
                >(
                    this.endpoint
                )
                .pipe(
                    tap((estado) => {
                        if (
                            versaoConsulta !==
                                this.versaoCarregamento ||
                            idOrganizacao !==
                                this.contextoOrganizacaoService
                                    .retornarIdOrganizacaoAtiva()
                        ) {
                            return;
                        }

                        this.contextoSubject.next({
                            idOrganizacao,
                            carregando: false,
                            erro: false,
                            estado
                        });
                    }),
                    catchError((erro) => {
                        if (
                            versaoConsulta ===
                                this.versaoCarregamento &&
                            idOrganizacao ===
                                this.contextoOrganizacaoService
                                    .retornarIdOrganizacaoAtiva()
                        ) {
                            this.contextoSubject.next({
                                idOrganizacao,
                                carregando: false,
                                erro: true,
                                estado: null
                            });
                        }

                        return throwError(
                            () => erro
                        );
                    }),
                    finalize(() => {
                        if (
                            versaoConsulta !==
                            this.versaoCarregamento
                        ) {
                            return;
                        }

                        this.carregamentoEmAndamento =
                            null;

                        this.idOrganizacaoCarregamento =
                            null;
                    }),
                    shareReplay({
                        bufferSize: 1,
                        refCount: false
                    })
                );

        this.carregamentoEmAndamento =
            carregamento;

        return carregamento;
    }

    recarregar():
        Observable<EstadoConfiguracaoInicial> {

        return this.consultar(
            true
        );
    }

    retornarContextoObservable():
        Observable<ContextoConfiguracaoInicial> {

        return this.contextoSubject
            .asObservable();
    }

    retornarContextoAtual():
        ContextoConfiguracaoInicial {

        return this.contextoSubject
            .value;
    }

    retornarEstadoObservable():
        Observable<
            EstadoConfiguracaoInicial | null
        > {

        return this.contextoSubject
            .asObservable()
            .pipe(
                map(
                    (contexto) =>
                        contexto.estado
                ),
                distinctUntilChanged()
            );
    }

    retornarEstadoAtual():
        EstadoConfiguracaoInicial | null {

        return this.contextoSubject
            .value
            .estado;
    }

    limparEstado(): void {
        this.versaoCarregamento++;

        this.carregamentoEmAndamento =
            null;

        this.idOrganizacaoCarregamento =
            null;

        this.contextoSubject.next({
            idOrganizacao: null,
            carregando: false,
            erro: false,
            estado: null
        });
    }
}
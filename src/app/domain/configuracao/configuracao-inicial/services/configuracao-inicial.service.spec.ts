import {
    provideHttpClient
} from '@angular/common/http';

import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';

import {
    TestBed
} from '@angular/core/testing';

import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

import {
    EstadoConfiguracaoInicial,
    ProximaEtapaConfiguracao
} from '@/domain/configuracao/configuracao-inicial/models/estado-configuracao-inicial.model';

import {
    environment
} from 'environments/environment';

import {
    ConfiguracaoInicialService
} from './configuracao-inicial.service';

describe('ConfiguracaoInicialService', () => {

    const endpoint =
        `${environment.api}/configuracao/inicial`;

    const estadoPendente:
        EstadoConfiguracaoInicial = {
            empresaCadastrada:
                false,
            proximaEtapa:
                ProximaEtapaConfiguracao
                    .Empresa
        };

    const estadoCompleto:
        EstadoConfiguracaoInicial = {
            empresaCadastrada:
                true,
            proximaEtapa:
                null
        };

    let service:
        ConfiguracaoInicialService;

    let httpTestingController:
        HttpTestingController;

    let contextoOrganizacaoService:
        jasmine.SpyObj<
            ContextoOrganizacaoService
        >;

    let idOrganizacaoAtiva:
        number | null;

    beforeEach(() => {
        idOrganizacaoAtiva = 1;

        contextoOrganizacaoService =
            jasmine.createSpyObj<
                ContextoOrganizacaoService
            >(
                'ContextoOrganizacaoService',
                [
                    'retornarIdOrganizacaoAtiva'
                ]
            );

        contextoOrganizacaoService
            .retornarIdOrganizacaoAtiva
            .and
            .callFake(
                () =>
                    idOrganizacaoAtiva
            );

        TestBed.configureTestingModule({
            providers: [
                ConfiguracaoInicialService,
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide:
                        ContextoOrganizacaoService,
                    useValue:
                        contextoOrganizacaoService
                }
            ]
        });

        service =
            TestBed.inject(
                ConfiguracaoInicialService
            );

        httpTestingController =
            TestBed.inject(
                HttpTestingController
            );
    });

    afterEach(() => {
        httpTestingController
            .verify();
    });

    it(
        'deve ser criado',
        () => {

            expect(service)
                .toBeTruthy();
        }
    );

    it(
        'deve consultar e publicar o estado inicial da organizacao',
        () => {

            let resultado:
                EstadoConfiguracaoInicial |
                undefined;

            service.consultar()
                .subscribe((estado) => {
                    resultado = estado;
                });

            expect(
                service
                    .retornarContextoAtual()
            ).toEqual({
                idOrganizacao: 1,
                carregando: true,
                erro: false,
                estado: null
            });

            const request =
                httpTestingController
                    .expectOne(
                        endpoint
                    );

            expect(
                request.request.method
            ).toBe('GET');

            request.flush(
                estadoPendente
            );

            expect(resultado)
                .toEqual(
                    estadoPendente
                );

            expect(
                service
                    .retornarContextoAtual()
            ).toEqual({
                idOrganizacao: 1,
                carregando: false,
                erro: false,
                estado:
                    estadoPendente
            });
        }
    );

    it(
        'deve reutilizar o estado armazenado da mesma organizacao',
        () => {

            service.consultar()
                .subscribe();

            httpTestingController
                .expectOne(
                    endpoint
                )
                .flush(
                    estadoPendente
                );

            let resultado:
                EstadoConfiguracaoInicial |
                undefined;

            service.consultar()
                .subscribe((estado) => {
                    resultado = estado;
                });

            httpTestingController
                .expectNone(
                    endpoint
                );

            expect(resultado)
                .toEqual(
                    estadoPendente
                );
        }
    );

    it(
        'deve compartilhar a consulta em andamento',
        () => {

            let primeiroResultado:
                EstadoConfiguracaoInicial |
                undefined;

            let segundoResultado:
                EstadoConfiguracaoInicial |
                undefined;

            service.consultar()
                .subscribe((estado) => {
                    primeiroResultado =
                        estado;
                });

            service.consultar()
                .subscribe((estado) => {
                    segundoResultado =
                        estado;
                });

            const requests =
                httpTestingController
                    .match(
                        endpoint
                    );

            expect(requests.length)
                .toBe(1);

            requests[0].flush(
                estadoPendente
            );

            expect(
                primeiroResultado
            ).toEqual(
                estadoPendente
            );

            expect(
                segundoResultado
            ).toEqual(
                estadoPendente
            );
        }
    );

    it(
        'deve forcar nova consulta ao recarregar',
        () => {

            service.consultar()
                .subscribe();

            httpTestingController
                .expectOne(
                    endpoint
                )
                .flush(
                    estadoPendente
                );

            let resultado:
                EstadoConfiguracaoInicial |
                undefined;

            service.recarregar()
                .subscribe((estado) => {
                    resultado = estado;
                });

            expect(
                service
                    .retornarContextoAtual()
            ).toEqual({
                idOrganizacao: 1,
                carregando: true,
                erro: false,
                estado:
                    estadoPendente
            });

            const request =
                httpTestingController
                    .expectOne(
                        endpoint
                    );

            request.flush(
                estadoCompleto
            );

            expect(resultado)
                .toEqual(
                    estadoCompleto
                );

            expect(
                service
                    .retornarEstadoAtual()
            ).toEqual(
                estadoCompleto
            );
        }
    );

    it(
        'deve manter o erro armazenado e evitar repeticao automatica',
        () => {

            let primeiroErro:
                unknown;

            service.consultar()
                .subscribe({
                    error: (erro) => {
                        primeiroErro = erro;
                    }
                });

            httpTestingController
                .expectOne(
                    endpoint
                )
                .flush(
                    'Erro',
                    {
                        status: 500,
                        statusText:
                            'Erro interno'
                    }
                );

            expect(primeiroErro)
                .toBeDefined();

            expect(
                service
                    .retornarContextoAtual()
            ).toEqual({
                idOrganizacao: 1,
                carregando: false,
                erro: true,
                estado: null
            });

            let segundoErro:
                unknown;

            service.consultar()
                .subscribe({
                    error: (erro) => {
                        segundoErro = erro;
                    }
                });

            httpTestingController
                .expectNone(
                    endpoint
                );

            expect(segundoErro)
                .toBeDefined();
        }
    );

    it(
        'deve permitir nova tentativa explicita depois de um erro',
        () => {

            service.consultar()
                .subscribe({
                    error: () => {
                    }
                });

            httpTestingController
                .expectOne(
                    endpoint
                )
                .flush(
                    'Erro',
                    {
                        status: 500,
                        statusText:
                            'Erro interno'
                    }
                );

            service.recarregar()
                .subscribe();

            const request =
                httpTestingController
                    .expectOne(
                        endpoint
                    );

            request.flush(
                estadoCompleto
            );

            expect(
                service
                    .retornarContextoAtual()
            ).toEqual({
                idOrganizacao: 1,
                carregando: false,
                erro: false,
                estado:
                    estadoCompleto
            });
        }
    );

    it(
        'deve consultar novamente ao trocar de organizacao',
        () => {

            service.consultar()
                .subscribe();

            httpTestingController
                .expectOne(
                    endpoint
                )
                .flush(
                    estadoPendente
                );

            idOrganizacaoAtiva = 2;

            service.consultar()
                .subscribe();

            expect(
                service
                    .retornarContextoAtual()
            ).toEqual({
                idOrganizacao: 2,
                carregando: true,
                erro: false,
                estado: null
            });

            httpTestingController
                .expectOne(
                    endpoint
                )
                .flush(
                    estadoCompleto
                );

            expect(
                service
                    .retornarContextoAtual()
            ).toEqual({
                idOrganizacao: 2,
                carregando: false,
                erro: false,
                estado:
                    estadoCompleto
            });
        }
    );

    it(
        'deve ignorar resposta antiga depois da troca de organizacao',
        () => {

            service.consultar()
                .subscribe();

            idOrganizacaoAtiva = 2;

            service.consultar()
                .subscribe();

            const requests =
                httpTestingController
                    .match(
                        endpoint
                    );

            expect(requests.length)
                .toBe(2);

            requests[1].flush(
                estadoCompleto
            );

            requests[0].flush(
                estadoPendente
            );

            expect(
                service
                    .retornarContextoAtual()
            ).toEqual({
                idOrganizacao: 2,
                carregando: false,
                erro: false,
                estado:
                    estadoCompleto
            });
        }
    );

    it(
        'deve ignorar erro antigo depois da troca de organizacao',
        () => {

            service.consultar()
                .subscribe({
                    error: () => {
                    }
                });

            idOrganizacaoAtiva = 2;

            service.consultar()
                .subscribe();

            const requests =
                httpTestingController
                    .match(
                        endpoint
                    );

            expect(requests.length)
                .toBe(2);

            requests[1].flush(
                estadoCompleto
            );

            requests[0].flush(
                'Erro antigo',
                {
                    status: 500,
                    statusText:
                        'Erro interno'
                }
            );

            expect(
                service
                    .retornarContextoAtual()
            ).toEqual({
                idOrganizacao: 2,
                carregando: false,
                erro: false,
                estado:
                    estadoCompleto
            });
        }
    );

    it(
        'deve limpar o estado armazenado',
        () => {

            service.consultar()
                .subscribe();

            httpTestingController
                .expectOne(
                    endpoint
                )
                .flush(
                    estadoPendente
                );

            service.limparEstado();

            expect(
                service
                    .retornarContextoAtual()
            ).toEqual({
                idOrganizacao: null,
                carregando: false,
                erro: false,
                estado: null
            });
        }
    );

    it(
        'deve ignorar resposta antiga depois de limpar o estado',
        () => {

            service.consultar()
                .subscribe();

            const request =
                httpTestingController
                    .expectOne(
                        endpoint
                    );

            service.limparEstado();

            request.flush(
                estadoPendente
            );

            expect(
                service
                    .retornarEstadoAtual()
            ).toBeNull();
        }
    );

    it(
        'deve falhar sem realizar requisicao quando nao houver organizacao ativa',
        () => {

            idOrganizacaoAtiva = null;

            let erroRecebido:
                Error | undefined;

            service.consultar()
                .subscribe({
                    error: (erro) => {
                        erroRecebido =
                            erro;
                    }
                });

            httpTestingController
                .expectNone(
                    endpoint
                );

            expect(
                erroRecebido?.message
            ).toBe(
                'Nenhuma organização ativa.'
            );

            expect(
                service
                    .retornarContextoAtual()
            ).toEqual({
                idOrganizacao: null,
                carregando: false,
                erro: false,
                estado: null
            });
        }
    );
});
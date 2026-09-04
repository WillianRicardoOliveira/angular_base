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
    take
} from 'rxjs';

import {
    OrganizacaoDisponivel
} from '@/core/organizacao/models/organizacao-disponivel.model';

import {
    environment
} from 'environments/environment';

import {
    ContextoOrganizacaoService
} from './contexto-organizacao.service';

describe('ContextoOrganizacaoService', () => {

    const storageKey =
        'erp.organizacao.ativa.id';

    const endpoint =
        `${environment.api}/organizacao/disponiveis`;

    let service:
        ContextoOrganizacaoService;

    let httpTestingController:
        HttpTestingController;

    beforeEach(() => {
        localStorage.removeItem(
            storageKey
        );

        TestBed.configureTestingModule({
            providers: [
                ContextoOrganizacaoService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service =
            TestBed.inject(
                ContextoOrganizacaoService
            );

        httpTestingController =
            TestBed.inject(
                HttpTestingController
            );
    });

    afterEach(() => {
        httpTestingController
            .verify();

        localStorage.removeItem(
            storageKey
        );
    });

    it(
        'deve ser criado',
        () => {

            expect(service)
                .toBeTruthy();
        }
    );

    it(
        'deve iniciar sem organizacao ativa e sem troca em andamento',
        () => {

            expect(
                service
                    .retornarOrganizacaoAtiva()
            ).toBeNull();

            expect(
                service
                    .retornarIdOrganizacaoAtiva()
            ).toBeNull();

            expect(
                service
                    .possuiOrganizacaoAtiva()
            ).toBeFalse();

            expect(
                service
                    .foiCarregado()
            ).toBeFalse();

            expect(
                service
                    .estaTrocandoOrganizacao()
            ).toBeFalse();
        }
    );

    it(
        'deve carregar organizacoes e selecionar a primeira como padrao',
        () => {

            const organizacoes =
                criarOrganizacoes();

            let resultado:
                OrganizacaoDisponivel |
                null |
                undefined;

            service
                .carregarESelecionarPadrao()
                .subscribe(
                    (organizacao) => {
                        resultado =
                            organizacao;
                    }
                );

            const request =
                httpTestingController
                    .expectOne(
                        endpoint
                    );

            expect(
                request.request.method
            ).toBe('GET');

            request.flush(
                organizacoes
            );

            expect(resultado)
                .toEqual(
                    organizacoes[0]
                );

            expect(
                localStorage.getItem(
                    storageKey
                )
            ).toBe('1');

            expect(
                service
                    .retornarOrganizacaoAtiva()
            ).toEqual(
                organizacoes[0]
            );

            expect(
                service
                    .retornarIdOrganizacaoAtiva()
            ).toBe(1);

            expect(
                service
                    .possuiOrganizacaoAtiva()
            ).toBeTrue();

            expect(
                service
                    .foiCarregado()
            ).toBeTrue();
        }
    );

    it(
        'deve publicar organizacoes e organizacao ativa',
        () => {

            const organizacoes =
                criarOrganizacoes();

            let listaPublicada:
                OrganizacaoDisponivel[] = [];

            let organizacaoPublicada:
                OrganizacaoDisponivel |
                null = null;

            service
                .retornarOrganizacoesDisponiveis()
                .subscribe((lista) => {
                    listaPublicada =
                        lista;
                });

            service
                .retornarOrganizacaoAtivaObservable()
                .subscribe(
                    (organizacao) => {
                        organizacaoPublicada =
                            organizacao;
                    }
                );

            service
                .carregarESelecionarPadrao()
                .subscribe();

            httpTestingController
                .expectOne(
                    endpoint
                )
                .flush(
                    organizacoes
                );

            expect(listaPublicada)
                .toEqual(
                    organizacoes
                );

            expect(organizacaoPublicada)
                .toEqual(
                    organizacoes[0]
                );
        }
    );

    it(
        'deve manter organizacao salva quando ainda estiver disponivel',
        () => {

            localStorage.setItem(
                storageKey,
                '2'
            );

            const organizacoes =
                criarOrganizacoes();

            let resultado:
                OrganizacaoDisponivel |
                null |
                undefined;

            service
                .carregarESelecionarPadrao()
                .subscribe(
                    (organizacao) => {
                        resultado =
                            organizacao;
                    }
                );

            httpTestingController
                .expectOne(
                    endpoint
                )
                .flush(
                    organizacoes
                );

            expect(resultado)
                .toEqual(
                    organizacoes[1]
                );

            expect(
                localStorage.getItem(
                    storageKey
                )
            ).toBe('2');
        }
    );

    it(
        'deve selecionar a primeira quando a organizacao salva nao estiver disponivel',
        () => {

            localStorage.setItem(
                storageKey,
                '99'
            );

            const organizacoes =
                criarOrganizacoes();

            service
                .carregarESelecionarPadrao()
                .subscribe();

            httpTestingController
                .expectOne(
                    endpoint
                )
                .flush(
                    organizacoes
                );

            expect(
                service
                    .retornarOrganizacaoAtiva()
            ).toEqual(
                organizacoes[0]
            );

            expect(
                localStorage.getItem(
                    storageKey
                )
            ).toBe('1');
        }
    );

    it(
        'deve ignorar identificador salvo invalido',
        () => {

            localStorage.setItem(
                storageKey,
                'valor-invalido'
            );

            const organizacoes =
                criarOrganizacoes();

            service
                .carregarESelecionarPadrao()
                .subscribe();

            httpTestingController
                .expectOne(
                    endpoint
                )
                .flush(
                    organizacoes
                );

            expect(
                service
                    .retornarOrganizacaoAtiva()
            ).toEqual(
                organizacoes[0]
            );

            expect(
                localStorage.getItem(
                    storageKey
                )
            ).toBe('1');
        }
    );

    it(
        'deve retornar null e limpar o storage quando nao houver organizacoes',
        () => {

            localStorage.setItem(
                storageKey,
                '1'
            );

            let resultado:
                OrganizacaoDisponivel |
                null |
                undefined;

            service
                .carregarESelecionarPadrao()
                .subscribe(
                    (organizacao) => {
                        resultado =
                            organizacao;
                    }
                );

            httpTestingController
                .expectOne(
                    endpoint
                )
                .flush([]);

            expect(resultado)
                .toBeNull();

            expect(
                localStorage.getItem(
                    storageKey
                )
            ).toBeNull();

            expect(
                service
                    .possuiOrganizacaoAtiva()
            ).toBeFalse();

            expect(
                service
                    .foiCarregado()
            ).toBeTrue();
        }
    );

    it(
        'deve listar organizacoes sem alterar o contexto',
        () => {

            const organizacoes =
                criarOrganizacoes();

            let resultado:
                OrganizacaoDisponivel[] = [];

            service
                .listarDisponiveis()
                .subscribe((lista) => {
                    resultado = lista;
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
                organizacoes
            );

            expect(resultado)
                .toEqual(
                    organizacoes
                );

            expect(
                service
                    .retornarOrganizacaoAtiva()
            ).toBeNull();

            expect(
                service
                    .foiCarregado()
            ).toBeFalse();
        }
    );

    it(
        'deve trocar a organizacao ativa',
        () => {

            const organizacoes =
                carregarOrganizacoes();

            const selecionada =
                service
                    .definirOrganizacaoAtiva(
                        2
                    );

            expect(selecionada)
                .toEqual(
                    organizacoes[1]
                );

            expect(
                service
                    .retornarIdOrganizacaoAtiva()
            ).toBe(2);

            expect(
                localStorage.getItem(
                    storageKey
                )
            ).toBe('2');
        }
    );

    it(
        'deve publicar a troca da organizacao ativa',
        () => {

            carregarOrganizacoes();

            let organizacaoPublicada:
                OrganizacaoDisponivel |
                null = null;

            service
                .retornarOrganizacaoAtivaObservable()
                .subscribe(
                    (organizacao) => {
                        organizacaoPublicada =
                            organizacao;
                    }
                );

            service
                .definirOrganizacaoAtiva(
                    2
                );

            expect(organizacaoPublicada)
                .toEqual(
                    criarOrganizacoes()[1]
                );
        }
    );

    it(
        'deve rejeitar troca para organizacao indisponivel',
        () => {

            carregarOrganizacoes();

            expect(
                () =>
                    service
                        .definirOrganizacaoAtiva(
                            99
                        )
            ).toThrowError(
                'Organizacao nao disponivel.'
            );

            expect(
                service
                    .retornarIdOrganizacaoAtiva()
            ).toBe(1);

            expect(
                localStorage.getItem(
                    storageKey
                )
            ).toBe('1');
        }
    );

    it(
        'deve publicar o inicio e o fim da troca de organizacao',
        () => {

            const valores:
                boolean[] = [];

            service
                .retornarTrocaOrganizacaoObservable()
                .subscribe((trocando) => {
                    valores.push(
                        trocando
                    );
                });

            service
                .iniciarTrocaOrganizacao();

            expect(
                service
                    .estaTrocandoOrganizacao()
            ).toBeTrue();

            service
                .finalizarTrocaOrganizacao();

            expect(
                service
                    .estaTrocandoOrganizacao()
            ).toBeFalse();

            expect(valores)
                .toEqual([
                    false,
                    true,
                    false
                ]);
        }
    );

    it(
        'nao deve publicar estados de troca repetidos',
        () => {

            const valores:
                boolean[] = [];

            service
                .retornarTrocaOrganizacaoObservable()
                .subscribe((trocando) => {
                    valores.push(
                        trocando
                    );
                });

            service
                .iniciarTrocaOrganizacao();

            service
                .iniciarTrocaOrganizacao();

            service
                .finalizarTrocaOrganizacao();

            service
                .finalizarTrocaOrganizacao();

            expect(valores)
                .toEqual([
                    false,
                    true,
                    false
                ]);
        }
    );

    it(
        'deve limpar completamente o contexto local',
        () => {

            carregarOrganizacoes();

            service
                .iniciarTrocaOrganizacao();

            service.limpar();

            expect(
                localStorage.getItem(
                    storageKey
                )
            ).toBeNull();

            expect(
                service
                    .retornarOrganizacaoAtiva()
            ).toBeNull();

            expect(
                service
                    .retornarIdOrganizacaoAtiva()
            ).toBeNull();

            expect(
                service
                    .possuiOrganizacaoAtiva()
            ).toBeFalse();

            expect(
                service
                    .foiCarregado()
            ).toBeFalse();

            expect(
                service
                    .estaTrocandoOrganizacao()
            ).toBeFalse();

            service
                .retornarOrganizacoesDisponiveis()
                .pipe(
                    take(1)
                )
                .subscribe((lista) => {
                    expect(lista)
                        .toEqual([]);
                });
        }
    );

    function carregarOrganizacoes():
        OrganizacaoDisponivel[] {

        const organizacoes =
            criarOrganizacoes();

        service
            .carregarESelecionarPadrao()
            .subscribe();

        httpTestingController
            .expectOne(
                endpoint
            )
            .flush(
                organizacoes
            );

        return organizacoes;
    }

    function criarOrganizacoes():
        OrganizacaoDisponivel[] {

        return [
            {
                id: 1,
                nome:
                    'Organização A'
            },
            {
                id: 2,
                nome:
                    'Organização B'
            }
        ];
    }
});
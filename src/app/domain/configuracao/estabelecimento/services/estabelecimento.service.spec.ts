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
    environment
} from 'environments/environment';

import {
    EstabelecimentoService
} from './estabelecimento.service';

describe('EstabelecimentoService', () => {
    let service:
        EstabelecimentoService;

    let httpTestingController:
        HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EstabelecimentoService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(
            EstabelecimentoService
        );

        httpTestingController =
            TestBed.inject(
                HttpTestingController
            );
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    it(
        'deve listar estabelecimentos com todos os filtros',
        () => {
            const resposta = {
                content: [
                    {
                        id: 2,
                        idEmpresa: 1,
                        empresa:
                            'Empresa Exemplo',
                        nome:
                            'Filial Curitiba',
                        tipo:
                            'FILIAL' as const,
                        pais:
                            'BR',
                        tipoDocumentoFiscal:
                            'CNPJ',
                        documentoFiscal:
                            '12345678000199',
                        inscricaoEstadual:
                            null,
                        inscricaoMunicipal:
                            null,
                        status:
                            'ATIVO' as const
                    }
                ],
                totalElements: 1
            };

            service.listar(
                0,
                20,
                'nome,asc',
                ' Curitiba ',
                1
            ).subscribe((resultado) => {
                expect(resultado)
                    .toEqual(resposta);
            });

            const request =
                httpTestingController
                    .expectOne(
                        (requisicao) =>
                            requisicao.url ===
                            `${environment.api}/configuracao/estabelecimento`
                    );

            expect(request.request.method)
                .toBe('GET');

            expect(
                request.request.params
                    .get('page')
            ).toBe('0');

            expect(
                request.request.params
                    .get('size')
            ).toBe('20');

            expect(
                request.request.params
                    .get('sort')
            ).toBe('nome,asc');

            expect(
                request.request.params
                    .get('filtro')
            ).toBe('Curitiba');

            expect(
                request.request.params
                    .get('idEmpresa')
            ).toBe('1');

            request.flush(resposta);
        }
    );

    it(
        'deve listar estabelecimentos sem parametros opcionais',
        () => {
            service.listar()
                .subscribe((resultado) => {
                    expect(resultado)
                        .toEqual({
                            content: [],
                            totalElements: 0
                        });
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/configuracao/estabelecimento`
                    );

            expect(request.request.method)
                .toBe('GET');

            expect(
                request.request.params.keys()
            ).toEqual([]);

            request.flush({
                content: [],
                totalElements: 0
            });
        }
    );

    it(
        'deve pesquisar empresas para selecao',
        () => {
            const resposta = {
                content: [
                    {
                        id: 1,
                        nome:
                            'Empresa Exemplo',
                        status:
                            'ATIVO' as const
                    }
                ],
                totalElements: 1
            };

            service.listarEmpresas(
                ' Exemplo ',
                0,
                10
            ).subscribe((resultado) => {
                expect(resultado)
                    .toEqual(resposta);
            });

            const request =
                httpTestingController
                    .expectOne(
                        (requisicao) =>
                            requisicao.url ===
                            `${environment.api}/configuracao/empresa`
                    );

            expect(request.request.method)
                .toBe('GET');

            expect(
                request.request.params
                    .get('page')
            ).toBe('0');

            expect(
                request.request.params
                    .get('size')
            ).toBe('10');

            expect(
                request.request.params
                    .get('sort')
            ).toBe('nome,asc');

            expect(
                request.request.params
                    .get('filtro')
            ).toBe('Exemplo');

            request.flush(resposta);
        }
    );

    it(
        'deve usar paginacao padrao ao listar empresas',
        () => {
            service.listarEmpresas()
                .subscribe();

            const request =
                httpTestingController
                    .expectOne(
                        (requisicao) =>
                            requisicao.url ===
                            `${environment.api}/configuracao/empresa`
                    );

            expect(
                request.request.params
                    .get('page')
            ).toBe('0');

            expect(
                request.request.params
                    .get('size')
            ).toBe('10');

            expect(
                request.request.params
                    .get('sort')
            ).toBe('nome,asc');

            expect(
                request.request.params
                    .has('filtro')
            ).toBeFalse();

            request.flush({
                content: [],
                totalElements: 0
            });
        }
    );

    it(
        'deve cadastrar estabelecimento',
        () => {
            const dados = {
                idEmpresa: 1,
                nome: 'Filial Curitiba',
                tipo: 'FILIAL' as const,
                pais: 'BR',
                tipoDocumentoFiscal:
                    'CNPJ',
                documentoFiscal:
                    '12345678000199',
                inscricaoEstadual:
                    null,
                inscricaoMunicipal:
                    null
            };

            const resposta = {
                id: 2,
                idEmpresa: 1,
                empresa:
                    'Empresa Exemplo',
                nome:
                    'Filial Curitiba',
                tipo:
                    'FILIAL' as const,
                pais:
                    'BR',
                tipoDocumentoFiscal:
                    'CNPJ',
                documentoFiscal:
                    '12345678000199',
                inscricaoEstadual:
                    null,
                inscricaoMunicipal:
                    null,
                status:
                    'ATIVO' as const
            };

            service.cadastrar(dados)
                .subscribe((resultado) => {
                    expect(resultado)
                        .toEqual(resposta);
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/configuracao/estabelecimento`
                    );

            expect(request.request.method)
                .toBe('POST');

            expect(request.request.body)
                .toEqual(dados);

            request.flush(resposta);
        }
    );

    it(
        'deve atualizar estabelecimento',
        () => {
            const dados = {
                id: 2,
                nome: 'Filial Atualizada',
                tipo: 'FILIAL' as const,
                pais: 'BR',
                tipoDocumentoFiscal:
                    null,
                documentoFiscal:
                    null,
                inscricaoEstadual:
                    null,
                inscricaoMunicipal:
                    null
            };

            const resposta = {
                id: 2,
                idEmpresa: 1,
                empresa:
                    'Empresa Exemplo',
                nome:
                    'Filial Atualizada',
                tipo:
                    'FILIAL' as const,
                pais:
                    'BR',
                tipoDocumentoFiscal:
                    null,
                documentoFiscal:
                    null,
                inscricaoEstadual:
                    null,
                inscricaoMunicipal:
                    null,
                status:
                    'ATIVO' as const
            };

            service.atualizar(dados)
                .subscribe((resultado) => {
                    expect(resultado)
                        .toEqual(resposta);
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/configuracao/estabelecimento`
                    );

            expect(request.request.method)
                .toBe('PUT');

            expect(request.request.body)
                .toEqual(dados);

            expect(
                request.request.body.idEmpresa
            ).toBeUndefined();

            request.flush(resposta);
        }
    );

    it(
        'deve detalhar estabelecimento',
        () => {
            const resposta = {
                id: 2,
                idEmpresa: 1,
                empresa:
                    'Empresa Exemplo',
                nome:
                    'Filial Curitiba',
                tipo:
                    'FILIAL' as const,
                pais:
                    'BR',
                tipoDocumentoFiscal:
                    'CNPJ',
                documentoFiscal:
                    '12345678000199',
                inscricaoEstadual:
                    null,
                inscricaoMunicipal:
                    null,
                status:
                    'ATIVO' as const
            };

            service.detalhar(2)
                .subscribe((resultado) => {
                    expect(resultado)
                        .toEqual(resposta);
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/configuracao/estabelecimento/2`
                    );

            expect(request.request.method)
                .toBe('GET');

            request.flush(resposta);
        }
    );

    it(
        'deve excluir estabelecimento',
        () => {
            service.excluir(2)
                .subscribe((resultado) => {
                    expect(resultado)
                        .toBeNull();
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/configuracao/estabelecimento/2`
                    );

            expect(request.request.method)
                .toBe('DELETE');

            request.flush(null);
        }
    );
});
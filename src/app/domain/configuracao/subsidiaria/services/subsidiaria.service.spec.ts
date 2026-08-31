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
    SubsidiariaService
} from './subsidiaria.service';

describe('SubsidiariaService', () => {
    let service:
        SubsidiariaService;

    let httpTestingController:
        HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SubsidiariaService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(
            SubsidiariaService
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
        'deve listar subsidiárias com todos os filtros',
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
                            `${environment.api}/configuracao/subsidiaria`
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
        'deve listar subsidiárias sem parâmetros opcionais',
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
                        `${environment.api}/configuracao/subsidiaria`
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
        'deve pesquisar empresas para seleção',
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
        'deve usar paginação padrão ao listar empresas',
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
        'deve cadastrar subsidiária',
        () => {
            const dados = {
                idEmpresa: 1,
                nome: 'Filial Curitiba'
            };

            const resposta = {
                id: 2,
                idEmpresa: 1,
                empresa:
                    'Empresa Exemplo',
                nome:
                    'Filial Curitiba',
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
                        `${environment.api}/configuracao/subsidiaria`
                    );

            expect(request.request.method)
                .toBe('POST');

            expect(request.request.body)
                .toEqual(dados);

            request.flush(resposta);
        }
    );

    it(
        'deve atualizar somente o nome da subsidiária',
        () => {
            const dados = {
                id: 2,
                nome: 'Filial Atualizada'
            };

            const resposta = {
                id: 2,
                idEmpresa: 1,
                empresa:
                    'Empresa Exemplo',
                nome:
                    'Filial Atualizada',
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
                        `${environment.api}/configuracao/subsidiaria`
                    );

            expect(request.request.method)
                .toBe('PUT');

            expect(request.request.body)
                .toEqual({
                    id: 2,
                    nome: 'Filial Atualizada'
                });

            expect(
                request.request.body.idEmpresa
            ).toBeUndefined();

            request.flush(resposta);
        }
    );

    it(
        'deve detalhar subsidiária',
        () => {
            const resposta = {
                id: 2,
                idEmpresa: 1,
                empresa:
                    'Empresa Exemplo',
                nome:
                    'Filial Curitiba',
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
                        `${environment.api}/configuracao/subsidiaria/2`
                    );

            expect(request.request.method)
                .toBe('GET');

            request.flush(resposta);
        }
    );

    it(
        'deve excluir subsidiária',
        () => {
            service.excluir(2)
                .subscribe((resultado) => {
                    expect(resultado)
                        .toBeNull();
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/configuracao/subsidiaria/2`
                    );

            expect(request.request.method)
                .toBe('DELETE');

            request.flush(null);
        }
    );
});
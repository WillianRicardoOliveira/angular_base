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
    UsuarioEmpresaService
} from './usuario-empresa.service';

describe('UsuarioEmpresaService', () => {
    let service:
        UsuarioEmpresaService;

    let httpTestingController:
        HttpTestingController;

    const url =
        `${environment.api}/acesso/usuario-empresa`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UsuarioEmpresaService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(
            UsuarioEmpresaService
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
        'deve listar vinculos com todos os parametros',
        () => {
            const resposta = {
                content: [
                    {
                        id: 10,
                        idUsuario: 2,
                        usuario:
                            'usuario@empresa.com',
                        idEmpresa: 3,
                        empresa:
                            'Empresa Exemplo',
                        todosEstabelecimentos:
                            true,
                        status:
                            'ATIVO' as const
                    }
                ],
                totalElements: 1
            };

            service.listar(
                1,
                20,
                'id,asc',
                2,
                3
            ).subscribe((resultado) => {
                expect(resultado)
                    .toEqual(resposta);
            });

            const request =
                httpTestingController
                    .expectOne(
                        (requisicao) =>
                            requisicao.url ===
                            url
                    );

            expect(request.request.method)
                .toBe('GET');

            expect(
                request.request.params
                    .get('page')
            ).toBe('1');

            expect(
                request.request.params
                    .get('size')
            ).toBe('20');

            expect(
                request.request.params
                    .get('sort')
            ).toBe('id,asc');

            expect(
                request.request.params
                    .get('idUsuario')
            ).toBe('2');

            expect(
                request.request.params
                    .get('idEmpresa')
            ).toBe('3');

            request.flush(resposta);
        }
    );

    it(
        'deve listar vinculos sem parametros opcionais',
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
                    .expectOne(url);

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
        'deve ignorar ordenacao vazia',
        () => {
            service.listar(
                0,
                10,
                '   '
            ).subscribe();

            const request =
                httpTestingController
                    .expectOne(
                        (requisicao) =>
                            requisicao.url ===
                            url
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
                    .has('sort')
            ).toBeFalse();

            request.flush({
                content: [],
                totalElements: 0
            });
        }
    );

    it(
        'deve listar empresas para selecao',
        () => {
            const resposta = {
                content: [
                    {
                        id: 3,
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
                1,
                20
            ).subscribe((resultado) => {
                expect(resultado)
                    .toEqual(resposta);
            });

            const request =
                httpTestingController
                    .expectOne(
                        (requisicao) =>
                            requisicao.url ===
                            `${url}/empresas`
                    );

            expect(request.request.method)
                .toBe('GET');

            expect(
                request.request.params
                    .get('page')
            ).toBe('1');

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
            ).toBe('Exemplo');

            request.flush(resposta);
        }
    );

    it(
        'deve listar empresas com parametros padrao',
        () => {
            service.listarEmpresas()
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
                        (requisicao) =>
                            requisicao.url ===
                            `${url}/empresas`
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
                    .has('filtro')
            ).toBeFalse();

            request.flush({
                content: [],
                totalElements: 0
            });
        }
    );

    it(
        'deve ignorar filtro de empresa vazio',
        () => {
            service.listarEmpresas(
                '   '
            ).subscribe();

            const request =
                httpTestingController
                    .expectOne(
                        (requisicao) =>
                            requisicao.url ===
                            `${url}/empresas`
                    );

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
        'deve cadastrar vinculo entre usuario e empresa',
        () => {
            const dados = {
                idUsuario: 2,
                idEmpresa: 3,
                todosEstabelecimentos: true
            };

            const resposta = {
                id: 10,
                idUsuario: 2,
                usuario:
                    'usuario@empresa.com',
                idEmpresa: 3,
                empresa:
                    'Empresa Exemplo',
                todosEstabelecimentos: true,
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
                    .expectOne(url);

            expect(request.request.method)
                .toBe('POST');

            expect(request.request.body)
                .toEqual(dados);

            request.flush(resposta);
        }
    );

    it(
        'deve atualizar somente o acesso a todos os estabelecimentos',
        () => {
            const dados = {
                id: 10,
                todosEstabelecimentos: false
            };

            const resposta = {
                id: 10,
                idUsuario: 2,
                usuario:
                    'usuario@empresa.com',
                idEmpresa: 3,
                empresa:
                    'Empresa Exemplo',
                todosEstabelecimentos: false,
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
                    .expectOne(url);

            expect(request.request.method)
                .toBe('PUT');

            expect(request.request.body)
                .toEqual({
                    id: 10,
                    todosEstabelecimentos: false
                });

            expect(
                request.request.body.idUsuario
            ).toBeUndefined();

            expect(
                request.request.body.idEmpresa
            ).toBeUndefined();

            request.flush(resposta);
        }
    );

    it(
        'deve detalhar vinculo por id',
        () => {
            const resposta = {
                id: 10,
                idUsuario: 2,
                usuario:
                    'usuario@empresa.com',
                idEmpresa: 3,
                empresa:
                    'Empresa Exemplo',
                todosEstabelecimentos: true,
                status:
                    'ATIVO' as const
            };

            service.detalhar(10)
                .subscribe((resultado) => {
                    expect(resultado)
                        .toEqual(resposta);
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${url}/10`
                    );

            expect(request.request.method)
                .toBe('GET');

            request.flush(resposta);
        }
    );

    it(
        'deve excluir vinculo por id',
        () => {
            service.excluir(10)
                .subscribe((resultado) => {
                    expect(resultado)
                        .toBeNull();
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${url}/10`
                    );

            expect(request.request.method)
                .toBe('DELETE');

            expect(request.request.body)
                .toBeNull();

            request.flush(null);
        }
    );
});
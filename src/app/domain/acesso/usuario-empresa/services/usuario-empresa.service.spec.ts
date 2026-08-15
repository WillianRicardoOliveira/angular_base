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
        'deve listar vínculos com todos os parâmetros',
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
                        todasSubsidiarias:
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
        'deve listar vínculos sem parâmetros opcionais',
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
        'deve ignorar ordenação vazia',
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
        'deve cadastrar vínculo entre usuário e empresa',
        () => {
            const dados = {
                idUsuario: 2,
                idEmpresa: 3,
                todasSubsidiarias: true
            };

            const resposta = {
                id: 10,
                idUsuario: 2,
                usuario:
                    'usuario@empresa.com',
                idEmpresa: 3,
                empresa:
                    'Empresa Exemplo',
                todasSubsidiarias: true,
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
        'deve atualizar somente o acesso a todas as subsidiárias',
        () => {
            const dados = {
                id: 10,
                todasSubsidiarias: false
            };

            const resposta = {
                id: 10,
                idUsuario: 2,
                usuario:
                    'usuario@empresa.com',
                idEmpresa: 3,
                empresa:
                    'Empresa Exemplo',
                todasSubsidiarias: false,
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
                    todasSubsidiarias: false
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
        'deve detalhar vínculo por id',
        () => {
            const resposta = {
                id: 10,
                idUsuario: 2,
                usuario:
                    'usuario@empresa.com',
                idEmpresa: 3,
                empresa:
                    'Empresa Exemplo',
                todasSubsidiarias: true,
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
        'deve excluir vínculo por id',
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
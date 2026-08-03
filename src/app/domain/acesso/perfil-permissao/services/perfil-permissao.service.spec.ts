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
    PerfilPermissaoService
} from './perfil-permissao.service';

describe('PerfilPermissaoService', () => {
    let service:
        PerfilPermissaoService;

    let httpTestingController:
        HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PerfilPermissaoService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service =
            TestBed.inject(
                PerfilPermissaoService
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
        'deve listar as permissões do perfil com paginação',
        () => {
            const resposta = {
                content: [
                    {
                        id: 5,
                        idPermissao: 10,
                        permissao:
                            'Listar usuários',
                        chave:
                            'ACESSO_USUARIO_LISTAR',
                        status:
                            'ATIVO' as const
                    }
                ],
                totalElements: 1
            };

            service
                .listarPorPerfil(
                    3,
                    0,
                    20
                )
                .subscribe((pagina) => {
                    expect(
                        pagina
                    ).toEqual(resposta);
                });

            const request =
                httpTestingController
                    .expectOne(
                        (requisicao) =>
                            requisicao.url ===
                            `${environment.api}/perfil-permissao/perfil/3`
                    );

            expect(
                request.request.method
            ).toBe('GET');

            expect(
                request.request.params
                    .get('page')
            ).toBe('0');

            expect(
                request.request.params
                    .get('size')
            ).toBe('20');

            request.flush(resposta);
        }
    );

    it(
        'deve cadastrar um vínculo entre perfil e permissão',
        () => {
            const dados = {
                idPerfil: 3,
                idPermissao: 10
            };

            const resposta = {
                id: 5,
                idPerfil: 3,
                perfil: 'Administrador',
                idPermissao: 10,
                permissao:
                    'Listar usuários',
                chave:
                    'ACESSO_USUARIO_LISTAR',
                status:
                    'ATIVO' as const
            };

            service
                .cadastrar(dados)
                .subscribe((resultado) => {
                    expect(
                        resultado
                    ).toEqual(resposta);
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/perfil-permissao`
                    );

            expect(
                request.request.method
            ).toBe('POST');

            expect(
                request.request.body
            ).toEqual(dados);

            request.flush(resposta);
        }
    );

    it(
        'deve excluir um vínculo pelo identificador',
        () => {
            service
                .excluir(5)
                .subscribe((resultado) => {
                    expect(
                        resultado
                    ).toBeNull();
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/perfil-permissao/5`
                    );

            expect(
                request.request.method
            ).toBe('DELETE');

            request.flush(null);
        }
    );

    it(
        'deve detalhar um vínculo pelo identificador',
        () => {
            const resposta = {
                id: 5,
                idPerfil: 3,
                perfil: 'Administrador',
                idPermissao: 10,
                permissao:
                    'Listar usuários',
                chave:
                    'ACESSO_USUARIO_LISTAR',
                status:
                    'ATIVO' as const
            };

            service
                .detalhar(5)
                .subscribe((resultado) => {
                    expect(
                        resultado
                    ).toEqual(resposta);
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/perfil-permissao/5`
                    );

            expect(
                request.request.method
            ).toBe('GET');

            request.flush(resposta);
        }
    );
});
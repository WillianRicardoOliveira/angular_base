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
    UsuarioPerfilService
} from './usuario-perfil.service';

describe('UsuarioPerfilService', () => {
    let service:
        UsuarioPerfilService;

    let httpTestingController:
        HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UsuarioPerfilService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service =
            TestBed.inject(
                UsuarioPerfilService
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
        'deve listar os perfis do usuário',
        () => {
            const resposta = [
                {
                    id: 5,
                    idPerfil: 3,
                    perfil:
                        'Administrador',
                    status:
                        'ATIVO' as const
                }
            ];

            service
                .listarPorUsuario(2)
                .subscribe((resultado) => {
                    expect(
                        resultado
                    ).toEqual(resposta);
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/usuario-perfil/usuario/2`
                    );

            expect(
                request.request.method
            ).toBe('GET');

            request.flush(resposta);
        }
    );

    it(
        'deve cadastrar um vínculo entre usuário e perfil',
        () => {
            const dados = {
                idUsuario: 2,
                idPerfil: 3
            };

            const resposta = {
                id: 5,
                idUsuario: 2,
                usuario:
                    'usuario@empresa.com',
                idPerfil: 3,
                perfil:
                    'Administrador',
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
                        `${environment.api}/usuario-perfil`
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
                        `${environment.api}/usuario-perfil/5`
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
                idUsuario: 2,
                usuario:
                    'usuario@empresa.com',
                idPerfil: 3,
                perfil:
                    'Administrador',
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
                        `${environment.api}/usuario-perfil/5`
                    );

            expect(
                request.request.method
            ).toBe('GET');

            request.flush(resposta);
        }
    );
});
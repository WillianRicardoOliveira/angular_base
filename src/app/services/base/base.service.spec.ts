import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';

import { environment } from 'environments/environment';

import { BaseService } from './base.service';

describe('BaseService', () => {
    let service: BaseService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BaseService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(BaseService);

        httpTestingController = TestBed.inject(
            HttpTestingController
        );
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    describe('cadastrar', () => {
        it('deve enviar POST com os dados informados', () => {
            const dados = {
                nome: 'Perfil administrativo',
                ativo: true
            };

            const resposta = {
                id: 1,
                ...dados
            };

            service
                .cadastrar('perfil', dados)
                .subscribe((resultado) => {
                    expect(resultado).toEqual(resposta);
                });

            const request =
                httpTestingController.expectOne(
                    `${environment.api}/perfil`
                );

            expect(request.request.method).toBe('POST');
            expect(request.request.body).toEqual(dados);

            request.flush(resposta);
        });
    });

    describe('listar', () => {
        it(
            'deve enviar GET com paginação, ordenação e filtro',
            () => {
                const resposta = {
                    content: [
                        {
                            id: 1,
                            nome: 'Administrador'
                        }
                    ],
                    totalElements: 1
                };

                service
                    .listar(
                        'perfil',
                        1,
                        20,
                        'nome,asc',
                        'admin',
                        10
                    )
                    .subscribe((resultado) => {
                        expect(resultado).toEqual(
                            resposta as any
                        );
                    });

                const request =
                    httpTestingController.expectOne(
                        (requisicao) => {
                            return requisicao.url ===
                                `${environment.api}/perfil`;
                        }
                    );

                expect(
                    request.request.method
                ).toBe('GET');

                expect(
                    request.request.params.get('page')
                ).toBe('1');

                expect(
                    request.request.params.get('size')
                ).toBe('20');

                expect(
                    request.request.params.get('sort')
                ).toBe('nome,asc');

                expect(
                    request.request.params.get('filtro')
                ).toBe('admin');

                expect(
                    request.request.params.get('outroId')
                ).toBe('10');

                request.flush(resposta);
            }
        );

        it(
            'não deve enviar filtro com menos de três caracteres',
            () => {
                service
                    .listar(
                        'perfil',
                        undefined,
                        undefined,
                        undefined,
                        'ab'
                    )
                    .subscribe();

                const request =
                    httpTestingController.expectOne(
                        `${environment.api}/perfil`
                    );

                expect(
                    request.request.method
                ).toBe('GET');

                expect(
                    request.request.params.has('filtro')
                ).toBeFalse();

                request.flush({
                    content: [],
                    totalElements: 0
                });
            }
        );

        it(
            'deve preservar o comportamento atual de não enviar página zero',
            () => {
                service
                    .listar('perfil', 0, 10)
                    .subscribe();

                const request =
                    httpTestingController.expectOne(
                        (requisicao) => {
                            return requisicao.url ===
                                `${environment.api}/perfil`;
                        }
                    );

                expect(
                    request.request.params.has('page')
                ).toBeFalse();

                expect(
                    request.request.params.get('size')
                ).toBe('10');

                request.flush({
                    content: [],
                    totalElements: 0
                });
            }
        );
    });

    describe('atualizar', () => {
        it('deve enviar PUT com os dados informados', () => {
            const dados = {
                id: 1,
                nome: 'Perfil atualizado'
            };

            service
                .atualizar('perfil', dados)
                .subscribe((resultado) => {
                    expect(resultado).toEqual(dados);
                });

            const request =
                httpTestingController.expectOne(
                    `${environment.api}/perfil`
                );

            expect(request.request.method).toBe('PUT');
            expect(request.request.body).toEqual(dados);

            request.flush(dados);
        });
    });

    describe('excluir', () => {
        it(
            'deve enviar DELETE com o identificador na URL',
            () => {
                service
                    .excluir('perfil', 15)
                    .subscribe((resultado) => {
                        expect(resultado).toBeNull();
                    });

                const request =
                    httpTestingController.expectOne(
                        `${environment.api}/perfil/15`
                    );

                expect(
                    request.request.method
                ).toBe('DELETE');

                expect(
                    request.request.body
                ).toBeNull();

                request.flush(null);
            }
        );
    });

    describe('detalhar', () => {
        it(
            'deve enviar GET com o identificador na URL',
            () => {
                const resposta = {
                    id: 7,
                    nome: 'Administrador'
                };

                service
                    .detalhar('perfil', 7)
                    .subscribe((resultado) => {
                        expect(resultado).toEqual(resposta);
                    });

                const request =
                    httpTestingController.expectOne(
                        `${environment.api}/perfil/7`
                    );

                expect(
                    request.request.method
                ).toBe('GET');

                request.flush(resposta);
            }
        );
    });

    describe('salvar', () => {
        it(
            'deve cadastrar quando o identificador estiver vazio',
            () => {
                const formulario = new FormGroup({
                    id: new FormControl(''),
                    nome: new FormControl(
                        'Novo perfil',
                        Validators.required
                    )
                });

                const resultado = service.salvar(
                    'perfil',
                    formulario
                );

                expect(resultado).toBeDefined();

                resultado?.subscribe((resposta) => {
                    expect(resposta).toEqual({
                        id: 1,
                        nome: 'Novo perfil'
                    });
                });

                const request =
                    httpTestingController.expectOne(
                        `${environment.api}/perfil`
                    );

                expect(
                    request.request.method
                ).toBe('POST');

                expect(
                    request.request.body
                ).toEqual({
                    id: '',
                    nome: 'Novo perfil'
                });

                request.flush({
                    id: 1,
                    nome: 'Novo perfil'
                });
            }
        );

        it(
            'deve cadastrar quando o formulário não possuir identificador',
            () => {
                const formulario = new FormGroup({
                    nome: new FormControl(
                        'Novo perfil',
                        Validators.required
                    )
                });

                const resultado = service.salvar(
                    'perfil',
                    formulario
                );

                expect(resultado).toBeDefined();

                resultado?.subscribe((resposta) => {
                    expect(resposta).toEqual({
                        id: 1,
                        nome: 'Novo perfil'
                    });
                });

                const request =
                    httpTestingController.expectOne(
                        `${environment.api}/perfil`
                    );

                expect(
                    request.request.method
                ).toBe('POST');

                expect(
                    request.request.body
                ).toEqual({
                    nome: 'Novo perfil'
                });

                request.flush({
                    id: 1,
                    nome: 'Novo perfil'
                });
            }
        );

        it(
            'deve cadastrar quando o identificador for nulo',
            () => {
                const formulario = new FormGroup({
                    id: new FormControl<number | null>(
                        null
                    ),
                    nome: new FormControl(
                        'Novo perfil',
                        Validators.required
                    )
                });

                const resultado = service.salvar(
                    'perfil',
                    formulario
                );

                expect(resultado).toBeDefined();

                resultado?.subscribe((resposta) => {
                    expect(resposta).toEqual({
                        id: 1,
                        nome: 'Novo perfil'
                    });
                });

                const request =
                    httpTestingController.expectOne(
                        `${environment.api}/perfil`
                    );

                expect(
                    request.request.method
                ).toBe('POST');

                expect(
                    request.request.body
                ).toEqual({
                    id: null,
                    nome: 'Novo perfil'
                });

                request.flush({
                    id: 1,
                    nome: 'Novo perfil'
                });
            }
        );

        it(
            'deve atualizar quando o identificador estiver preenchido',
            () => {
                const formulario = new FormGroup({
                    id: new FormControl(20),
                    nome: new FormControl(
                        'Perfil atualizado',
                        Validators.required
                    )
                });

                const resultado = service.salvar(
                    'perfil',
                    formulario
                );

                expect(resultado).toBeDefined();

                resultado?.subscribe((resposta) => {
                    expect(resposta).toEqual(
                        formulario.value
                    );
                });

                const request =
                    httpTestingController.expectOne(
                        `${environment.api}/perfil`
                    );

                expect(
                    request.request.method
                ).toBe('PUT');

                expect(
                    request.request.body
                ).toEqual(formulario.value);

                request.flush(formulario.value);
            }
        );

        it(
            'não deve executar requisição quando o formulário for inválido',
            () => {
                const formulario = new FormGroup({
                    id: new FormControl(''),
                    nome: new FormControl(
                        '',
                        Validators.required
                    )
                });

                const resultado = service.salvar(
                    'perfil',
                    formulario
                );

                expect(resultado).toBeUndefined();

                httpTestingController.expectNone(
                    `${environment.api}/perfil`
                );
            }
        );
    });

    describe('inativar', () => {
        it(
            'deve delegar a operação para o endpoint de exclusão',
            () => {
                service
                    .inativar('perfil', 30)
                    .subscribe((resultado) => {
                        expect(resultado).toBeNull();
                    });

                const request =
                    httpTestingController.expectOne(
                        `${environment.api}/perfil/30`
                    );

                expect(
                    request.request.method
                ).toBe('DELETE');

                request.flush(null);
            }
        );
    });
});
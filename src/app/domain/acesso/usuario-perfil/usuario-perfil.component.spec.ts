import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import {
    FormBuilder
} from '@angular/forms';

import {
    ActivatedRoute,
    Router
} from '@angular/router';

import {
    ToastrService
} from 'ngx-toastr';

import {
    of,
    throwError
} from 'rxjs';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    UsuarioPerfilComponent
} from './usuario-perfil.component';

import {
    UsuarioPerfilService
} from './services/usuario-perfil.service';

describe('UsuarioPerfilComponent', () => {
    let component:
        UsuarioPerfilComponent;

    let fixture:
        ComponentFixture<
            UsuarioPerfilComponent
        >;

    let serviceMock:
        jasmine.SpyObj<
            UsuarioPerfilService
        >;

    const autorizacaoServiceMock = {
        possuiPermissao:
            jasmine.createSpy(
                'possuiPermissao'
            )
    };

    const routerMock = {
        navigate:
            jasmine.createSpy(
                'navigate'
            )
    };

    const paramMapGetMock =
        jasmine.createSpy(
            'get'
        );

    const activatedRouteMock = {
        snapshot: {
            paramMap: {
                get: paramMapGetMock
            }
        }
    };

    const toastrMock = {
        success:
            jasmine.createSpy(
                'success'
            ),
        error:
            jasmine.createSpy(
                'error'
            ),
        info:
            jasmine.createSpy(
                'info'
            )
    };

    const vinculo = {
        id: 5,
        idUsuario: 2,
        usuario:
            'usuario@empresa.com',
        idPerfil: 3,
        perfil:
            'Administrador',
        status: 'ATIVO' as const
    };

    beforeEach(async () => {
        autorizacaoServiceMock
            .possuiPermissao
            .calls
            .reset();

        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(false);

        routerMock
            .navigate
            .calls
            .reset();

        paramMapGetMock
            .calls
            .reset();

        paramMapGetMock
            .and.returnValue('2');

        toastrMock
            .success
            .calls
            .reset();

        toastrMock
            .error
            .calls
            .reset();

        toastrMock
            .info
            .calls
            .reset();

        serviceMock =
            jasmine.createSpyObj<
                UsuarioPerfilService
            >(
                'UsuarioPerfilService',
                [
                    'listarPorUsuario',
                    'cadastrar',
                    'excluir',
                    'detalhar'
                ]
            );

        serviceMock
            .listarPorUsuario
            .and.returnValue(
                of([])
            );

        await TestBed
            .configureTestingModule({
                declarations: [
                    UsuarioPerfilComponent
                ],
                providers: [
                    FormBuilder,
                    {
                        provide:
                            UsuarioPerfilService,
                        useValue:
                            serviceMock
                    },
                    {
                        provide:
                            AutorizacaoService,
                        useValue:
                            autorizacaoServiceMock
                    },
                    {
                        provide:
                            ActivatedRoute,
                        useValue:
                            activatedRouteMock
                    },
                    {
                        provide: Router,
                        useValue:
                            routerMock
                    },
                    {
                        provide:
                            ToastrService,
                        useValue:
                            toastrMock
                    }
                ]
            })
            .overrideComponent(
                UsuarioPerfilComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                UsuarioPerfilComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it(
        'deve ser criado',
        () => {
            expect(
                component
            ).toBeTruthy();
        }
    );

    it(
        'deve configurar a página e as colunas',
        () => {
            expect(
                component.pagina
            ).toBe(
                'Perfis do usuário'
            );

            expect(
                component.coluna
            ).toEqual([
                'Código do perfil',
                'Perfil',
                'Status'
            ]);
        }
    );

    it(
        'deve carregar os perfis do usuário ao inicializar',
        () => {
            expect(
                component.idUsuario
            ).toBe(2);

            expect(
                serviceMock
                    .listarPorUsuario
            ).toHaveBeenCalledOnceWith(
                2
            );
        }
    );

    it(
        'deve preencher a lista e o total de registros',
        () => {
            serviceMock
                .listarPorUsuario
                .and.returnValue(
                    of([
                        {
                            id: 5,
                            idPerfil: 3,
                            perfil:
                                'Administrador',
                            status:
                                'ATIVO'
                        }
                    ])
                );

            component.carregarLista();

            expect(
                component.lista.length
            ).toBe(1);

            expect(
                component.totalRegistros
            ).toBe(1);
        }
    );

    it(
        'deve controlar as ações conforme as permissões',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        [
                            ChavePermissao
                                .UsuarioPerfilCriar,
                            ChavePermissao
                                .UsuarioPerfilDetalhar
                        ].includes(
                            permissao
                        )
                );

            expect(
                component.podeCriar
            ).toBeTrue();

            expect(
                component.podeExcluir
            ).toBeFalse();

            expect(
                component.podeDetalhar
            ).toBeTrue();

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao
                    .UsuarioPerfilCriar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao
                    .UsuarioPerfilExcluir
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao
                    .UsuarioPerfilDetalhar
            );
        }
    );

    it(
        'deve abrir o formulário de vínculo quando autorizado',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioPerfilCriar
            );

            component.botaoAdicionar();

            expect(
                component.isLista
            ).toBeFalse();

            expect(
                component.isFormulario
            ).toBeTrue();

            expect(
                component.isVisualizacao
            ).toBeFalse();

            expect(
                component.formulario
                    .getRawValue()
            ).toEqual({
                idUsuario: 2,
                idPerfil: null
            });

            expect(
                component.formulario
                    .get('idPerfil')
                    ?.hasError('required')
            ).toBeTrue();
        }
    );

    it(
        'não deve abrir o formulário sem permissão',
        () => {
            component.botaoAdicionar();

            expect(
                component.isLista
            ).toBeTrue();

            expect(
                component.isFormulario
            ).toBeFalse();
        }
    );

    it(
        'deve detalhar o perfil do usuário quando autorizado',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioPerfilDetalhar
            );

            serviceMock
                .detalhar
                .and.returnValue(
                    of(vinculo)
                );

            component
                .botaoVisualizar(5);

            expect(
                serviceMock.detalhar
            ).toHaveBeenCalledOnceWith(
                5
            );

            expect(
                component.isLista
            ).toBeFalse();

            expect(
                component.isFormulario
            ).toBeTrue();

            expect(
                component.isVisualizacao
            ).toBeTrue();

            expect(
                component.formulario
                    .disabled
            ).toBeTrue();

            expect(
                component.formulario
                    .getRawValue()
            ).toEqual(vinculo);
        }
    );

    it(
        'não deve detalhar sem permissão',
        () => {
            component
                .botaoVisualizar(5);

            expect(
                serviceMock.detalhar
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve vincular o perfil ao usuário',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioPerfilCriar
            );

            serviceMock
                .cadastrar
                .and.returnValue(
                    of(vinculo)
                );

            component.botaoAdicionar();

            component.formulario
                .get('idPerfil')
                ?.setValue(3);

            component.salvar();

            expect(
                serviceMock.cadastrar
            ).toHaveBeenCalledOnceWith({
                idUsuario: 2,
                idPerfil: 3
            });

            expect(
                component.isLista
            ).toBeTrue();

            expect(
                component.isFormulario
            ).toBeFalse();

            expect(
                serviceMock
                    .listarPorUsuario
            ).toHaveBeenCalledTimes(2);

            expect(
                toastrMock.success
            ).toHaveBeenCalledOnceWith(
                'Perfil vinculado com sucesso'
            );
        }
    );

    it(
        'não deve salvar formulário inválido',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioPerfilCriar
            );

            component.botaoAdicionar();
            component.salvar();

            expect(
                serviceMock.cadastrar
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'não deve salvar sem permissão',
        () => {
            component.formulario =
                new FormBuilder().group({
                    idUsuario: [2],
                    idPerfil: [3]
                });

            component.salvar();

            expect(
                serviceMock.cadastrar
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve excluir o perfil do usuário quando autorizado',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioPerfilExcluir
            );

            serviceMock
                .excluir
                .and.returnValue(
                    of(undefined)
                );

            component.botaoExcluir(5);

            expect(
                serviceMock.excluir
            ).toHaveBeenCalledOnceWith(
                5
            );

            expect(
                serviceMock
                    .listarPorUsuario
            ).toHaveBeenCalledTimes(2);

            expect(
                toastrMock.info
            ).toHaveBeenCalledOnceWith(
                'Perfil removido do usuário'
            );
        }
    );

    it(
        'não deve excluir sem permissão',
        () => {
            component.botaoExcluir(5);

            expect(
                serviceMock.excluir
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve cancelar e retornar para a lista',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioPerfilCriar
            );

            component.botaoAdicionar();

            component.formulario
                .get('idPerfil')
                ?.setValue(3);

            component.cancelar();

            expect(
                component.isLista
            ).toBeTrue();

            expect(
                component.isFormulario
            ).toBeFalse();

            expect(
                component.isVisualizacao
            ).toBeFalse();

            expect(
                component.formulario
                    .get('idPerfil')
                    ?.value
            ).toBeNull();
        }
    );

    it(
        'deve voltar para a lista de usuários',
        () => {
            component.voltar();

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith([
                '/acesso/usuarios'
            ]);
        }
    );

    it(
        'deve voltar quando o identificador do usuário for inválido',
        () => {
            paramMapGetMock
                .and.returnValue(null);

            routerMock
                .navigate
                .calls
                .reset();

            serviceMock
                .listarPorUsuario
                .calls
                .reset();

            component.ngOnInit();

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith([
                '/acesso/usuarios'
            ]);

            expect(
                serviceMock
                    .listarPorUsuario
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve informar erro ao falhar no carregamento',
        () => {
            serviceMock
                .listarPorUsuario
                .and.returnValue(
                    throwError(
                        () => new Error(
                            'Erro ao listar'
                        )
                    )
                );

            component.carregarLista();

            expect(
                toastrMock.error
            ).toHaveBeenCalledOnceWith(
                'Não foi possível carregar os perfis do usuário'
            );
        }
    );

    it(
        'deve informar erro ao falhar no detalhamento',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioPerfilDetalhar
            );

            serviceMock
                .detalhar
                .and.returnValue(
                    throwError(
                        () => new Error(
                            'Erro ao detalhar'
                        )
                    )
                );

            component
                .botaoVisualizar(5);

            expect(
                toastrMock.error
            ).toHaveBeenCalledOnceWith(
                'Não foi possível detalhar o perfil do usuário'
            );
        }
    );

    it(
        'deve informar erro ao falhar no vínculo',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioPerfilCriar
            );

            serviceMock
                .cadastrar
                .and.returnValue(
                    throwError(
                        () => new Error(
                            'Erro ao cadastrar'
                        )
                    )
                );

            component.botaoAdicionar();

            component.formulario
                .get('idPerfil')
                ?.setValue(3);

            component.salvar();

            expect(
                toastrMock.error
            ).toHaveBeenCalledOnceWith(
                'Não foi possível vincular o perfil'
            );
        }
    );

    it(
        'deve informar erro ao falhar na exclusão',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioPerfilExcluir
            );

            serviceMock
                .excluir
                .and.returnValue(
                    throwError(
                        () => new Error(
                            'Erro ao excluir'
                        )
                    )
                );

            component.botaoExcluir(5);

            expect(
                toastrMock.error
            ).toHaveBeenCalledOnceWith(
                'Não foi possível remover o perfil do usuário'
            );
        }
    );

    function autorizar(
        permissaoAutorizada:
            ChavePermissao
    ): void {
        autorizacaoServiceMock
            .possuiPermissao
            .and.callFake(
                (
                    permissao:
                        ChavePermissao
                ) =>
                    permissao ===
                    permissaoAutorizada
            );
    }
});
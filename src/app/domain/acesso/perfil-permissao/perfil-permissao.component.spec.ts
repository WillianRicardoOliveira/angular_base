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
    PerfilPermissaoComponent
} from './perfil-permissao.component';

import {
    PerfilPermissaoService
} from './services/perfil-permissao.service';

describe('PerfilPermissaoComponent', () => {
    let component:
        PerfilPermissaoComponent;

    let fixture:
        ComponentFixture<
            PerfilPermissaoComponent
        >;

    let serviceMock:
        jasmine.SpyObj<
            PerfilPermissaoService
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
        idPerfil: 3,
        perfil: 'Administrador',
        idPermissao: 10,
        permissao:
            'Listar usuários',
        chave:
            'ACESSO_USUARIO_LISTAR',
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
            .and.returnValue('3');

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
                PerfilPermissaoService
            >(
                'PerfilPermissaoService',
                [
                    'listarPorPerfil',
                    'cadastrar',
                    'excluir',
                    'detalhar'
                ]
            );

        serviceMock
            .listarPorPerfil
            .and.returnValue(
                of({
                    content: [],
                    totalElements: 0
                })
            );

        await TestBed
            .configureTestingModule({
                declarations: [
                    PerfilPermissaoComponent
                ],
                providers: [
                    FormBuilder,
                    {
                        provide:
                            PerfilPermissaoService,
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
                PerfilPermissaoComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                PerfilPermissaoComponent
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
                'Permissões do perfil'
            );

            expect(
                component.coluna
            ).toEqual([
                'Código da permissão',
                'Permissão',
                'Chave',
                'Status'
            ]);
        }
    );

    it(
        'deve carregar as permissões do perfil ao inicializar',
        () => {
            expect(
                component.idPerfil
            ).toBe(3);

            expect(
                serviceMock
                    .listarPorPerfil
            ).toHaveBeenCalledOnceWith(
                3,
                undefined,
                undefined
            );
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
                                .PerfilPermissaoCriar,
                            ChavePermissao
                                .PerfilPermissaoDetalhar,
                            ChavePermissao
                                .PerfilPermissaoListar
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
                component
                    .podeGerenciarPermissoes
            ).toBeTrue();

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao
                    .PerfilPermissaoCriar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao
                    .PerfilPermissaoExcluir
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao
                    .PerfilPermissaoDetalhar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao
                    .PerfilPermissaoListar
            );
        }
    );

    it(
        'deve abrir o formulário de vínculo quando autorizado',
        () => {
            autorizar(
                ChavePermissao
                    .PerfilPermissaoCriar
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
                idPerfil: 3,
                idPermissao: null
            });

            expect(
                component.formulario
                    .get('idPermissao')
                    ?.hasError('required')
            ).toBeTrue();
        }
    );

    it(
        'não deve abrir o formulário de vínculo sem permissão',
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
        'deve detalhar a permissão do perfil quando autorizado',
        () => {
            autorizar(
                ChavePermissao
                    .PerfilPermissaoDetalhar
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
        'deve vincular a permissão ao perfil',
        () => {
            autorizar(
                ChavePermissao
                    .PerfilPermissaoCriar
            );

            serviceMock
                .cadastrar
                .and.returnValue(
                    of(vinculo)
                );

            component.botaoAdicionar();

            component.formulario
                .get('idPermissao')
                ?.setValue(10);

            component.salvar();

            expect(
                serviceMock.cadastrar
            ).toHaveBeenCalledOnceWith({
                idPerfil: 3,
                idPermissao: 10
            });

            expect(
                component.isLista
            ).toBeTrue();

            expect(
                component.isFormulario
            ).toBeFalse();

            expect(
                serviceMock
                    .listarPorPerfil
            ).toHaveBeenCalledTimes(2);

            expect(
                toastrMock.success
            ).toHaveBeenCalledOnceWith(
                'Permissão vinculada com sucesso'
            );
        }
    );

    it(
        'não deve salvar formulário inválido',
        () => {
            autorizar(
                ChavePermissao
                    .PerfilPermissaoCriar
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
                    idPerfil: [3],
                    idPermissao: [10]
                });

            component.salvar();

            expect(
                serviceMock.cadastrar
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve excluir a permissão do perfil quando autorizado',
        () => {
            autorizar(
                ChavePermissao
                    .PerfilPermissaoExcluir
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
                    .listarPorPerfil
            ).toHaveBeenCalledTimes(2);

            expect(
                toastrMock.info
            ).toHaveBeenCalledOnceWith(
                'Permissão removida do perfil'
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
        'deve carregar a página solicitada',
        () => {
            const parametros = {
                page: 2,
                size: 20
            };

            component
                .quantidadePorPagina(
                    parametros
                );

            expect(
                serviceMock
                    .listarPorPerfil
            ).toHaveBeenCalledWith(
                3,
                2,
                20
            );
        }
    );

    it(
        'deve cancelar e retornar para a lista',
        () => {
            autorizar(
                ChavePermissao
                    .PerfilPermissaoCriar
            );

            component.botaoAdicionar();

            component.formulario
                .get('idPermissao')
                ?.setValue(10);

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
                    .get('idPermissao')
                    ?.value
            ).toBeNull();
        }
    );

    it(
        'deve voltar para a lista de perfis',
        () => {
            component.voltar();

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith([
                '/acesso/perfis'
            ]);
        }
    );

    it(
        'deve voltar para perfis quando o identificador for inválido',
        () => {
            paramMapGetMock
                .and.returnValue(null);

            routerMock
                .navigate
                .calls
                .reset();

            serviceMock
                .listarPorPerfil
                .calls
                .reset();

            component.ngOnInit();

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith([
                '/acesso/perfis'
            ]);

            expect(
                serviceMock
                    .listarPorPerfil
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve informar erro ao falhar no carregamento',
        () => {
            serviceMock
                .listarPorPerfil
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
                'Não foi possível carregar as permissões do perfil'
            );
        }
    );

    it(
        'deve informar erro ao falhar no detalhamento',
        () => {
            autorizar(
                ChavePermissao
                    .PerfilPermissaoDetalhar
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
                'Não foi possível detalhar a permissão do perfil'
            );
        }
    );

    it(
        'deve informar erro ao falhar no vínculo',
        () => {
            autorizar(
                ChavePermissao
                    .PerfilPermissaoCriar
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
                .get('idPermissao')
                ?.setValue(10);

            component.salvar();

            expect(
                toastrMock.error
            ).toHaveBeenCalledOnceWith(
                'Não foi possível vincular a permissão'
            );
        }
    );

    it(
        'deve informar erro ao falhar na exclusão',
        () => {
            autorizar(
                ChavePermissao
                    .PerfilPermissaoExcluir
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
                'Não foi possível remover a permissão do perfil'
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
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick
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
    BehaviorSubject,
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
    OrganizacaoDisponivel
} from '@/core/organizacao/models/organizacao-disponivel.model';

import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

import {
    Empresa,
    UsuarioEmpresa
} from '@/interfaces/interfaces';

import {
    UsuarioEmpresaService
} from './services/usuario-empresa.service';

import {
    UsuarioEmpresaComponent
} from './usuario-empresa.component';

describe('UsuarioEmpresaComponent', () => {
    let component:
        UsuarioEmpresaComponent;

    let fixture:
        ComponentFixture<UsuarioEmpresaComponent>;

    let serviceMock:
        jasmine.SpyObj<UsuarioEmpresaService>;

    let organizacaoProntaSubject:
        BehaviorSubject<OrganizacaoDisponivel | null>;

    const contextoOrganizacaoServiceMock = {
        retornarOrganizacaoProntaObservable:
            jasmine.createSpy(
                'retornarOrganizacaoProntaObservable'
            )
    };

    const autorizacaoServiceMock = {
        possuiPermissao: jasmine.createSpy(
            'possuiPermissao'
        )
    };

    const paramMapMock = {
        get: jasmine.createSpy(
            'get'
        )
    };

    const activatedRouteMock = {
        snapshot: {
            paramMap:
                paramMapMock
        }
    };

    const routerMock = {
        navigate: jasmine.createSpy(
            'navigate'
        )
    };

    const toastrMock = {
        success: jasmine.createSpy(
            'success'
        ),
        error: jasmine.createSpy(
            'error'
        ),
        info: jasmine.createSpy(
            'info'
        )
    };

    const empresa: Empresa = {
        id: 2,
        nome: 'Empresa Exemplo',
        status: 'ATIVO'
    };

    const usuarioEmpresa:
        UsuarioEmpresa = {
            id: 3,
            idUsuario: 1,
            usuario:
                'usuario@empresa.com',
            idEmpresa: 2,
            empresa:
                'Empresa Exemplo',
            todasSubsidiarias: false,
            status: 'ATIVO'
        };

    beforeEach(async () => {
        organizacaoProntaSubject =
            new BehaviorSubject<
                OrganizacaoDisponivel | null
            >({
                id: 1,
                nome: 'Organização 1'
            });

        contextoOrganizacaoServiceMock
            .retornarOrganizacaoProntaObservable
            .calls
            .reset();

        contextoOrganizacaoServiceMock
            .retornarOrganizacaoProntaObservable
            .and.returnValue(
                organizacaoProntaSubject
                    .asObservable()
            );

        paramMapMock.get.calls.reset();
        paramMapMock.get.and.returnValue(
            '1'
        );

        routerMock.navigate.calls.reset();

        autorizacaoServiceMock
            .possuiPermissao
            .calls
            .reset();

        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(false);

        toastrMock.success.calls.reset();
        toastrMock.error.calls.reset();
        toastrMock.info.calls.reset();

        serviceMock =
            jasmine.createSpyObj<UsuarioEmpresaService>(
                'UsuarioEmpresaService',
                [
                    'listar',
                    'listarEmpresas',
                    'cadastrar',
                    'atualizar',
                    'detalhar',
                    'excluir'
                ]
            );

        serviceMock.listar.and.returnValue(
            of({
                content: [],
                totalElements: 0
            })
        );

        serviceMock.listarEmpresas.and.returnValue(
            of({
                content: [],
                totalElements: 0
            })
        );

        serviceMock.cadastrar.and.returnValue(
            of(usuarioEmpresa)
        );

        serviceMock.atualizar.and.returnValue(
            of(usuarioEmpresa)
        );

        serviceMock.detalhar.and.returnValue(
            of(usuarioEmpresa)
        );

        serviceMock.excluir.and.returnValue(
            of(void 0)
        );

        await TestBed
            .configureTestingModule({
                declarations: [
                    UsuarioEmpresaComponent
                ],
                providers: [
                    FormBuilder,
                    {
                        provide:
                            UsuarioEmpresaService,
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
                            ContextoOrganizacaoService,
                        useValue:
                            contextoOrganizacaoServiceMock
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
                UsuarioEmpresaComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                UsuarioEmpresaComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it(
        'deve obter o usuário pela rota',
        () => {
            expect(paramMapMock.get)
                .toHaveBeenCalledWith(
                    'idUsuario'
                );

            expect(component.idUsuario)
                .toBe(1);
        }
    );

    it(
        'deve configurar página e colunas',
        () => {
            expect(component.pagina)
                .toBe(
                    'Empresas do usuário'
                );

            expect(component.coluna)
                .toEqual([
                    'Código do usuário',
                    'Usuário',
                    'Código da empresa',
                    'Empresa',
                    'Todas as subsidiárias',
                    'Status'
                ]);
        }
    );

    it(
        'deve carregar vínculos do usuário ao inicializar',
        () => {
            expect(serviceMock.listar)
                .toHaveBeenCalledOnceWith(
                    0,
                    10,
                    'id,desc',
                    1
                );
        }
    );

    it(
        'deve limpar durante a troca e voltar somente quando a nova organização estiver pronta',
        () => {
            serviceMock.listar.calls.reset();
            serviceMock.listarEmpresas.calls.reset();
            routerMock.navigate.calls.reset();

            component.formulario =
                new FormBuilder().group({
                    id: [3],
                    todasSubsidiarias: [true]
                });

            component.lista = [
                usuarioEmpresa
            ];

            component.empresas = [
                empresa
            ];

            component.totalRegistros = 1;
            component.paginaAtual = 2;
            component.tamanhoPagina = 20;
            component.usuarioNome =
                'usuario@empresa.com';
            component.empresaNome =
                'Empresa Exemplo';
            component.isLista = false;
            component.isFormulario = true;
            component.isVisualizacao = true;

            organizacaoProntaSubject.next(null);

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();

            expect(component.isVisualizacao)
                .toBeFalse();

            expect(component.lista)
                .toEqual([]);

            expect(component.empresas)
                .toEqual([]);

            expect(component.totalRegistros)
                .toBe(0);

            expect(component.paginaAtual)
                .toBe(0);

            expect(component.tamanhoPagina)
                .toBe(10);

            expect(component.usuarioNome)
                .toBe('');

            expect(component.empresaNome)
                .toBe('');

            expect(serviceMock.listar)
                .not.toHaveBeenCalled();

            expect(serviceMock.listarEmpresas)
                .not.toHaveBeenCalled();

            expect(routerMock.navigate)
                .not.toHaveBeenCalled();

            organizacaoProntaSubject.next({
                id: 2,
                nome: 'Organização 2'
            });

            expect(serviceMock.listar)
                .not.toHaveBeenCalled();

            expect(serviceMock.listarEmpresas)
                .not.toHaveBeenCalled();

            expect(routerMock.navigate)
                .toHaveBeenCalledOnceWith([
                    '/acesso/usuarios'
                ]);
        }
    );

    it(
        'deve redirecionar quando o usuário for inválido',
        () => {
            serviceMock.listar.calls.reset();

            paramMapMock.get.and.returnValue(
                null
            );

            component.ngOnInit();

            expect(routerMock.navigate)
                .toHaveBeenCalledWith([
                    '/acesso/usuarios'
                ]);

            expect(serviceMock.listar)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'deve armazenar os vínculos carregados',
        () => {
            serviceMock.listar.and.returnValue(
                of({
                    content: [
                        usuarioEmpresa
                    ],
                    totalElements: 1
                })
            );

            component.carregarLista(
                2,
                20
            );

            expect(component.lista)
                .toEqual([
                    usuarioEmpresa
                ]);

            expect(component.totalRegistros)
                .toBe(1);

            expect(component.paginaAtual)
                .toBe(2);

            expect(component.tamanhoPagina)
                .toBe(20);
        }
    );

    it(
        'deve alterar a paginação',
        () => {
            serviceMock.listar.calls.reset();

            component.quantidadePorPagina({
                page: 3,
                size: 25
            });

            expect(serviceMock.listar)
                .toHaveBeenCalledOnceWith(
                    3,
                    25,
                    'id,desc',
                    1
                );
        }
    );

    it(
        'deve controlar as ações por permissão',
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
                                .UsuarioEmpresaCriar,
                            ChavePermissao
                                .UsuarioEmpresaExcluir,
                            ChavePermissao
                                .UsuarioEmpresaDetalhar
                        ].includes(permissao)
                );

            expect(component.podeCriar)
                .toBeTrue();

            expect(component.podeEditar)
                .toBeFalse();

            expect(component.podeExcluir)
                .toBeTrue();

            expect(component.podeDetalhar)
                .toBeTrue();
        }
    );

        it(
        'deve configurar acao extra para subsidiarias',
        () => {
            expect(component.acoesExtras)
                .toEqual([
                    {
                        chave: 'subsidiarias',
                        icone: 'account_tree',
                        tooltip: 'Subsidiarias'
                    }
                ]);
        }
    );

    it(
        'deve controlar permissao para gerenciar subsidiarias',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .UsuarioSubsidiariaListar
                );

            expect(component.podeGerenciarSubsidiarias)
                .toBeTrue();

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao
                    .UsuarioSubsidiariaListar
            );
        }
    );

    it(
        'deve navegar para subsidiarias especificas da empresa do usuario',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .UsuarioSubsidiariaListar
                );

            routerMock.navigate.calls.reset();

            component.lista = [
                usuarioEmpresa
            ];

            component.botaoAcaoExtra({
                chave: 'subsidiarias',
                id: 3
            });

            expect(routerMock.navigate)
                .toHaveBeenCalledOnceWith([
                    '/acesso/usuarios',
                    1,
                    'empresas',
                    3,
                    'subsidiarias'
                ]);

            expect(toastrMock.info)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'nao deve navegar para subsidiarias sem permissao',
        () => {
            routerMock.navigate.calls.reset();

            component.lista = [
                usuarioEmpresa
            ];

            component.botaoAcaoExtra({
                chave: 'subsidiarias',
                id: 3
            });

            expect(routerMock.navigate)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'nao deve navegar para subsidiarias quando usuario ja acessa todas',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .UsuarioSubsidiariaListar
                );

            routerMock.navigate.calls.reset();

            component.lista = [
                {
                    ...usuarioEmpresa,
                    todasSubsidiarias: true
                }
            ];

            component.botaoAcaoExtra({
                chave: 'subsidiarias',
                id: 3
            });

            expect(routerMock.navigate)
                .not.toHaveBeenCalled();

            expect(toastrMock.info)
                .toHaveBeenCalledOnceWith(
                    'Usuario ja possui acesso a todas as subsidiarias da empresa'
                );
        }
    );

    it(
        'deve ignorar acao extra desconhecida',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .UsuarioSubsidiariaListar
                );

            routerMock.navigate.calls.reset();

            component.lista = [
                usuarioEmpresa
            ];

            component.botaoAcaoExtra({
                chave: 'outra-acao',
                id: 3
            });

            expect(routerMock.navigate)
                .not.toHaveBeenCalled();

            expect(toastrMock.info)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'deve abrir o formulário de cadastro',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            component.botaoAdicionar();

            expect(component.isLista)
                .toBeFalse();

            expect(component.isFormulario)
                .toBeTrue();

            expect(component.isVisualizacao)
                .toBeFalse();

            expect(
                component.formulario
                    .getRawValue()
            ).toEqual({
                idUsuario: 1,
                idEmpresa: null,
                todasSubsidiarias: false
            });

            expect(serviceMock.listarEmpresas)
                .toHaveBeenCalledWith(
                    '',
                    0,
                    10
                );
        }
    );

    it(
        'não deve abrir cadastro sem permissão',
        () => {
            component.botaoAdicionar();

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();

            expect(serviceMock.listarEmpresas)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'deve exigir somente a empresa no cadastro',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            component.botaoAdicionar();

            expect(
                component.formulario
                    .get('idEmpresa')
                    ?.hasError('required')
            ).toBeTrue();

            expect(
                component.formulario
                    .get('todasSubsidiarias')
                    ?.valid
            ).toBeTrue();

            expect(
                component.formulario
                    .get('todasSubsidiarias')
                    ?.value
            ).toBeFalse();
        }
    );

    it(
        'deve selecionar a empresa',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            component.botaoAdicionar();

            component.selecionarEmpresa(
                empresa
            );

            expect(
                component.formulario
                    .get('idEmpresa')
                    ?.value
            ).toBe(2);

            expect(component.empresaNome)
                .toBe('Empresa Exemplo');

            expect(component.formulario.valid)
                .toBeTrue();
        }
    );

    it(
        'deve exibir o nome da empresa',
        () => {
            expect(
                component.exibirEmpresa(
                    empresa
                )
            ).toBe('Empresa Exemplo');

            expect(
                component.exibirEmpresa(
                    'Empresa digitada'
                )
            ).toBe('Empresa digitada');

            expect(
                component.exibirEmpresa(
                    null
                )
            ).toBe('');
        }
    );

    it(
        'deve pesquisar empresas após a digitação',
        fakeAsync(() => {
            serviceMock
                .listarEmpresas
                .calls
                .reset();

            component
                .empresaPesquisaControl
                .setValue('Empresa');

            tick(300);

            expect(
                serviceMock.listarEmpresas
            ).toHaveBeenCalledOnceWith(
                'Empresa',
                0,
                10
            );
        })
    );

    it(
        'deve armazenar empresas encontradas',
        fakeAsync(() => {
            serviceMock
                .listarEmpresas
                .and.returnValue(
                    of({
                        content: [
                            empresa
                        ],
                        totalElements: 1
                    })
                );

            component
                .empresaPesquisaControl
                .setValue('Empresa');

            tick(300);

            expect(component.empresas)
                .toEqual([
                    empresa
                ]);
        })
    );

    it(
        'deve cadastrar vínculo permitindo todas as subsidiárias como falso',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .UsuarioEmpresaCriar
                );

            component.botaoAdicionar();

            component.selecionarEmpresa(
                empresa
            );

            component.salvar();

            expect(serviceMock.cadastrar)
                .toHaveBeenCalledOnceWith({
                    idUsuario: 1,
                    idEmpresa: 2,
                    todasSubsidiarias: false
                });

            expect(serviceMock.atualizar)
                .not.toHaveBeenCalled();

            expect(toastrMock.success)
                .toHaveBeenCalled();

            expect(component.isLista)
                .toBeTrue();
        }
    );

    it(
        'não deve salvar cadastro inválido',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            component.botaoAdicionar();
            component.salvar();

            expect(serviceMock.cadastrar)
                .not.toHaveBeenCalled();

            expect(serviceMock.atualizar)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'não deve salvar sem permissão',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            component.botaoAdicionar();

            component.selecionarEmpresa(
                empresa
            );

            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(false);

            component.salvar();

            expect(serviceMock.cadastrar)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'deve abrir o formulário de edição',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .UsuarioEmpresaEditar
                );

            component.botaoEditar(3);

            expect(serviceMock.detalhar)
                .toHaveBeenCalledOnceWith(3);

            expect(component.isLista)
                .toBeFalse();

            expect(component.isFormulario)
                .toBeTrue();

            expect(component.isVisualizacao)
                .toBeFalse();

            expect(component.usuarioNome)
                .toBe(
                    'usuario@empresa.com'
                );

            expect(component.empresaNome)
                .toBe('Empresa Exemplo');

            expect(
                component.formulario
                    .getRawValue()
            ).toEqual({
                id: 3,
                todasSubsidiarias: false
            });

            expect(
                component.formulario
                    .contains('idUsuario')
            ).toBeFalse();

            expect(
                component.formulario
                    .contains('idEmpresa')
            ).toBeFalse();
        }
    );

    it(
        'deve atualizar somente o acesso às subsidiárias',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .UsuarioEmpresaEditar
                );

            component.botaoEditar(3);

            component.formulario
                .get('todasSubsidiarias')
                ?.setValue(true);

            component.salvar();

            expect(serviceMock.atualizar)
                .toHaveBeenCalledOnceWith({
                    id: 3,
                    todasSubsidiarias: true
                });

            expect(serviceMock.cadastrar)
                .not.toHaveBeenCalled();

            expect(toastrMock.success)
                .toHaveBeenCalled();

            expect(component.isLista)
                .toBeTrue();
        }
    );

    it(
        'deve abrir visualização somente leitura',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .UsuarioEmpresaDetalhar
                );

            component.botaoVisualizar(3);

            expect(serviceMock.detalhar)
                .toHaveBeenCalledOnceWith(3);

            expect(component.isVisualizacao)
                .toBeTrue();

            expect(component.formulario.disabled)
                .toBeTrue();

            expect(component.usuarioNome)
                .toBe(
                    'usuario@empresa.com'
                );

            expect(component.empresaNome)
                .toBe('Empresa Exemplo');
        }
    );

    it(
        'deve excluir e recarregar a lista',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .UsuarioEmpresaExcluir
                );

            serviceMock.listar.calls.reset();

            component.botaoExcluir(3);

            expect(serviceMock.excluir)
                .toHaveBeenCalledOnceWith(3);

            expect(serviceMock.listar)
                .toHaveBeenCalledOnceWith(
                    0,
                    10,
                    'id,desc',
                    1
                );

            expect(toastrMock.info)
                .toHaveBeenCalled();
        }
    );

    it(
        'não deve excluir sem permissão',
        () => {
            component.botaoExcluir(3);

            expect(serviceMock.excluir)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'deve cancelar e retornar à lista',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            component.botaoAdicionar();
            component.cancelar();

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();

            expect(component.isVisualizacao)
                .toBeFalse();

            expect(component.usuarioNome)
                .toBe('');

            expect(component.empresaNome)
                .toBe('');

            expect(component.empresas)
                .toEqual([]);
        }
    );

    it(
        'deve voltar para a lista de usuários',
        () => {
            component.voltar();

            expect(routerMock.navigate)
                .toHaveBeenCalledWith([
                    '/acesso/usuarios'
                ]);
        }
    );

    it(
        'deve informar erro ao carregar vínculos',
        () => {
            serviceMock.listar.and.returnValue(
                throwError(
                    () => new Error()
                )
            );

            component.carregarLista();

            expect(toastrMock.error)
                .toHaveBeenCalled();
        }
    );

    it(
        'deve informar erro ao pesquisar empresas',
        fakeAsync(() => {
            serviceMock
                .listarEmpresas
                .and.returnValue(
                    throwError(
                        () => new Error()
                    )
                );

            component
                .empresaPesquisaControl
                .setValue('Empresa');

            tick(300);

            expect(component.empresas)
                .toEqual([]);

            expect(toastrMock.error)
                .toHaveBeenCalled();
        })
    );

    it(
        'deve informar erro ao detalhar',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            serviceMock.detalhar.and.returnValue(
                throwError(
                    () => new Error()
                )
            );

            component.botaoEditar(3);

            expect(toastrMock.error)
                .toHaveBeenCalled();
        }
    );

    it(
        'deve informar erro ao cadastrar',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            serviceMock.cadastrar.and.returnValue(
                throwError(
                    () => new Error()
                )
            );

            component.botaoAdicionar();

            component.selecionarEmpresa(
                empresa
            );

            component.salvar();

            expect(toastrMock.error)
                .toHaveBeenCalled();
        }
    );

    it(
        'deve informar erro ao atualizar',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            serviceMock.atualizar.and.returnValue(
                throwError(
                    () => new Error()
                )
            );

            component.botaoEditar(3);
            component.salvar();

            expect(toastrMock.error)
                .toHaveBeenCalled();
        }
    );

    it(
        'deve informar erro ao excluir',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            serviceMock.excluir.and.returnValue(
                throwError(
                    () => new Error()
                )
            );

            component.botaoExcluir(3);

            expect(toastrMock.error)
                .toHaveBeenCalled();
        }
    );
});
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
    Estabelecimento
} from '@/interfaces/interfaces';

import {
    EstabelecimentoService
} from './services/estabelecimento.service';

import {
    EstabelecimentoComponent
} from './estabelecimento.component';

describe('EstabelecimentoComponent', () => {
    let component:
        EstabelecimentoComponent;

    let fixture:
        ComponentFixture<EstabelecimentoComponent>;

    let serviceMock:
        jasmine.SpyObj<EstabelecimentoService>;

    let organizacaoProntaSubject:
        BehaviorSubject<OrganizacaoDisponivel | null>;

    const autorizacaoServiceMock = {
        possuiPermissao: jasmine.createSpy(
            'possuiPermissao'
        )
    };

    const contextoOrganizacaoServiceMock = {
        retornarOrganizacaoProntaObservable:
            jasmine.createSpy(
                'retornarOrganizacaoProntaObservable'
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
        id: 1,
        nome: 'Empresa Exemplo',
        status: 'ATIVO'
    };

    const estabelecimento: Estabelecimento = {
        id: 10,
        idEmpresa: 1,
        empresa: 'Empresa Exemplo',
        nome: 'Estabelecimento Exemplo',
        status: 'ATIVO'
    };

    beforeEach(async () => {
        organizacaoProntaSubject =
            new BehaviorSubject<
                OrganizacaoDisponivel | null
            >({
                id: 1,
                nome: 'Organizacao Principal'
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
            jasmine.createSpyObj<EstabelecimentoService>(
                'EstabelecimentoService',
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
            of(estabelecimento)
        );

        serviceMock.atualizar.and.returnValue(
            of(estabelecimento)
        );

        serviceMock.detalhar.and.returnValue(
            of(estabelecimento)
        );

        serviceMock.excluir.and.returnValue(
            of(void 0)
        );

        await TestBed
            .configureTestingModule({
                declarations: [
                    EstabelecimentoComponent
                ],
                providers: [
                    FormBuilder,
                    {
                        provide:
                            EstabelecimentoService,
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
                            ToastrService,
                        useValue:
                            toastrMock
                    }
                ]
            })
            .overrideComponent(
                EstabelecimentoComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                EstabelecimentoComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it(
        'deve configurar pagina e colunas',
        () => {
            expect(component.pagina)
                .toBe('Estabelecimentos');

            expect(component.coluna)
                .toEqual([
                    'Codigo da empresa',
                    'Empresa',
                    'Nome',
                    'Status'
                ]);
        }
    );

    it(
        'deve carregar a lista ao inicializar',
        () => {
            expect(serviceMock.listar)
                .toHaveBeenCalledOnceWith(
                    0,
                    10,
                    'id,desc',
                    ''
                );
        }
    );

    it(
        'deve armazenar os dados da listagem',
        () => {
            serviceMock.listar.and.returnValue(
                of({
                    content: [
                        estabelecimento
                    ],
                    totalElements: 1
                })
            );

            component.carregarLista(
                2,
                20,
                'Exemplo'
            );

            expect(component.lista)
                .toEqual([
                    estabelecimento
                ]);

            expect(component.totalRegistros)
                .toBe(1);

            expect(component.paginaAtual)
                .toBe(2);

            expect(component.tamanhoPagina)
                .toBe(20);

            expect(component.filtro)
                .toBe('Exemplo');
        }
    );

    it(
        'deve pesquisar a partir da primeira pagina',
        () => {
            serviceMock.listar.calls.reset();

            component.tamanhoPagina = 20;

            component.pesquisar(
                'Matriz'
            );

            expect(serviceMock.listar)
                .toHaveBeenCalledOnceWith(
                    0,
                    20,
                    'id,desc',
                    'Matriz'
                );
        }
    );

    it(
        'deve alterar a paginacao',
        () => {
            serviceMock.listar.calls.reset();

            component.filtro =
                'Empresa';

            component.quantidadePorPagina({
                page: 3,
                size: 25
            });

            expect(serviceMock.listar)
                .toHaveBeenCalledOnceWith(
                    3,
                    25,
                    'id,desc',
                    'Empresa'
                );
        }
    );

    it(
        'deve controlar as acoes por permissao',
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
                                .EstabelecimentoCriar,
                            ChavePermissao
                                .EstabelecimentoExcluir,
                            ChavePermissao
                                .EstabelecimentoDetalhar
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
        'deve abrir o formulario de cadastro',
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
                idEmpresa: null,
                nome: ''
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
        'nao deve abrir cadastro sem permissao',
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
        'deve exigir empresa e nome no cadastro',
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
                    .get('nome')
                    ?.hasError('required')
            ).toBeTrue();

            expect(component.formulario.invalid)
                .toBeTrue();
        }
    );

    it(
        'deve limitar o nome a 100 caracteres',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            component.botaoAdicionar();

            component.formulario
                .get('nome')
                ?.setValue(
                    'A'.repeat(101)
                );

            expect(
                component.formulario
                    .get('nome')
                    ?.hasError('maxlength')
            ).toBeTrue();
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
            ).toBe(1);

            expect(component.empresaNome)
                .toBe('Empresa Exemplo');
        }
    );

    it(
        'deve exibir corretamente o nome da empresa',
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
        'deve pesquisar empresas apos a digitacao',
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
        'deve armazenar as empresas encontradas',
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
        'deve cadastrar enviando empresa e nome',
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
                            .EstabelecimentoCriar
                );

            component.botaoAdicionar();

            component.formulario.patchValue({
                idEmpresa: 1,
                nome: 'Estabelecimento Exemplo'
            });

            component.salvar();

            expect(serviceMock.cadastrar)
                .toHaveBeenCalledOnceWith({
                    idEmpresa: 1,
                    nome: 'Estabelecimento Exemplo'
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
        'nao deve salvar formulario invalido',
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
        'nao deve salvar sem permissao',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            component.botaoAdicionar();

            component.formulario.patchValue({
                idEmpresa: 1,
                nome: 'Estabelecimento Exemplo'
            });

            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(false);

            component.salvar();

            expect(serviceMock.cadastrar)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'deve abrir o formulario de edicao',
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
                            .EstabelecimentoEditar
                );

            component.botaoEditar(10);

            expect(serviceMock.detalhar)
                .toHaveBeenCalledOnceWith(10);

            expect(component.isLista)
                .toBeFalse();

            expect(component.isFormulario)
                .toBeTrue();

            expect(component.isVisualizacao)
                .toBeFalse();

            expect(component.empresaNome)
                .toBe('Empresa Exemplo');

            expect(
                component.formulario
                    .getRawValue()
            ).toEqual({
                id: 10,
                nome: 'Estabelecimento Exemplo'
            });

            expect(
                component.formulario
                    .contains('idEmpresa')
            ).toBeFalse();
        }
    );

    it(
        'deve atualizar enviando somente id e nome',
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
                            .EstabelecimentoEditar
                );

            component.botaoEditar(10);

            component.formulario
                .get('nome')
                ?.setValue(
                    'Estabelecimento Atualizado'
                );

            component.salvar();

            expect(serviceMock.atualizar)
                .toHaveBeenCalledOnceWith({
                    id: 10,
                    nome: 'Estabelecimento Atualizado'
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
        'deve abrir a visualizacao somente leitura',
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
                            .EstabelecimentoDetalhar
                );

            component.botaoVisualizar(10);

            expect(serviceMock.detalhar)
                .toHaveBeenCalledOnceWith(10);

            expect(component.isVisualizacao)
                .toBeTrue();

            expect(component.formulario.disabled)
                .toBeTrue();

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
                            .EstabelecimentoExcluir
                );

            serviceMock.listar.calls.reset();

            component.botaoExcluir(10);

            expect(serviceMock.excluir)
                .toHaveBeenCalledOnceWith(10);

            expect(serviceMock.listar)
                .toHaveBeenCalledOnceWith(
                    0,
                    10,
                    'id,desc',
                    ''
                );

            expect(toastrMock.info)
                .toHaveBeenCalled();
        }
    );

    it(
        'nao deve excluir sem permissao',
        () => {
            component.botaoExcluir(10);

            expect(serviceMock.excluir)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'deve cancelar e retornar para a lista',
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

            expect(component.empresaNome)
                .toBe('');

            expect(component.empresas)
                .toEqual([]);
        }
    );

    it(
        'deve recarregar dados ao trocar a organizacao pronta',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            component.botaoAdicionar();

            component.lista = [
                estabelecimento
            ];

            component.empresas = [
                empresa
            ];

            component.totalRegistros = 1;
            component.paginaAtual = 2;
            component.filtro = 'Filial';

            serviceMock.listar.calls.reset();

            organizacaoProntaSubject.next({
                id: 2,
                nome: 'Organizacao Filial'
            });

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

            expect(component.filtro)
                .toBe('');

            expect(serviceMock.listar)
                .toHaveBeenCalledOnceWith(
                    0,
                    10,
                    'id,desc',
                    ''
                );
        }
    );

    it(
        'deve limpar dados quando nao houver organizacao pronta',
        () => {
            component.lista = [
                estabelecimento
            ];

            component.empresas = [
                empresa
            ];

            component.totalRegistros = 1;
            component.paginaAtual = 2;
            component.filtro = 'Filial';

            serviceMock.listar.calls.reset();

            organizacaoProntaSubject.next(null);

            expect(component.lista)
                .toEqual([]);

            expect(component.empresas)
                .toEqual([]);

            expect(component.totalRegistros)
                .toBe(0);

            expect(component.paginaAtual)
                .toBe(0);

            expect(component.filtro)
                .toBe('');

            expect(serviceMock.listar)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'deve informar erro ao carregar a lista',
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

            component.botaoEditar(10);

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

            component.formulario.patchValue({
                idEmpresa: 1,
                nome: 'Estabelecimento Exemplo'
            });

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

            component.botaoEditar(10);
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

            component.botaoExcluir(10);

            expect(toastrMock.error)
                .toHaveBeenCalled();
        }
    );
});
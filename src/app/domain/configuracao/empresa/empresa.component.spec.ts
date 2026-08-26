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
    BehaviorSubject,
    of
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
    BaseService
} from '@services/base/base.service';

import {
    EmpresaComponent
} from './empresa.component';

describe('EmpresaComponent', () => {
    let component:
        EmpresaComponent;

    let fixture:
        ComponentFixture<EmpresaComponent>;

    let baseServiceMock:
        jasmine.SpyObj<BaseService>;

    let organizacaoAtivaSubject:
        BehaviorSubject<OrganizacaoDisponivel | null>;

    const contextoOrganizacaoServiceMock = {
        retornarOrganizacaoAtivaObservable:
            jasmine.createSpy(
                'retornarOrganizacaoAtivaObservable'
            )
    };

    const autorizacaoServiceMock = {
        possuiPermissao: jasmine.createSpy(
            'possuiPermissao'
        )
    };

    const routerMock = {
        navigate: jasmine.createSpy(
            'navigate'
        ),
        routeReuseStrategy: {
            shouldReuseRoute:
                jasmine.createSpy(
                    'shouldReuseRoute'
                )
        },
        onSameUrlNavigation: 'ignore'
    };

    const activatedRouteMock = {
        snapshot: {
            paramMap: {
                get: jasmine
                    .createSpy('get')
                    .and.returnValue(null)
            }
        }
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

    beforeEach(async () => {
        organizacaoAtivaSubject =
            new BehaviorSubject<
                OrganizacaoDisponivel | null
            >({
                id: 1,
                nome: 'Organização 1'
            });

        contextoOrganizacaoServiceMock
            .retornarOrganizacaoAtivaObservable
            .calls
            .reset();

        contextoOrganizacaoServiceMock
            .retornarOrganizacaoAtivaObservable
            .and.returnValue(
                organizacaoAtivaSubject
                    .asObservable()
            );

        autorizacaoServiceMock
            .possuiPermissao
            .calls
            .reset();

        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(false);

        baseServiceMock =
            jasmine.createSpyObj<BaseService>(
                'BaseService',
                [
                    'listar',
                    'detalhar',
                    'salvar',
                    'inativar'
                ]
            );

        baseServiceMock
            .listar
            .and.returnValue(
                of({
                    content: [],
                    totalElements: 0
                }) as never
            );

        await TestBed
            .configureTestingModule({
                declarations: [
                    EmpresaComponent
                ],
                providers: [
                    FormBuilder,
                    {
                        provide: BaseService,
                        useValue:
                            baseServiceMock
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
                        provide: Router,
                        useValue:
                            routerMock
                    },
                    {
                        provide: ActivatedRoute,
                        useValue:
                            activatedRouteMock
                    },
                    {
                        provide: ToastrService,
                        useValue:
                            toastrMock
                    }
                ]
            })
            .overrideComponent(
                EmpresaComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                EmpresaComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it(
        'deve configurar endpoint e colunas',
        () => {
            expect(component.endPoint)
                .toBe(
                    'configuracao/empresa'
                );

            expect(component.pagina)
                .toBe('Empresas');

            expect(component.coluna)
                .toEqual([
                    'Nome',
                    'Status'
                ]);
        }
    );

    it(
        'deve criar formulário de cadastro',
        () => {
            const formulario =
                component.campos();

            expect(
                formulario.contains('id')
            ).toBeFalse();

            expect(
                formulario.getRawValue()
            ).toEqual({
                nome: ''
            });

            expect(
                formulario
                    .get('nome')
                    ?.hasError('required')
            ).toBeTrue();
        }
    );

    it(
        'deve limitar o nome a 100 caracteres',
        () => {
            const formulario =
                component.campos();

            formulario
                .get('nome')
                ?.setValue(
                    'A'.repeat(101)
                );

            expect(
                formulario
                    .get('nome')
                    ?.hasError('maxlength')
            ).toBeTrue();
        }
    );

    it(
        'deve criar formulário de edição',
        () => {
            const formulario =
                component.campos({
                    id: 1,
                    nome: 'Empresa Exemplo',
                    status: 'ATIVO'
                });

            expect(
                formulario.getRawValue()
            ).toEqual({
                id: 1,
                nome: 'Empresa Exemplo'
            });
        }
    );

    it(
        'deve carregar a lista ao inicializar',
        () => {
            expect(baseServiceMock.listar)
                .toHaveBeenCalledWith(
                    'configuracao/empresa',
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    NaN
                );
        }
    );

    it(
        'deve recarregar dados ao trocar a organização ativa',
        () => {
            baseServiceMock
                .listar
                .calls
                .reset();

            component.formulario =
                component.campos({
                    id: 1,
                    nome: 'Empresa Exemplo',
                    status: 'ATIVO'
                });

            component.lista = [
                {
                    id: 1,
                    nome: 'Empresa Exemplo',
                    status: 'ATIVO'
                }
            ];

            component.totalRegistros = 1;
            component.isLista = false;
            component.isFormulario = true;
            component.isVisualizacao = true;

            organizacaoAtivaSubject.next({
                id: 2,
                nome: 'Organização 2'
            });

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();

            expect(component.isVisualizacao)
                .toBeFalse();

            expect(component.lista)
                .toEqual([]);

            expect(component.totalRegistros)
                .toBe(0);

            expect(baseServiceMock.listar)
                .toHaveBeenCalledOnceWith(
                    'configuracao/empresa',
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    NaN
                );
        }
    );

    it(
        'deve limpar dados quando não houver organização ativa',
        () => {
            baseServiceMock
                .listar
                .calls
                .reset();

            component.formulario =
                component.campos({
                    id: 1,
                    nome: 'Empresa Exemplo',
                    status: 'ATIVO'
                });

            component.lista = [
                {
                    id: 1,
                    nome: 'Empresa Exemplo',
                    status: 'ATIVO'
                }
            ];

            component.totalRegistros = 1;
            component.isLista = false;
            component.isFormulario = true;
            component.isVisualizacao = true;

            organizacaoAtivaSubject.next(null);

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();

            expect(component.isVisualizacao)
                .toBeFalse();

            expect(component.lista)
                .toEqual([]);

            expect(component.totalRegistros)
                .toBe(0);

            expect(baseServiceMock.listar)
                .not
                .toHaveBeenCalled();
        }
    );

    it(
        'deve abrir detalhamento somente leitura',
        () => {
            baseServiceMock
                .detalhar
                .and.returnValue(
                    of({
                        id: 1,
                        nome: 'Empresa Exemplo',
                        status: 'ATIVO'
                    }) as never
                );

            component.botaoVisualizar(1);

            expect(baseServiceMock.detalhar)
                .toHaveBeenCalledOnceWith(
                    'configuracao/empresa',
                    1
                );

            expect(component.isVisualizacao)
                .toBeTrue();

            expect(component.isLista)
                .toBeFalse();

            expect(component.isFormulario)
                .toBeTrue();

            expect(component.formulario.disabled)
                .toBeTrue();

            expect(
                component.formulario
                    .getRawValue()
            ).toEqual({
                id: 1,
                nome: 'Empresa Exemplo'
            });
        }
    );

    it(
        'deve exigir a permissão correspondente para salvar',
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
                            .EmpresaCriar
                );

            component.formulario =
                component.campos();

            expect(component.podeSalvar)
                .toBeTrue();

            component.formulario =
                component.campos({
                    id: 1,
                    nome: 'Empresa Exemplo',
                    status: 'ATIVO'
                });

            expect(component.podeSalvar)
                .toBeFalse();

            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .EmpresaEditar
                );

            expect(component.podeSalvar)
                .toBeTrue();
        }
    );

    it(
        'deve controlar ações por permissão',
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
                                .EmpresaCriar,
                            ChavePermissao
                                .EmpresaExcluir,
                            ChavePermissao
                                .EmpresaDetalhar
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
});
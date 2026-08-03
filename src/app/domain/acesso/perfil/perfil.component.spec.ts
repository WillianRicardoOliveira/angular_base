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
    of
} from 'rxjs';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    BaseService
} from '@services/base/base.service';

import {
    PerfilComponent
} from './perfil.component';

describe('PerfilComponent', () => {
    let component:
        PerfilComponent;

    let fixture:
        ComponentFixture<PerfilComponent>;

    let baseServiceMock:
        jasmine.SpyObj<BaseService>;

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
                    PerfilComponent
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
                PerfilComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                PerfilComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it(
        'deve configurar o endpoint e as colunas',
        () => {
            expect(
                component.endPoint
            ).toBe('perfil');

            expect(
                component.pagina
            ).toBe('Perfis');

            expect(
                component.coluna
            ).toEqual([
                'Nome',
                'Descrição',
                'Status'
            ]);
        }
    );

    it(
        'deve criar formulário de cadastro sem identificador',
        () => {
            const formulario =
                component.campos();

            expect(
                formulario.contains('id')
            ).toBeFalse();

            expect(
                formulario.getRawValue()
            ).toEqual({
                nome: '',
                descricao: ''
            });

            expect(
                formulario.get('nome')
                    ?.hasError('required')
            ).toBeTrue();

            expect(
                formulario.get('descricao')
                    ?.valid
            ).toBeTrue();
        }
    );

    it(
        'deve criar formulário de edição com identificador',
        () => {
            const formulario =
                component.campos({
                    id: 10,
                    nome: 'Administrador',
                    descricao:
                        'Acesso administrativo',
                    status: 'ATIVO'
                });

            expect(
                formulario.getRawValue()
            ).toEqual({
                id: 10,
                nome: 'Administrador',
                descricao:
                    'Acesso administrativo'
            });
        }
    );

    it(
        'deve carregar a lista ao inicializar',
        () => {
            expect(
                baseServiceMock.listar
            ).toHaveBeenCalledWith(
                'perfil',
                undefined,
                undefined,
                undefined,
                undefined,
                NaN
            );
        }
    );

    it(
        'deve abrir o detalhamento em modo somente leitura',
        () => {
            baseServiceMock
                .detalhar
                .and.returnValue(
                    of({
                        id: 10,
                        nome: 'Administrador',
                        descricao:
                            'Acesso administrativo',
                        status: 'ATIVO'
                    }) as never
                );

            component.botaoVisualizar(10);

            expect(
                baseServiceMock.detalhar
            ).toHaveBeenCalledOnceWith(
                'perfil',
                10
            );

            expect(
                component.isVisualizacao
            ).toBeTrue();

            expect(
                component.isLista
            ).toBeFalse();

            expect(
                component.isFormulario
            ).toBeTrue();

            expect(
                component.formulario.disabled
            ).toBeTrue();

            expect(
                component.formulario
                    .getRawValue()
            ).toEqual({
                id: 10,
                nome: 'Administrador',
                descricao:
                    'Acesso administrativo'
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
                            .PerfilCriar
                );

            component.formulario =
                component.campos();

            expect(
                component.podeSalvar
            ).toBeTrue();

            component.formulario =
                component.campos({
                    id: 10,
                    nome: 'Administrador',
                    descricao: '',
                    status: 'ATIVO'
                });

            expect(
                component.podeSalvar
            ).toBeFalse();

            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .PerfilEditar
                );

            expect(
                component.podeSalvar
            ).toBeTrue();
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
                                .PerfilCriar,
                            ChavePermissao
                                .PerfilExcluir,
                            ChavePermissao
                                .PerfilDetalhar
                        ].includes(
                            permissao
                        )
                );

            expect(
                component.podeCriar
            ).toBeTrue();

            expect(
                component.podeEditar
            ).toBeFalse();

            expect(
                component.podeExcluir
            ).toBeTrue();

            expect(
                component.podeDetalhar
            ).toBeTrue();

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.PerfilCriar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.PerfilEditar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.PerfilExcluir
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao.PerfilDetalhar
            );
        }
    );
});
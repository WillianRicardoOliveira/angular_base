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
    PermissaoComponent
} from './permissao.component';

describe('PermissaoComponent', () => {

    let component:
        PermissaoComponent;

    let fixture:
        ComponentFixture<
            PermissaoComponent
        >;

    let baseServiceMock:
        jasmine.SpyObj<
            BaseService
        >;

    let organizacaoProntaSubject:
        BehaviorSubject<
            OrganizacaoDisponivel | null
        >;

    const contextoOrganizacaoServiceMock = {
        retornarOrganizacaoProntaObservable:
            jasmine.createSpy(
                'retornarOrganizacaoProntaObservable'
            )
    };

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
            ),
        routeReuseStrategy: {
            shouldReuseRoute:
                jasmine.createSpy(
                    'shouldReuseRoute'
                )
        },
        onSameUrlNavigation:
            'ignore'
    };

    const activatedRouteMock = {
        snapshot: {
            paramMap: {
                get:
                    jasmine
                        .createSpy('get')
                        .and
                        .returnValue(null)
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

    beforeEach(async () => {
        organizacaoProntaSubject =
            new BehaviorSubject<
                OrganizacaoDisponivel | null
            >({
                id: 1,
                nome:
                    'Organização 1'
            });

        contextoOrganizacaoServiceMock
            .retornarOrganizacaoProntaObservable
            .calls
            .reset();

        contextoOrganizacaoServiceMock
            .retornarOrganizacaoProntaObservable
            .and
            .returnValue(
                organizacaoProntaSubject
                    .asObservable()
            );

        autorizacaoServiceMock
            .possuiPermissao
            .calls
            .reset();

        autorizacaoServiceMock
            .possuiPermissao
            .and
            .returnValue(false);

        baseServiceMock =
            jasmine.createSpyObj<
                BaseService
            >(
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
            .and
            .returnValue(
                of({
                    content: [],
                    totalElements: 0
                }) as never
            );

        await TestBed
            .configureTestingModule({
                declarations: [
                    PermissaoComponent
                ],
                providers: [
                    FormBuilder,
                    {
                        provide:
                            BaseService,
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
                        provide:
                            Router,
                        useValue:
                            routerMock
                    },
                    {
                        provide:
                            ActivatedRoute,
                        useValue:
                            activatedRouteMock
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
                PermissaoComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                PermissaoComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it(
        'deve ser criado',
        () => {

            expect(component)
                .toBeTruthy();
        }
    );

    it(
        'deve configurar o endpoint e as colunas',
        () => {

            expect(
                component.endPoint
            ).toBe('permissao');

            expect(
                component.pagina
            ).toBe('Permissões');

            expect(
                component.coluna
            ).toEqual([
                'Nome',
                'Chave',
                'Descrição',
                'Status'
            ]);
        }
    );

    it(
        'deve criar formulário de consulta',
        () => {

            const formulario =
                component.campos();

            expect(
                formulario.getRawValue()
            ).toEqual({
                id: null,
                nome: '',
                chave: '',
                descricao: ''
            });

            expect(
                formulario
                    .get('nome')
                    ?.hasError('required')
            ).toBeTrue();

            expect(
                formulario
                    .get('chave')
                    ?.hasError('required')
            ).toBeTrue();

            expect(
                formulario
                    .get('descricao')
                    ?.valid
            ).toBeTrue();
        }
    );

    it(
        'deve criar formulário de detalhe com identificador',
        () => {

            const formulario =
                component.campos({
                    id: 10,
                    nome:
                        'Listar usuários',
                    chave:
                        'ACESSO_USUARIO_LISTAR',
                    descricao:
                        'Permite listar usuários',
                    status:
                        'ATIVO'
                });

            expect(
                formulario.getRawValue()
            ).toEqual({
                id: 10,
                nome:
                    'Listar usuários',
                chave:
                    'ACESSO_USUARIO_LISTAR',
                descricao:
                    'Permite listar usuários'
            });
        }
    );

    it(
        'deve carregar a lista ao inicializar',
        () => {

            expect(
                contextoOrganizacaoServiceMock
                    .retornarOrganizacaoProntaObservable
            ).toHaveBeenCalledTimes(1);

            expect(
                baseServiceMock.listar
            ).toHaveBeenCalledWith(
                'permissao',
                undefined,
                undefined,
                undefined,
                undefined,
                NaN
            );
        }
    );

    it(
        'deve aguardar a nova organização ficar pronta antes de recarregar',
        () => {

            baseServiceMock
                .listar
                .calls
                .reset();

            component.formulario =
                component.campos({
                    id: 10,
                    nome:
                        'Listar usuários',
                    chave:
                        'ACESSO_USUARIO_LISTAR',
                    descricao:
                        'Permite listar usuários',
                    status:
                        'ATIVO'
                });

            component.lista = [
                {
                    id: 10,
                    nome:
                        'Listar usuários',
                    chave:
                        'ACESSO_USUARIO_LISTAR',
                    descricao:
                        'Permite listar usuários',
                    status:
                        'ATIVO'
                }
            ];

            component.totalRegistros = 1;
            component.isLista = false;
            component.isFormulario = true;
            component.isVisualizacao = true;

            organizacaoProntaSubject.next(
                null
            );

            expect(
                baseServiceMock.listar
            ).not.toHaveBeenCalled();

            expect(
                component.lista
            ).toEqual([]);

            expect(
                component.totalRegistros
            ).toBe(0);

            organizacaoProntaSubject.next({
                id: 2,
                nome:
                    'Organização 2'
            });

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
                component.lista
            ).toEqual([]);

            expect(
                component.totalRegistros
            ).toBe(0);

            expect(
                baseServiceMock.listar
            ).toHaveBeenCalledOnceWith(
                'permissao',
                undefined,
                undefined,
                undefined,
                undefined,
                NaN
            );
        }
    );

    it(
        'deve limpar dados quando não houver organização pronta',
        () => {

            baseServiceMock
                .listar
                .calls
                .reset();

            component.formulario =
                component.campos({
                    id: 10,
                    nome:
                        'Listar usuários',
                    chave:
                        'ACESSO_USUARIO_LISTAR',
                    descricao:
                        'Permite listar usuários',
                    status:
                        'ATIVO'
                });

            component.lista = [
                {
                    id: 10,
                    nome:
                        'Listar usuários',
                    chave:
                        'ACESSO_USUARIO_LISTAR',
                    descricao:
                        'Permite listar usuários',
                    status:
                        'ATIVO'
                }
            ];

            component.totalRegistros = 1;
            component.isLista = false;
            component.isFormulario = true;
            component.isVisualizacao = true;

            organizacaoProntaSubject.next(
                null
            );

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
                component.lista
            ).toEqual([]);

            expect(
                component.totalRegistros
            ).toBe(0);

            expect(
                baseServiceMock.listar
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve abrir o detalhamento em modo somente leitura',
        () => {

            baseServiceMock
                .detalhar
                .and
                .returnValue(
                    of({
                        id: 10,
                        nome:
                            'Listar usuários',
                        chave:
                            'ACESSO_USUARIO_LISTAR',
                        descricao:
                            'Permite listar usuários',
                        status:
                            'ATIVO'
                    }) as never
                );

            component.botaoVisualizar(10);

            expect(
                baseServiceMock.detalhar
            ).toHaveBeenCalledOnceWith(
                'permissao',
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
                nome:
                    'Listar usuários',
                chave:
                    'ACESSO_USUARIO_LISTAR',
                descricao:
                    'Permite listar usuários'
            });
        }
    );

    it(
        'não deve permitir cadastro, edição, exclusão ou salvamento',
        () => {

            autorizacaoServiceMock
                .possuiPermissao
                .and
                .returnValue(true);

            expect(
                component.podeCriar
            ).toBeFalse();

            expect(
                component.podeEditar
            ).toBeFalse();

            expect(
                component.podeExcluir
            ).toBeFalse();

            expect(
                component.podeSalvar
            ).toBeFalse();

            component.botaoAdicionar();
            component.botaoEditar(10);
            component.botaoExcluir(10);
            component.salvar();

            expect(
                baseServiceMock.salvar
            ).not.toHaveBeenCalled();

            expect(
                baseServiceMock.inativar
            ).not.toHaveBeenCalled();

            expect(
                baseServiceMock.detalhar
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve exigir permissão somente para detalhar',
        () => {

            autorizacaoServiceMock
                .possuiPermissao
                .and
                .callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .PermissaoDetalhar
                );

            expect(
                component.podeDetalhar
            ).toBeTrue();

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledOnceWith(
                ChavePermissao
                    .PermissaoDetalhar
            );
        }
    );
});
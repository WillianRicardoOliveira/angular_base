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
    UsuarioComponent
} from './usuario.component';

describe('UsuarioComponent', () => {
    let component:
        UsuarioComponent;

    let fixture:
        ComponentFixture<UsuarioComponent>;

    let baseServiceMock:
        jasmine.SpyObj<BaseService>;

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
                    UsuarioComponent
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
                        provide: Router,
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
                UsuarioComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                UsuarioComponent
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
        'deve configurar o endpoint e as colunas de usuário',
        () => {
            expect(
                component.endPoint
            ).toBe('usuario');

            expect(
                component.pagina
            ).toBe('Usuários');

            expect(
                component.coluna
            ).toEqual([
                'E-mail',
                'Status'
            ]);
        }
    );

    it(
        'deve criar formulário de cadastro com e-mail e senha',
        () => {
            const formulario =
                component.campos();

            expect(
                formulario.contains('id')
            ).toBeFalse();

            expect(
                formulario.contains('email')
            ).toBeTrue();

            expect(
                formulario.contains('senha')
            ).toBeTrue();

            expect(
                formulario
                    .get('email')
                    ?.hasError('required')
            ).toBeTrue();

            expect(
                formulario
                    .get('senha')
                    ?.hasError('required')
            ).toBeTrue();
        }
    );

    it(
        'deve exigir uma senha forte no cadastro',
        () => {
            const formulario =
                component.campos();

            const senha =
                formulario.get('senha');

            senha?.setValue(
                'senhafraca'
            );

            expect(
                senha?.hasError('pattern')
            ).toBeTrue();

            senha?.setValue(
                'Senha@123'
            );

            expect(
                senha?.valid
            ).toBeTrue();
        }
    );

    it(
        'deve criar formulário de visualização sem senha',
        () => {
            const formulario =
                component.campos({
                    id: 10,
                    email:
                        'usuario@teste.com',
                    status: 'ATIVO'
                });

            expect(
                formulario.value
            ).toEqual({
                id: 10,
                email:
                    'usuario@teste.com'
            });

            expect(
                formulario
                    .contains('senha')
            ).toBeFalse();
        }
    );

    it(
        'deve carregar a lista ao inicializar',
        () => {
            expect(
                baseServiceMock.listar
            ).toHaveBeenCalledWith(
                'usuario',
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
                        email:
                            'usuario@teste.com',
                        status: 'ATIVO'
                    }) as never
                );

            component
                .botaoVisualizar(10);

            expect(
                baseServiceMock.detalhar
            ).toHaveBeenCalledOnceWith(
                'usuario',
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
                component.formulario
                    .disabled
            ).toBeTrue();

            expect(
                component.formulario
                    .getRawValue()
            ).toEqual({
                id: 10,
                email:
                    'usuario@teste.com'
            });

            expect(
                component.formulario
                    .contains('senha')
            ).toBeFalse();
        }
    );

    it(
        'deve permitir salvar somente um novo usuário autorizado',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioCriar
            );

            component.formulario =
                component.campos();

            expect(
                component.podeSalvar
            ).toBeTrue();

            component.formulario =
                component.campos({
                    id: 10,
                    email:
                        'usuario@teste.com',
                    status: 'ATIVO'
                });

            expect(
                component.podeSalvar
            ).toBeFalse();
        }
    );

    it(
        'deve controlar as ações conforme as permissões do usuário',
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
                                .UsuarioCriar,
                            ChavePermissao
                                .UsuarioExcluir,
                            ChavePermissao
                                .UsuarioDetalhar
                        ].includes(
                            permissao
                        )
                );

            expect(
                component.podeCriar
            ).toBeTrue();

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
                ChavePermissao
                    .UsuarioCriar
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao
                    .UsuarioExcluir
            );

            expect(
                autorizacaoServiceMock
                    .possuiPermissao
            ).toHaveBeenCalledWith(
                ChavePermissao
                    .UsuarioDetalhar
            );
        }
    );

    it(
        'deve abrir os perfis do usuário quando autorizado',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioPerfilListar
            );

            expect(
                component
                    .podeGerenciarPerfis
            ).toBeTrue();

            component.botaoPerfis(10);

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith([
                '/acesso/usuarios',
                10,
                'perfis'
            ]);
        }
    );

    it(
        'não deve abrir os perfis do usuário sem permissão',
        () => {
            expect(
                component
                    .podeGerenciarPerfis
            ).toBeFalse();

            component.botaoPerfis(10);

            expect(
                routerMock.navigate
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve disponibilizar as ações permitidas',
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
                                .UsuarioPerfilListar,
                            ChavePermissao
                                .UsuarioEmpresaListar
                        ].includes(
                            permissao
                        )
                );

            expect(component.acoesExtras)
                .toEqual([
                    {
                        chave: 'perfis',
                        icone:
                            'manage_accounts',
                        tooltip:
                            'Gerenciar perfis'
                    },
                    {
                        chave: 'empresas',
                        icone: 'business',
                        tooltip:
                            'Gerenciar empresas'
                    }
                ]);
        }
    );

    it(
        'deve ocultar ações sem permissão',
        () => {
            expect(component.acoesExtras)
                .toEqual([]);
        }
    );

    it(
        'deve disponibilizar somente a ação de empresas',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioEmpresaListar
            );

            expect(component.acoesExtras)
                .toEqual([
                    {
                        chave: 'empresas',
                        icone: 'business',
                        tooltip:
                            'Gerenciar empresas'
                    }
                ]);
        }
    );

    it(
        'deve abrir as empresas do usuário quando autorizado',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioEmpresaListar
            );

            expect(
                component
                    .podeGerenciarEmpresas
            ).toBeTrue();

            component.botaoEmpresas(10);

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith([
                '/acesso/usuarios',
                10,
                'empresas'
            ]);
        }
    );

    it(
        'não deve abrir as empresas do usuário sem permissão',
        () => {
            expect(
                component
                    .podeGerenciarEmpresas
            ).toBeFalse();

            component.botaoEmpresas(10);

            expect(
                routerMock.navigate
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve tratar a ação extra de perfis',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioPerfilListar
            );

            component.botaoAcaoExtra({
                chave: 'perfis',
                id: 10
            });

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith([
                '/acesso/usuarios',
                10,
                'perfis'
            ]);
        }
    );

    it(
        'deve tratar a ação extra de empresas',
        () => {
            autorizar(
                ChavePermissao
                    .UsuarioEmpresaListar
            );

            component.botaoAcaoExtra({
                chave: 'empresas',
                id: 10
            });

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith([
                '/acesso/usuarios',
                10,
                'empresas'
            ]);
        }
    );

    it(
        'não deve navegar para uma ação desconhecida',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            component.botaoAcaoExtra({
                chave: 'desconhecida',
                id: 10
            });

            expect(
                routerMock.navigate
            ).not.toHaveBeenCalled();
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
import {
    NO_ERRORS_SCHEMA
} from '@angular/core';

import {
    ComponentFixture,
    TestBed,
    waitForAsync
} from '@angular/core/testing';

import {
    Router
} from '@angular/router';

import {
    Store
} from '@ngrx/store';

import {
    BehaviorSubject,
    of
} from 'rxjs';

import {
    MenuItem
} from '@/components/menu-item/models/menu-item.model';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

import {
    ContextoConfiguracaoInicial,
    EstadoConfiguracaoInicial,
    ProximaEtapaConfiguracao
} from '@/domain/configuracao/configuracao-inicial/models/estado-configuracao-inicial.model';

import {
    ConfiguracaoInicialService
} from '@/domain/configuracao/configuracao-inicial/services/configuracao-inicial.service';

import {
    MENU,
    MenuSidebarComponent
} from './menu-sidebar.component';

interface OrganizacaoTeste {
    id: number;
    nome: string;
}

describe('MenuSidebarComponent', () => {

    const estadoCompleto:
        EstadoConfiguracaoInicial = {
            empresaCadastrada:
                true,
            proximaEtapa:
                null
        };

    const estadoPendente:
        EstadoConfiguracaoInicial = {
            empresaCadastrada:
                false,
            proximaEtapa:
                ProximaEtapaConfiguracao
                    .Empresa
        };

    let component:
        MenuSidebarComponent;

    let fixture:
        ComponentFixture<
            MenuSidebarComponent
        >;

    let estadoAutorizacaoSubject:
        BehaviorSubject<{
            carregado: boolean;
            permissoes:
                ReadonlySet<ChavePermissao>;
        }>;

    let organizacaoProntaSubject:
        BehaviorSubject<
            OrganizacaoTeste | null
        >;

    let configuracaoSubject:
        BehaviorSubject<
            ContextoConfiguracaoInicial
        >;

    let estadoRetornado:
        EstadoConfiguracaoInicial;

    const storeMock = {
        select:
            jasmine.createSpy(
                'select'
            )
    };

    const routerMock = {
        url:
            '/dashboard',
        events:
            of()
    };

    const autorizacaoServiceMock = {
        possuiPermissao:
            jasmine.createSpy(
                'possuiPermissao'
            ),
        retornarEstado:
            jasmine.createSpy(
                'retornarEstado'
            )
    };

    const contextoOrganizacaoServiceMock = {
        retornarOrganizacaoProntaObservable:
            jasmine.createSpy(
                'retornarOrganizacaoProntaObservable'
            )
    };

    const configuracaoInicialServiceMock = {
        consultar:
            jasmine.createSpy(
                'consultar'
            ),
        retornarContextoObservable:
            jasmine.createSpy(
                'retornarContextoObservable'
            ),
        limparEstado:
            jasmine.createSpy(
                'limparEstado'
            )
    };

    beforeEach(
        waitForAsync(() => {
            estadoRetornado =
                estadoCompleto;

            estadoAutorizacaoSubject =
                new BehaviorSubject({
                    carregado: true,
                    permissoes:
                        new Set<
                            ChavePermissao
                        >()
                });

            organizacaoProntaSubject =
                new BehaviorSubject<
                    OrganizacaoTeste | null
                >({
                    id: 1,
                    nome:
                        'Organização Principal'
                });

            configuracaoSubject =
                new BehaviorSubject<
                    ContextoConfiguracaoInicial
                >({
                    idOrganizacao:
                        null,
                    carregando:
                        false,
                    erro:
                        false,
                    estado:
                        null
                });

            storeMock.select
                .calls
                .reset();

            storeMock.select
                .and
                .returnValue(
                    of({
                        sidebarSkin:
                            'sidebar-dark-primary',
                        menuSidebarCollapsed:
                            false
                    })
                );

            autorizacaoServiceMock
                .possuiPermissao
                .calls
                .reset();

            autorizacaoServiceMock
                .possuiPermissao
                .and
                .returnValue(false);

            autorizacaoServiceMock
                .retornarEstado
                .calls
                .reset();

            autorizacaoServiceMock
                .retornarEstado
                .and
                .returnValue(
                    estadoAutorizacaoSubject
                        .asObservable()
                );

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

            configuracaoInicialServiceMock
                .retornarContextoObservable
                .calls
                .reset();

            configuracaoInicialServiceMock
                .retornarContextoObservable
                .and
                .returnValue(
                    configuracaoSubject
                        .asObservable()
                );

            configuracaoInicialServiceMock
                .limparEstado
                .calls
                .reset();

            configuracaoInicialServiceMock
                .limparEstado
                .and
                .callFake(() => {
                    configuracaoSubject.next({
                        idOrganizacao:
                            null,
                        carregando:
                            false,
                        erro:
                            false,
                        estado:
                            null
                    });
                });

            configuracaoInicialServiceMock
                .consultar
                .calls
                .reset();

            configuracaoInicialServiceMock
                .consultar
                .and
                .callFake(() => {
                    const idOrganizacao =
                        organizacaoProntaSubject
                            .value
                            ?.id ?? null;

                    configuracaoSubject.next({
                        idOrganizacao,
                        carregando:
                            false,
                        erro:
                            false,
                        estado:
                            estadoRetornado
                    });

                    return of(
                        estadoRetornado
                    );
                });

            TestBed
                .configureTestingModule({
                    declarations: [
                        MenuSidebarComponent
                    ],
                    providers: [
                        {
                            provide:
                                Store,
                            useValue:
                                storeMock
                        },
                        {
                            provide:
                                Router,
                            useValue:
                                routerMock
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
                                ConfiguracaoInicialService,
                            useValue:
                                configuracaoInicialServiceMock
                        }
                    ],
                    schemas: [
                        NO_ERRORS_SCHEMA
                    ]
                })
                .compileComponents();
        })
    );

    beforeEach(() => {
        fixture =
            TestBed.createComponent(
                MenuSidebarComponent
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
        'deve aplicar o tema do menu lateral',
        () => {

            expect(
                component.classes
            ).toBe(
                'main-sidebar elevation-4 ' +
                'sidebar-no-expand ' +
                'sidebar-dark-primary'
            );
        }
    );

    it(
        'deve carregar a configuracao da organizacao ativa',
        () => {

            expect(
                contextoOrganizacaoServiceMock
                    .retornarOrganizacaoProntaObservable
            ).toHaveBeenCalledTimes(1);

            expect(
                configuracaoInicialServiceMock
                    .retornarContextoObservable
            ).toHaveBeenCalledTimes(1);

            expect(
                configuracaoInicialServiceMock
                    .limparEstado
            ).not.toHaveBeenCalled();

            expect(
                configuracaoInicialServiceMock
                    .consultar
            ).toHaveBeenCalledTimes(1);
        }
    );

    it(
        'deve iniciar com menus dependentes ocultos enquanto carrega',
        () => {

            configuracaoSubject.next({
                idOrganizacao: 1,
                carregando: true,
                erro: false,
                estado: null
            });

            expect(
                component
                    .configuracaoInicialCarregando
            ).toBeTrue();

            expect(
                component
                    .configuracaoInicialPendente
            ).toBeTrue();

            expect(component.menu)
                .toEqual([]);
        }
    );

    it(
        'deve manter menus dependentes ocultos quando ocorrer erro',
        () => {

            autorizarTodasAsPermissoes();

            configuracaoSubject.next({
                idOrganizacao: 1,
                carregando: false,
                erro: true,
                estado: null
            });

            expect(
                component
                    .erroConfiguracaoInicial
            ).toBeTrue();

            expect(
                component
                    .configuracaoInicialPendente
            ).toBeTrue();

            expect(component.menu)
                .toEqual([]);
        }
    );

    it(
        'deve remover menus sem permissao',
        () => {

            expect(
                component.menu
            ).toEqual(
                MENU
            );

            expect(
                component
                    .menuConfiguracoes
            ).toEqual([]);
        }
    );

    it(
        'deve reconstruir menus quando a autorizacao mudar',
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
                            .UsuarioListar
                );

            estadoAutorizacaoSubject.next({
                carregado: true,
                permissoes:
                    new Set([
                        ChavePermissao
                            .UsuarioListar
                    ])
            });

            const grupoAcesso =
                component
                    .menuConfiguracoes
                    .find(
                        (item) =>
                            item.name ===
                            'Acesso e Segurança'
                    );

            expect(
                grupoAcesso
                    ?.children
                    ?.map(
                        (item) =>
                            item.name
                    )
            ).toEqual([
                'Usuários'
            ]);
        }
    );

    it(
        'deve manter somente Plataforma durante a configuracao inicial',
        () => {

            autorizarTodasAsPermissoes();

            publicarConfiguracao(
                estadoPendente
            );

            expect(
                component
                    .configuracaoInicialPendente
            ).toBeTrue();

            expect(component.menu)
                .toEqual([]);

            expect(
                component
                    .menuConfiguracoes
                    .map(
                        (item) =>
                            item.name
                    )
            ).toEqual([
                'Plataforma'
            ]);

            const plataforma =
                component
                    .menuConfiguracoes
                    .find(
                        (item) =>
                            item.name ===
                            'Plataforma'
                    );

            expect(
                plataforma
                    ?.children
                    ?.map(
                        (item) =>
                            item.name
                    )
            ).toEqual([
                'Organizacoes',
                'Convites'
            ]);

            const configuracao =
                component
                    .menuConfiguracoes
                    .find(
                        (item) =>
                            item.name ===
                            'Configuração'
                    );

            expect(configuracao)
                .toBeUndefined();

            const empresaVisivel =
                component
                    .menuConfiguracoes
                    .some(
                        (item) =>
                            item.children
                                ?.some(
                                    (child) =>
                                        child.name ===
                                        'Empresas'
                                ) === true
                    );

            expect(empresaVisivel)
                .toBeFalse();
        }
    );

    it(
        'deve liberar menus imediatamente quando a configuracao estiver completa',
        () => {

            autorizarTodasAsPermissoes();

            publicarConfiguracao(
                estadoPendente
            );

            publicarConfiguracao(
                estadoCompleto
            );

            expect(
                component
                    .configuracaoInicialPendente
            ).toBeFalse();

            expect(
                component
                    .configuracaoInicialCarregando
            ).toBeFalse();

            expect(
                component
                    .menuConfiguracoes
                    .map(
                        (item) =>
                            item.name
                    )
            ).toEqual([
                'Plataforma',
                'Acesso e Segurança',
                'Configuração'
            ]);

            const configuracao =
                component
                    .menuConfiguracoes
                    .find(
                        (item) =>
                            item.name ===
                            'Configuração'
                    );

            expect(
                configuracao
                    ?.children
                    ?.map(
                        (item) =>
                            item.name
                    )
            ).toEqual([
                'Empresas',
                'Subsidiárias'
            ]);
        }
    );

    it(
        'deve consultar a configuracao ao trocar de organizacao',
        () => {

            configuracaoInicialServiceMock
                .limparEstado
                .calls
                .reset();

            configuracaoInicialServiceMock
                .consultar
                .calls
                .reset();

            estadoRetornado =
                estadoPendente;

            organizacaoProntaSubject.next({
                id: 2,
                nome:
                    'Segunda Organização'
            });

            expect(
                configuracaoInicialServiceMock
                    .limparEstado
            ).not.toHaveBeenCalled();

            expect(
                configuracaoInicialServiceMock
                    .consultar
            ).toHaveBeenCalledTimes(1);

            expect(
                component
                    .configuracaoInicialPendente
            ).toBeTrue();

            expect(
                configuracaoSubject
                    .value
                    .idOrganizacao
            ).toBe(2);
        }
    );

    it(
        'nao deve consultar novamente quando a organizacao permanecer a mesma',
        () => {

            configuracaoInicialServiceMock
                .limparEstado
                .calls
                .reset();

            configuracaoInicialServiceMock
                .consultar
                .calls
                .reset();

            organizacaoProntaSubject.next({
                id: 1,
                nome:
                    'Organização Principal Atualizada'
            });

            expect(
                configuracaoInicialServiceMock
                    .limparEstado
            ).not.toHaveBeenCalled();

            expect(
                configuracaoInicialServiceMock
                    .consultar
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve limpar o contexto quando nao houver organizacao ativa',
        () => {

            configuracaoInicialServiceMock
                .limparEstado
                .calls
                .reset();

            configuracaoInicialServiceMock
                .consultar
                .calls
                .reset();

            organizacaoProntaSubject.next(
                null
            );

            expect(
                configuracaoInicialServiceMock
                    .limparEstado
            ).toHaveBeenCalledTimes(1);

            expect(
                configuracaoInicialServiceMock
                    .consultar
            ).not.toHaveBeenCalled();

            expect(
                component
                    .configuracaoInicialPendente
            ).toBeTrue();

            expect(component.menu)
                .toEqual([]);
        }
    );

    it(
        'deve remover item quando nao possuir permissao',
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
                            .UsuarioListar
                );

            const itens: MenuItem[] = [
                {
                    name:
                        'Usuários',
                    iconClasses:
                        'fas fa-users',
                    path: [
                        '/usuarios'
                    ],
                    permissao:
                        ChavePermissao
                            .UsuarioListar
                },
                {
                    name:
                        'Perfis',
                    iconClasses:
                        'fas fa-user-tag',
                    path: [
                        '/perfis'
                    ],
                    permissao:
                        ChavePermissao
                            .PerfilListar
                }
            ];

            const resultado =
                component[
                    'filtrarMenu'
                ](
                    itens
                );

            expect(resultado)
                .toEqual([
                    itens[0]
                ]);
        }
    );

    it(
        'deve remover grupo sem submenu autorizado',
        () => {

            autorizacaoServiceMock
                .possuiPermissao
                .and
                .returnValue(false);

            const itens: MenuItem[] = [
                {
                    name:
                        'Acesso',
                    iconClasses:
                        'fas fa-shield-alt',
                    children: [
                        {
                            name:
                                'Usuários',
                            iconClasses:
                                'fas fa-users',
                            path: [
                                '/usuarios'
                            ],
                            permissao:
                                ChavePermissao
                                    .UsuarioListar
                        }
                    ]
                }
            ];

            const resultado =
                component[
                    'filtrarMenu'
                ](
                    itens
                );

            expect(resultado)
                .toEqual([]);
        }
    );

    it(
        'deve selecionar modulo pela rota atual',
        () => {

            const modulo: MenuItem = {
                name:
                    'Acesso e Segurança',
                iconClasses:
                    'fas fa-shield-alt',
                children: [
                    {
                        name:
                            'Usuários',
                        iconClasses:
                            'fas fa-users',
                        path: [
                            '/acesso/usuarios'
                        ]
                    }
                ]
            };

            component.menu = [];

            component.menuConfiguracoes = [
                modulo
            ];

            component[
                'selecionarModuloPelaRota'
            ](
                '/acesso/usuarios/1?origem=lista'
            );

            expect(
                component
                    .moduloSelecionado
            ).toBe(
                modulo
            );
        }
    );

    it(
        'deve alternar painel flutuante no menu recolhido',
        () => {

            const modulo: MenuItem = {
                name:
                    'Acesso e Segurança',
                iconClasses:
                    'fas fa-shield-alt',
                children: [
                    {
                        name:
                            'Usuários',
                        iconClasses:
                            'fas fa-users',
                        path: [
                            '/acesso/usuarios'
                        ]
                    }
                ]
            };

            const elemento =
                document.createElement(
                    'button'
                );

            component.menuRecolhido =
                true;

            component.selecionarModulo({
                item:
                    modulo,
                elemento
            });

            expect(
                component
                    .moduloSelecionado
            ).toBe(
                modulo
            );

            expect(
                component
                    .painelFlutuanteAberto
            ).toBeTrue();

            component.selecionarModulo({
                item:
                    modulo,
                elemento
            });

            expect(
                component
                    .painelFlutuanteAberto
            ).toBeFalse();
        }
    );

    it(
        'deve fechar painel ao pressionar Escape',
        () => {

            component
                .painelFlutuanteAberto =
                    true;

            component
                .fecharPainelFlutuante();

            expect(
                component
                    .painelFlutuanteAberto
            ).toBeFalse();
        }
    );

    it(
        'deve fechar painel ao clicar fora',
        () => {

            component
                .painelFlutuanteAberto =
                    true;

            const elementoExterno =
                document.createElement(
                    'div'
                );

            component
                .fecharPainelAoClicarFora(
                    {
                        target:
                            elementoExterno
                    } as unknown as
                        MouseEvent
                );

            expect(
                component
                    .painelFlutuanteAberto
            ).toBeFalse();
        }
    );

    it(
        'nao deve fechar painel ao clicar dentro',
        () => {

            component
                .painelFlutuanteAberto =
                    true;

            component
                .fecharPainelAoClicarFora(
                    {
                        target:
                            fixture
                                .nativeElement
                    } as unknown as
                        MouseEvent
                );

            expect(
                component
                    .painelFlutuanteAberto
            ).toBeTrue();
        }
    );

    function publicarConfiguracao(
        estado:
            EstadoConfiguracaoInicial,
        idOrganizacao = 1
    ): void {

        configuracaoSubject.next({
            idOrganizacao,
            carregando:
                false,
            erro:
                false,
            estado
        });
    }

    function autorizarTodasAsPermissoes():
        void {

        autorizacaoServiceMock
            .possuiPermissao
            .and
            .returnValue(true);

        estadoAutorizacaoSubject.next({
            carregado: true,
            permissoes:
                new Set(
                    Object.values(
                        ChavePermissao
                    )
                )
        });
    }
});
import {
    NO_ERRORS_SCHEMA
} from '@angular/core';

import {
    ComponentFixture,
    TestBed,
    waitForAsync
} from '@angular/core/testing';

import {
    Store
} from '@ngrx/store';

import {
    BehaviorSubject
} from 'rxjs';

import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

import {
    ContextoConfiguracaoInicial
} from '@/domain/configuracao/configuracao-inicial/models/estado-configuracao-inicial.model';

import {
    ConfiguracaoInicialService
} from '@/domain/configuracao/configuracao-inicial/services/configuracao-inicial.service';

import {
    ToggleSidebarMenu
} from '@/store/ui/actions';

import {
    UiState
} from '@/store/ui/state';

import {
    MainComponent
} from './main.component';

describe('MainComponent', () => {

    let component:
        MainComponent;

    let fixture:
        ComponentFixture<
            MainComponent
        >;

    let configuracaoSubject:
        BehaviorSubject<
            ContextoConfiguracaoInicial
        >;

    let trocaOrganizacaoSubject:
        BehaviorSubject<boolean>;

    let uiSubject:
        BehaviorSubject<UiState>;

    let appRoot:
        HTMLElement;

    const storeMock = {
        select:
            jasmine.createSpy(
                'select'
            ),
        dispatch:
            jasmine.createSpy(
                'dispatch'
            )
    };

    const configuracaoInicialServiceMock = {
        retornarContextoObservable:
            jasmine.createSpy(
                'retornarContextoObservable'
            )
    };

    const contextoOrganizacaoServiceMock = {
        retornarTrocaOrganizacaoObservable:
            jasmine.createSpy(
                'retornarTrocaOrganizacaoObservable'
            )
    };

    beforeEach(
        waitForAsync(() => {
            appRoot =
                document.createElement(
                    'app-root'
                );

            document.body.appendChild(
                appRoot
            );

            configuracaoSubject =
                new BehaviorSubject<
                    ContextoConfiguracaoInicial
                >({
                    idOrganizacao: 1,
                    carregando: false,
                    erro: false,
                    estado: null
                });

            trocaOrganizacaoSubject =
                new BehaviorSubject<boolean>(
                    false
                );

            uiSubject =
                new BehaviorSubject<UiState>({
                    darkMode: false,
                    navbarVariant:
                        'navbar-light',
                    sidebarSkin:
                        'sidebar-dark-primary',
                    menuSidebarCollapsed:
                        false,
                    controlSidebarCollapsed:
                        true,
                    screenSize: null
                });

            storeMock.select
                .calls
                .reset();

            storeMock.select
                .and
                .returnValue(
                    uiSubject
                        .asObservable()
                );

            storeMock.dispatch
                .calls
                .reset();

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

            contextoOrganizacaoServiceMock
                .retornarTrocaOrganizacaoObservable
                .calls
                .reset();

            contextoOrganizacaoServiceMock
                .retornarTrocaOrganizacaoObservable
                .and
                .returnValue(
                    trocaOrganizacaoSubject
                        .asObservable()
                );

            TestBed
                .configureTestingModule({
                    declarations: [
                        MainComponent
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
                                ConfiguracaoInicialService,
                            useValue:
                                configuracaoInicialServiceMock
                        },
                        {
                            provide:
                                ContextoOrganizacaoService,
                            useValue:
                                contextoOrganizacaoServiceMock
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
                MainComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    afterEach(() => {
        appRoot.remove();
    });

    it(
        'deve ser criado',
        () => {

            expect(component)
                .toBeTruthy();
        }
    );

    it(
        'deve iniciar sem bloquear o conteudo',
        () => {

            expect(
                component
                    .configuracaoCarregando
            ).toBeFalse();

            expect(
                obterCamadaCarregamento()
            ).toBeNull();
        }
    );

    it(
        'deve bloquear o conteudo enquanto carrega a configuracao',
        () => {

            configuracaoSubject.next({
                idOrganizacao: 1,
                carregando: true,
                erro: false,
                estado: null
            });

            fixture.detectChanges();

            expect(
                component
                    .configuracaoCarregando
            ).toBeTrue();

            expect(
                obterCamadaCarregamento()
            ).not.toBeNull();

            expect(
                fixture
                    .nativeElement
                    .textContent
            ).toContain(
                'Preparando organização...'
            );
        }
    );

    it(
        'deve bloquear o conteudo durante a troca de organizacao',
        () => {

            trocaOrganizacaoSubject.next(
                true
            );

            fixture.detectChanges();

            expect(
                component
                    .configuracaoCarregando
            ).toBeTrue();

            expect(
                obterCamadaCarregamento()
            ).not.toBeNull();
        }
    );

    it(
        'deve manter o bloqueio enquanto uma das operacoes estiver carregando',
        () => {

            configuracaoSubject.next({
                idOrganizacao: 2,
                carregando: true,
                erro: false,
                estado: null
            });

            trocaOrganizacaoSubject.next(
                true
            );

            configuracaoSubject.next({
                idOrganizacao: 2,
                carregando: false,
                erro: false,
                estado: null
            });

            fixture.detectChanges();

            expect(
                component
                    .configuracaoCarregando
            ).toBeTrue();

            trocaOrganizacaoSubject.next(
                false
            );

            fixture.detectChanges();

            expect(
                component
                    .configuracaoCarregando
            ).toBeFalse();

            expect(
                obterCamadaCarregamento()
            ).toBeNull();
        }
    );

    it(
        'deve remover o bloqueio quando a consulta falhar',
        () => {

            configuracaoSubject.next({
                idOrganizacao: 1,
                carregando: true,
                erro: false,
                estado: null
            });

            configuracaoSubject.next({
                idOrganizacao: 1,
                carregando: false,
                erro: true,
                estado: null
            });

            fixture.detectChanges();

            expect(
                component
                    .configuracaoCarregando
            ).toBeFalse();

            expect(
                obterCamadaCarregamento()
            ).toBeNull();
        }
    );

    it(
        'deve observar o contexto da configuracao e a troca de organizacao',
        () => {

            expect(
                configuracaoInicialServiceMock
                    .retornarContextoObservable
            ).toHaveBeenCalledTimes(1);

            expect(
                contextoOrganizacaoServiceMock
                    .retornarTrocaOrganizacaoObservable
            ).toHaveBeenCalledTimes(1);
        }
    );

    it(
        'deve alternar o menu lateral',
        () => {

            component
                .onToggleMenuSidebar();

            expect(
                storeMock.dispatch
            ).toHaveBeenCalledTimes(1);

            expect(
                storeMock.dispatch
            ).toHaveBeenCalledWith(
                jasmine.any(
                    ToggleSidebarMenu
                )
            );
        }
    );

    it(
        'deve aplicar as classes do tema claro',
        () => {

            expect(
                appRoot.classList
                    .contains(
                        'layout-fixed'
                    )
            ).toBeTrue();

            expect(
                appRoot.classList
                    .contains(
                        'sidebar-open'
                    )
            ).toBeTrue();

            expect(
                appRoot.classList
                    .contains(
                        'dark-mode'
                    )
            ).toBeFalse();
        }
    );

    it(
        'deve atualizar as classes quando o estado visual mudar',
        () => {

            uiSubject.next({
                darkMode: true,
                navbarVariant:
                    'navbar-dark',
                sidebarSkin:
                    'sidebar-dark-primary',
                menuSidebarCollapsed:
                    true,
                controlSidebarCollapsed:
                    false,
                screenSize: null
            });

            expect(
                appRoot.classList
                    .contains(
                        'sidebar-collapse'
                    )
            ).toBeTrue();

            expect(
                appRoot.classList
                    .contains(
                        'sidebar-open'
                    )
            ).toBeFalse();

            expect(
                appRoot.classList
                    .contains(
                        'control-sidebar-slide-open'
                    )
            ).toBeTrue();

            expect(
                appRoot.classList
                    .contains(
                        'dark-mode'
                    )
            ).toBeTrue();
        }
    );

    function obterCamadaCarregamento():
        HTMLElement | null {

        return fixture
            .nativeElement
            .querySelector(
                '.organizacao-loading'
            );
    }
});
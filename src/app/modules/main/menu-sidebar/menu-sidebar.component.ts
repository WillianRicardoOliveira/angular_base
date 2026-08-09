import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ElementRef,
    HostBinding,
    HostListener,
    OnInit
} from '@angular/core';

import {
    takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
    NavigationEnd,
    Router
} from '@angular/router';

import {
    Store
} from '@ngrx/store';

import {
    filter
} from 'rxjs/operators';

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
    AppState
} from '@/store/state';

import {
    UiState
} from '@/store/ui/state';

const BASE_CLASSES =
    'main-sidebar elevation-4 sidebar-no-expand';

@Component({
    selector: 'app-menu-sidebar',
    templateUrl:
        './menu-sidebar.component.html',
    styleUrls: [
        './menu-sidebar.component.scss'
    ],
    standalone: false
})
export class MenuSidebarComponent
    implements OnInit {

    @HostBinding('class')
    classes: string = BASE_CLASSES;

    menu: MenuItem[] = [];

    menuConfiguracoes: MenuItem[] = [];

    menuRecolhido = false;

    moduloSelecionado: MenuItem | null =
        null;

    painelFlutuanteAberto = false;

    painelFlutuanteTop = 0;

    constructor(
        private store: Store<AppState>,
        private autorizacaoService:
            AutorizacaoService,
        private router: Router,
        private elementRef:
            ElementRef<HTMLElement>,
        private changeDetectorRef:
            ChangeDetectorRef,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.menu =
            this.filtrarMenu(
                MENU
            );

        this.menuConfiguracoes =
            this.filtrarMenu(
                MENU_CONFIGURACOES
            );

        this.selecionarModuloPelaRota(
            this.router.url
        );

        this.router.events
            .pipe(
                filter(
                    (
                        event
                    ): event is NavigationEnd =>
                        event instanceof
                        NavigationEnd
                ),
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe(
                (event) => {
                    this.painelFlutuanteAberto =
                        false;

                    this.selecionarModuloPelaRota(
                        event.urlAfterRedirects
                    );
                }
            );

        this.store
            .select('ui')
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe(
                (state: UiState) => {
                    this.menuRecolhido =
                        state
                            .menuSidebarCollapsed;

                    if (!this.menuRecolhido) {
                        this.painelFlutuanteAberto =
                            false;
                    }

                    this.classes =
                        `${BASE_CLASSES} ` +
                        `${state.sidebarSkin}`;
                }
            );
    }

    @HostListener(
        'document:keydown.escape'
    )
    fecharPainelFlutuante(): void {
        this.painelFlutuanteAberto =
            false;
    }

    @HostListener(
        'document:click',
        [
            '$event'
        ]
    )
    fecharPainelAoClicarFora(
        event: MouseEvent
    ): void {
        if (!this.painelFlutuanteAberto) {
            return;
        }

        const alvo =
            event.target as Node | null;

        if (
            !alvo ||
            this.elementRef
                .nativeElement
                .contains(alvo)
        ) {
            return;
        }

        this.painelFlutuanteAberto =
            false;
    }

    selecionarModulo(
        evento: {
            item: MenuItem;
            elemento: HTMLElement;
        }
    ): void {
        const {
            item,
            elemento
        } = evento;

        if (this.menuRecolhido) {
            const mesmoModulo =
                this.moduloSelecionado === item;

            this.moduloSelecionado = item;

            this.painelFlutuanteAberto =
                mesmoModulo
                    ? !this.painelFlutuanteAberto
                    : true;

            if (
                this.painelFlutuanteAberto
            ) {
                this.posicionarPainelFlutuante(
                    elemento
                );
            }

            return;
        }

        this.moduloSelecionado = item;
        this.painelFlutuanteAberto = false;
    }

    private posicionarPainelFlutuante(
        elemento: HTMLElement
    ): void {
        requestAnimationFrame(
            () => {
                if (
                    !this.painelFlutuanteAberto
                ) {
                    return;
                }

                const painel =
                    this.elementRef
                        .nativeElement
                        .querySelector<HTMLElement>(
                            '.contextual-panel-floating'
                        );

                if (!painel) {
                    return;
                }

                const posicaoBotao =
                    elemento
                        .getBoundingClientRect();

                const alturaPainel =
                    painel.offsetHeight;

                const margem = 16;

                const posicaoCentralizada =
                    posicaoBotao.top +
                    posicaoBotao.height / 2 -
                    alturaPainel / 2;

                const limiteInferior =
                    Math.max(
                        margem,
                        window.innerHeight -
                        alturaPainel -
                        margem
                    );

                this.painelFlutuanteTop =
                    Math.min(
                        Math.max(
                            posicaoCentralizada,
                            margem
                        ),
                        limiteInferior
                    );

                this.changeDetectorRef
                    .detectChanges();
            }
        );
    }

    private selecionarModuloPelaRota(
        url: string
    ): void {
        const caminho =
            url
                .split('?')[0]
                .split('#')[0];

        const modulos = [
            ...this.menu,
            ...this.menuConfiguracoes
        ];

        this.moduloSelecionado =
            modulos.find(
                (modulo) =>
                    modulo.children?.some(
                        (item) => {
                            const rota =
                                item.path?.[0];

                            if (!rota) {
                                return false;
                            }

                            return (
                                caminho === rota ||
                                caminho.startsWith(
                                    `${rota}/`
                                )
                            );
                        }
                    )
            ) ?? null;
    }

    private filtrarMenu(
        itens: readonly MenuItem[]
    ): MenuItem[] {
        return itens.reduce<MenuItem[]>(
            (
                itensVisiveis,
                item
            ) => {
                if (
                    item.permissao &&
                    !this.autorizacaoService
                        .possuiPermissao(
                            item.permissao
                        )
                ) {
                    return itensVisiveis;
                }

                if (!item.children) {
                    return [
                        ...itensVisiveis,
                        item
                    ];
                }

                const children =
                    this.filtrarMenu(
                        item.children
                    );

                if (
                    children.length === 0
                ) {
                    return itensVisiveis;
                }

                return [
                    ...itensVisiveis,
                    {
                        ...item,
                        children
                    }
                ];
            },
            []
        );
    }
}

export const MENU: MenuItem[] = [
    {
        name: 'Dashboard',
        iconClasses:
            'fas fa-tachometer-alt',
        path: [
            '/dashboard'
        ]
    },
    {
        name: 'Módulo de referência',
        iconClasses:
            'fas fa-layer-group',
        children: [
            {
                name: 'Visão geral',
                iconClasses:
                    'fas fa-chart-line',
                path: [
                    '/referencia/visao-geral'
                ]
            },
            {
                name: 'Cadastros',
                iconClasses:
                    'fas fa-folder',
                path: [
                    '/referencia/cadastros'
                ]
            },
            {
                name: 'Relatórios',
                iconClasses:
                    'fas fa-chart-bar',
                path: [
                    '/referencia/relatorios'
                ]
            }
        ]
    }
];

export const MENU_CONFIGURACOES:
    MenuItem[] = [
        {
            name:
                'Acesso e Segurança',
            iconClasses:
                'fas fa-shield-alt',
            children: [
                {
                    name: 'Perfis',
                    iconClasses:
                        'fas fa-user-shield',
                    path: [
                        '/acesso/perfis'
                    ],
                    permissao:
                        ChavePermissao
                            .PerfilListar
                },
                {
                    name: 'Permissões',
                    iconClasses:
                        'fas fa-key',
                    path: [
                        '/acesso/permissoes'
                    ],
                    permissao:
                        ChavePermissao
                            .PermissaoListar
                },
                {
                    name: 'Usuários',
                    iconClasses:
                        'fas fa-users',
                    path: [
                        '/acesso/usuarios'
                    ],
                    permissao:
                        ChavePermissao
                            .UsuarioListar
                }
            ]
        }
    ];
import {
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    OnInit
} from '@angular/core';

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

    constructor(
        private store: Store<AppState>,
        private autorizacaoService:
            AutorizacaoService,
        private router: Router,
        private elementRef:
            ElementRef<HTMLElement>
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
        item: MenuItem
    ): void {
        if (this.menuRecolhido) {
            const mesmoModulo =
                this.moduloSelecionado === item;

            this.moduloSelecionado = item;

            this.painelFlutuanteAberto =
                mesmoModulo
                    ? !this.painelFlutuanteAberto
                    : true;

            return;
        }

        this.moduloSelecionado = item;
        this.painelFlutuanteAberto = false;
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
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

const MARGEM_PAINEL = 12;

type DirecaoPainelFlutuante =
    'baixo' |
    'centro' |
    'cima';

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

    painelFlutuantePosicionado = false;

    painelFlutuanteTop = 0;

    painelFlutuanteAlturaMaxima = 0;

    painelFlutuanteDirecao:
        DirecaoPainelFlutuante =
            'centro';

    private elementoModuloAtivo:
        HTMLElement | null = null;

    private agendamentoPosicionamento:
        number | null = null;

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
    ) {
        this.destroyRef.onDestroy(
            () => {
                this.cancelarPosicionamento();
            }
        );
    }

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
                    this.fecharPainelFlutuante();

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
                        this.fecharPainelFlutuante();
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
        this.cancelarPosicionamento();

        this.painelFlutuanteAberto =
            false;

        this.painelFlutuantePosicionado =
            false;

        this.elementoModuloAtivo =
            null;
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

        this.fecharPainelFlutuante();
    }

    @HostListener(
        'window:resize'
    )
    reposicionarPainelAoRedimensionar():
        void {

        if (
            !this.painelFlutuanteAberto ||
            !this.elementoModuloAtivo
        ) {
            return;
        }

        this.manterModuloVisivel(
            this.elementoModuloAtivo
        );

        this.painelFlutuantePosicionado =
            false;

        this.prepararAreaDisponivel();

        this.posicionarPainelFlutuante(
            this.elementoModuloAtivo
        );
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

            if (
                mesmoModulo &&
                this.painelFlutuanteAberto
            ) {
                this.fecharPainelFlutuante();

                return;
            }

            this.moduloSelecionado = item;

            this.elementoModuloAtivo =
                elemento;

            this.manterModuloVisivel(
                elemento
            );

            this.painelFlutuantePosicionado =
                false;

            this.prepararAreaDisponivel();

            this.painelFlutuanteAberto =
                true;

            this.posicionarPainelFlutuante(
                elemento
            );

            return;
        }

        this.moduloSelecionado = item;

        this.fecharPainelFlutuante();
    }

    private manterModuloVisivel(
        elemento: HTMLElement
    ): void {
        elemento.scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
            inline: 'nearest'
        });
    }

    private obterLimitesAreaDisponivel(): {
        limiteSuperior: number;
        limiteInferior: number;
    } {
        const cabecalho =
            document.querySelector<HTMLElement>(
                '.main-header'
            );

        const rodape =
            document.querySelector<HTMLElement>(
                '.main-footer'
            );

        const limiteSuperior =
            (
                cabecalho
                    ?.getBoundingClientRect()
                    .bottom ?? 0
            ) +
            MARGEM_PAINEL;

        const inicioRodape =
            rodape
                ?.getBoundingClientRect()
                .top ??
            window.innerHeight;

        const limiteInferior =
            Math.max(
                limiteSuperior,
                Math.min(
                    window.innerHeight,
                    inicioRodape
                ) -
                MARGEM_PAINEL
            );

        return {
            limiteSuperior,
            limiteInferior
        };
    }

    private prepararAreaDisponivel(): void {
        const {
            limiteSuperior,
            limiteInferior
        } = this.obterLimitesAreaDisponivel();

        this.painelFlutuanteTop =
            limiteSuperior;

        this.painelFlutuanteAlturaMaxima =
            Math.max(
                0,
                limiteInferior -
                limiteSuperior
            );
    }

    private posicionarPainelFlutuante(
        elemento: HTMLElement
    ): void {
        this.cancelarPosicionamento();

        this.agendamentoPosicionamento =
            requestAnimationFrame(
                () => {
                    this.agendamentoPosicionamento =
                        null;

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

                    const {
                        limiteSuperior,
                        limiteInferior
                    } = this.obterLimitesAreaDisponivel();

                    const alturaDisponivel =
                        Math.max(
                            0,
                            limiteInferior -
                            limiteSuperior
                        );

                    const centroBotao =
                        posicaoBotao.top +
                        posicaoBotao.height / 2;

                    const primeiroTerco =
                        limiteSuperior +
                        alturaDisponivel / 3;

                    const ultimoTerco =
                        limiteSuperior +
                        (
                            alturaDisponivel * 2
                        ) / 3;

                    const topAbaixo =
                        posicaoBotao.top;

                    const topAcima =
                        posicaoBotao.bottom -
                        alturaPainel;

                    const topCentralizado =
                        centroBotao -
                        alturaPainel / 2;

                    const cabeAbaixo =
                        topAbaixo +
                        alturaPainel <=
                        limiteInferior;

                    const cabeAcima =
                        topAcima >=
                        limiteSuperior;

                    let topCalculado:
                        number;

                    if (
                        centroBotao <=
                        primeiroTerco
                    ) {
                        if (cabeAbaixo) {
                            this.painelFlutuanteDirecao =
                                'baixo';

                            topCalculado =
                                topAbaixo;
                        } else if (cabeAcima) {
                            this.painelFlutuanteDirecao =
                                'cima';

                            topCalculado =
                                topAcima;
                        } else {
                            this.painelFlutuanteDirecao =
                                'centro';

                            topCalculado =
                                topCentralizado;
                        }
                    } else if (
                        centroBotao >=
                        ultimoTerco
                    ) {
                        if (cabeAcima) {
                            this.painelFlutuanteDirecao =
                                'cima';

                            topCalculado =
                                topAcima;
                        } else if (cabeAbaixo) {
                            this.painelFlutuanteDirecao =
                                'baixo';

                            topCalculado =
                                topAbaixo;
                        } else {
                            this.painelFlutuanteDirecao =
                                'centro';

                            topCalculado =
                                topCentralizado;
                        }
                    } else {
                        this.painelFlutuanteDirecao =
                            'centro';

                        topCalculado =
                            topCentralizado;
                    }

                    const maiorTopPermitido =
                        Math.max(
                            limiteSuperior,
                            limiteInferior -
                            alturaPainel
                        );

                    this.painelFlutuanteTop =
                        Math.min(
                            Math.max(
                                topCalculado,
                                limiteSuperior
                            ),
                            maiorTopPermitido
                        );

                    this.painelFlutuantePosicionado =
                        true;

                    this.changeDetectorRef
                        .detectChanges();
                }
            );
    }

    private cancelarPosicionamento(): void {
        if (
            this.agendamentoPosicionamento ===
            null
        ) {
            return;
        }

        cancelAnimationFrame(
            this.agendamentoPosicionamento
        );

        this.agendamentoPosicionamento =
            null;
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

const criarModuloReferencia = (
    nome: string,
    rotaBase: string,
    iconClasses: string
): MenuItem => ({
    name: nome,
    iconClasses,
    children: [
        {
            name: 'Visão geral',
            iconClasses:
                'fas fa-chart-line',
            path: [
                `/${rotaBase}/visao-geral`
            ]
        },
        {
            name: 'Cadastros',
            iconClasses:
                'fas fa-folder-open',
            path: [
                `/${rotaBase}/cadastros`
            ]
        },
        {
            name: 'Relatórios',
            iconClasses:
                'fas fa-chart-bar',
            path: [
                `/${rotaBase}/relatorios`
            ]
        }
    ]
});

export const MENU: MenuItem[] = [
    {
        name: 'Dashboard',
        iconClasses:
            'fas fa-tachometer-alt',
        path: [
            '/dashboard'
        ]
    },
    criarModuloReferencia(
        'Comercial',
        'comercial',
        'fas fa-tags'
    ),
    criarModuloReferencia(
        'Compras',
        'compras',
        'fas fa-shopping-cart'
    ),
    criarModuloReferencia(
        'Contabilidade',
        'contabilidade',
        'fas fa-calculator'
    ),
    criarModuloReferencia(
        'Controladoria',
        'controladoria',
        'fas fa-chart-line'
    ),
    criarModuloReferencia(
        'Crédito',
        'credito',
        'fas fa-credit-card'
    ),
    criarModuloReferencia(
        'Estoque',
        'estoque',
        'fas fa-warehouse'
    ),
    criarModuloReferencia(
        'Faturamento',
        'faturamento',
        'fas fa-file-invoice-dollar'
    ),
    criarModuloReferencia(
        'Financeiro',
        'financeiro',
        'fas fa-dollar-sign'
    ),
    criarModuloReferencia(
        'Fiscal',
        'fiscal',
        'fas fa-file-invoice'
    ),
    criarModuloReferencia(
        'Logística',
        'logistica',
        'fas fa-truck'
    ),
    criarModuloReferencia(
        'Supply',
        'supply',
        'fas fa-boxes'
    ),
    criarModuloReferencia(
        'Relatórios',
        'relatorios',
        'fas fa-chart-bar'
    ),
    criarModuloReferencia(
        'Cadastros',
        'cadastros',
        'fas fa-address-book'
    )
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
import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

const BASE_CLASSES = 'main-sidebar elevation-4';

@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss'],
    standalone: false
})
export class MenuSidebarComponent implements OnInit {

    @HostBinding('class') classes: string = BASE_CLASSES;

    public menu = MENU;

    public menuConfiguracoes = MENU_CONFIGURACOES;

    constructor(
        private store: Store<AppState>
    ) { }

    ngOnInit(): void {
        this.store.select('ui').subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
        });
    }

}

export const MENU = [
    {
        name: 'Dashboard',
        iconClasses: 'fas fa-tachometer-alt',
        path: ['/dashboard']
    },
    {
        name: 'Comercial',
        iconClasses: 'fas fa-tags',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-circle',
                path: ['/comercial/menu-1']
            }
        ]
    },
    {
        name: 'Compras',
        iconClasses: 'fas fa-shopping-cart',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-circle',
                path: ['/compras/menu-1']
            }
        ]
    },
    {
        name: 'Contabilidade',
        iconClasses: 'far fa-list-alt',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-circle',
                path: ['/contabilidade/menu-1']
            }
        ]
    },
    {
        name: 'Controladoria',
        iconClasses: 'fas fa-chart-line',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-circle',
                path: ['/controladoria/menu-1']
            }
        ]
    },
    {
        name: 'Crédito',
        iconClasses: 'far fa-credit-card',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-circle',
                path: ['/credito/menu-1']
            }
        ]
    },
    {
        name: 'Estoque',
        iconClasses: 'fas fa-warehouse',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-circle',
                path: ['/estoque/menu-1']
            }
        ]
    },
    {
        name: 'Faturamento',
        iconClasses: 'fas fa-file-invoice-dollar',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-circle',
                path: ['/faturamento/menu-1']
            }
        ]
    },
    {
        name: 'Financeiro',
        iconClasses: 'fas fa-dollar-sign',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-circle',
                path: ['/financeiro/menu-1']
            }
        ]
    },
    {
        name: 'Fiscal',
        iconClasses: 'far fa-file-alt',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-circle',
                path: ['/fiscal/menu-1']
            }
        ]
    },
    {
        name: 'Logística',
        iconClasses: 'fas fa-truck',
        children: [
            {
                name: 'Internacional',
                iconClasses: 'fas fa-circle',
                path: ['/logistica/internacional']
            },
            {
                name: 'Nacional',
                iconClasses: 'fas fa-circle',
                path: ['/logistica/nacional']
            }
        ]
    },
    {
        name: 'Supply',
        iconClasses: 'fas fa-boxes',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-circle',
                path: ['/supply/menu-1']
            }
        ]
    },
    {
        name: 'Relatórios',
        iconClasses: 'far fa-chart-bar',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-circle',
                path: ['/relatorios/menu-1']
            }
        ]
    },
    {
        name: 'Cadastros',
        iconClasses: 'far fa-address-book',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-circle',
                path: ['/cadastros/menu-1']
            }
        ]
    }
];

export const MENU_CONFIGURACOES = [
    {
        name: 'Configurações',
        iconClasses: 'fas fa-cog',
        path: ['/configuracoes']
    }
];

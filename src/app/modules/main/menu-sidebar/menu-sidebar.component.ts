import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService } from '@services/app.service';
import { Observable } from 'rxjs';

const BASE_CLASSES = 'main-sidebar elevation-4';
@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss'],
    standalone: false
})
export class MenuSidebarComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public user;
    public menu = MENU;

    public menuConfiguracoes = MENU_CONFIGURACOES;

    constructor(
        public appService: AppService,
        private store: Store<AppState>
    ) { }

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
        });
        this.user = this.appService.user;
    }
}

export const MENU = [
    {
        name: 'Dashboard',
        iconClasses: 'fas fa-tachometer-alt',
        path: ['/dashboard']
    },
    {
        name: 'Contabilidade',
        iconClasses: 'far fa-list-alt',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-file',
                path: ['/dashboard']
            },
        ]
    },
    {
        name: 'Controladoria',
        iconClasses: 'fas fa-chart-line',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-file',
                path: ['/dashboard']
            },
        ]
    },
    {
        name: 'Crédito',
        iconClasses: 'far fa-credit-card',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-file',
                path: ['/dashboard']
            },
        ]
    },
    {
        name: 'Faturamento',
        iconClasses: 'fas fa-file-invoice-dollar',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-file',
                path: ['/dashboard']
            },
        ]
    },
    {
        name: 'Financeiro',
        iconClasses: 'fas fa-dollar-sign',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-file',
                path: ['/dashboard']
            },
        ]
    },
    {
        name: 'Fiscal',
        iconClasses: 'far fa-file-alt',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-file',
                path: ['/dashboard']
            },
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
                iconClasses: 'fas fa-file',
                path: ['/dashboard']
            },
        ]
    },
    {
        name: 'Relatórios',
        iconClasses: 'far fa-chart-bar',
        children: [
            {
                name: 'Menu 1',
                iconClasses: 'fas fa-file',
                path: ['/dashboard']
            },
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

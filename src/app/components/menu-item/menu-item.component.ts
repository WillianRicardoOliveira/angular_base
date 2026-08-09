import {
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnInit,
    Output
} from '@angular/core';

import {
    NavigationEnd,
    Router
} from '@angular/router';

import {
    filter
} from 'rxjs/operators';

import {
    MenuItem
} from './models/menu-item.model';

import {
    rotateAnimation
} from './menu-item.animations';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
    animations: [
        rotateAnimation
    ],
    standalone: false
})
export class MenuItemComponent
    implements OnInit {

    @Input()
    menuItem: MenuItem | null = null;

    @Input()
    selecionado = false;

    @Input()
    modoContextual = false;

    @Input()
    painelAberto = false;

    @Output()
    solicitarExpansao =
        new EventEmitter<MenuItem>();

    @HostBinding('class.nav-item')
    isNavItem = true;

    isExpandable = false;

    isMainActive = false;

    isOneOfChildrenActive = false;

    constructor(
        private router: Router
    ) {}

    ngOnInit(): void {
        if (!this.menuItem) {
            return;
        }

        this.isExpandable =
            (
                this.menuItem
                    .children
                    ?.length ?? 0
            ) > 0;

        this.calculateIsActive(
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
                    this.calculateIsActive(
                        event.urlAfterRedirects
                    );
                }
            );
    }

    handleMainMenuAction(): void {
        if (!this.menuItem) {
            return;
        }

        if (this.isExpandable) {
            this.solicitarExpansao
                .emit(this.menuItem);

            return;
        }

        if (this.menuItem.path) {
            this.router.navigate(
                this.menuItem.path
            );
        }
    }

    calculateIsActive(
        url: string
    ): void {
        this.isMainActive = false;
        this.isOneOfChildrenActive =
            false;

        if (!this.menuItem) {
            return;
        }

        const caminho =
            url
                .split('?')[0]
                .split('#')[0];

        if (this.isExpandable) {
            this.isOneOfChildrenActive =
                this.menuItem.children
                    ?.some(
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
                    ) ?? false;

            return;
        }

        const rota =
            this.menuItem.path?.[0];

        if (!rota) {
            return;
        }

        this.isMainActive =
            caminho === rota ||
            caminho.startsWith(
                `${rota}/`
            );
    }
}
import {
    Component,
    HostBinding,
    Input,
    OnInit
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
    openCloseAnimation,
    rotateAnimation
} from './menu-item.animations';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
    animations: [
        openCloseAnimation,
        rotateAnimation
    ],
    standalone: false
})
export class MenuItemComponent implements OnInit {
    @Input()
    menuItem: MenuItem | null = null;

    @HostBinding('class.nav-item')
    isNavItem = true;

    @HostBinding('class.menu-open')
    isMenuExtended = false;

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
            (this.menuItem.children?.length ?? 0) > 0;

        this.calculateIsActive(
            this.router.url
        );

        this.router.events
            .pipe(
                filter(
                    (event) =>
                        event instanceof NavigationEnd
                )
            )
            .subscribe(
                (event) => {
                    this.calculateIsActive(
                        event.url
                    );
                }
            );
    }

    handleMainMenuAction(): void {
        if (!this.menuItem) {
            return;
        }

        if (this.isExpandable) {
            this.toggleMenu();
            return;
        }

        if (this.menuItem.path) {
            this.router.navigate(
                this.menuItem.path
            );
        }
    }

    toggleMenu(): void {
        this.isMenuExtended =
            !this.isMenuExtended;
    }

    calculateIsActive(
        url: string
    ): void {
        this.isMainActive = false;
        this.isOneOfChildrenActive = false;

        if (!this.menuItem) {
            this.isMenuExtended = false;
            return;
        }

        if (this.isExpandable) {
            this.isOneOfChildrenActive =
                this.menuItem.children
                    ?.some(
                        (item) =>
                            item.path?.[0] === url
                    ) ?? false;

            if (this.isOneOfChildrenActive) {
                this.isMenuExtended = true;
            }
        } else {
            this.isMainActive =
                this.menuItem.path?.[0] === url;
        }

        if (
            !this.isMainActive &&
            !this.isOneOfChildrenActive
        ) {
            this.isMenuExtended = false;
        }
    }
}
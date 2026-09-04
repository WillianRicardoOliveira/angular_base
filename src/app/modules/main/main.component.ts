import {
    Component,
    DestroyRef,
    HostBinding,
    OnInit,
    Renderer2
} from '@angular/core';

import {
    takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
    Store
} from '@ngrx/store';

import {
    combineLatest,
    distinctUntilChanged,
    map,
    Observable
} from 'rxjs';

import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

import {
    ConfiguracaoInicialService
} from '@/domain/configuracao/configuracao-inicial/services/configuracao-inicial.service';

import {
    AppState
} from '@/store/state';

import {
    ToggleSidebarMenu
} from '@/store/ui/actions';

import {
    UiState
} from '@/store/ui/state';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: [
        './main.component.scss'
    ],
    standalone: false
})
export class MainComponent implements OnInit {

    @HostBinding('class')
    class = 'wrapper';

    ui!: Observable<UiState>;

    configuracaoCarregando = false;

    constructor(
        private readonly renderer:
            Renderer2,
        private readonly store:
            Store<AppState>,
        private readonly contextoOrganizacaoService:
            ContextoOrganizacaoService,
        private readonly configuracaoInicialService:
            ConfiguracaoInicialService,
        private readonly destroyRef:
            DestroyRef
    ) {
    }

    ngOnInit(): void {
        this.ui =
            this.store.select('ui');

        this.configurarEstadoVisual();

        this.configurarTema();
    }

    onToggleMenuSidebar(): void {
        this.store.dispatch(
            new ToggleSidebarMenu()
        );
    }

    private configurarEstadoVisual(): void {
        combineLatest([
            this.configuracaoInicialService
                .retornarContextoObservable(),
            this.contextoOrganizacaoService
                .retornarTrocaOrganizacaoObservable()
        ])
            .pipe(
                map(
                    ([
                        configuracao,
                        trocandoOrganizacao
                    ]) =>
                        configuracao.carregando ||
                        trocandoOrganizacao
                ),
                distinctUntilChanged(),
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe((carregando) => {
                this.configuracaoCarregando =
                    carregando;
            });
    }

    private configurarTema(): void {
        const appRoot =
            document.querySelector(
                'app-root'
            );

        this.renderer.removeClass(
            appRoot,
            'login-page'
        );

        this.renderer.removeClass(
            appRoot,
            'register-page'
        );

        this.renderer.addClass(
            appRoot,
            'layout-fixed'
        );

        this.ui
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe(({
                menuSidebarCollapsed,
                controlSidebarCollapsed,
                darkMode
            }) => {
                if (menuSidebarCollapsed) {
                    this.renderer.removeClass(
                        appRoot,
                        'sidebar-open'
                    );

                    this.renderer.addClass(
                        appRoot,
                        'sidebar-collapse'
                    );
                } else {
                    this.renderer.removeClass(
                        appRoot,
                        'sidebar-collapse'
                    );

                    this.renderer.addClass(
                        appRoot,
                        'sidebar-open'
                    );
                }

                if (controlSidebarCollapsed) {
                    this.renderer.removeClass(
                        appRoot,
                        'control-sidebar-slide-open'
                    );
                } else {
                    this.renderer.addClass(
                        appRoot,
                        'control-sidebar-slide-open'
                    );
                }

                if (darkMode) {
                    this.renderer.addClass(
                        appRoot,
                        'dark-mode'
                    );
                } else {
                    this.renderer.removeClass(
                        appRoot,
                        'dark-mode'
                    );
                }
            });
    }
}
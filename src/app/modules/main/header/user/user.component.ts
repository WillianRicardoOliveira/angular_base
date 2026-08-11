import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';

import {
    Router
} from '@angular/router';

import {
    Subject,
    takeUntil
} from 'rxjs';

import {
    AutenticacaoService
} from '@/core/autenticacao/services/autenticacao.service';

import {
    MicrosoftSsoService
} from '@/core/autenticacao/services/microsoft-sso.service';

import {
    UsuarioAutenticadoService
} from '@/core/autenticacao/services/usuario-autenticado.service';

@Component({
    selector: 'app-user',
    templateUrl:
        './user.component.html',
    styleUrls: [
        './user.component.scss'
    ],
    standalone: false
})
export class UserComponent
    implements OnInit, OnDestroy {

    @Output()
    menuUsuarioAberto =
        new EventEmitter<void>();

    userName = 'Usuário';

    userEmail = '';

    menuAberto = false;

    private readonly destroy$ =
        new Subject<void>();

    constructor(
        private autenticacaoService:
            AutenticacaoService,
        private microsoftSsoService:
            MicrosoftSsoService,
        private usuarioAutenticadoService:
            UsuarioAutenticadoService,
        private router: Router,
        private elementRef:
            ElementRef<HTMLElement>
    ) {}

    ngOnInit(): void {
        this.usuarioAutenticadoService
            .retornarUser()
            .pipe(
                takeUntil(
                    this.destroy$
                )
            )
            .subscribe((usuario) => {
                this.userEmail =
                    usuario?.sub ?? '';

                this.userName =
                    this.criarNomeExibicao(
                        this.userEmail
                    );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    alternarMenu(
        event: MouseEvent
    ): void {
        event.stopPropagation();

        const deveAbrir =
            !this.menuAberto;

        this.menuAberto =
            deveAbrir;

        if (deveAbrir) {
            this.menuUsuarioAberto.emit();
        }
    }

    fecharMenu(): void {
        this.menuAberto = false;
    }

    executarAcaoEmBreve(): void {
        this.fecharMenu();
    }

    @HostListener(
        'document:keydown.escape'
    )
    fecharMenuComEscape(): void {
        this.fecharMenu();
    }

    @HostListener(
        'document:click',
        ['$event']
    )
    fecharMenuAoClicarFora(
        event: MouseEvent
    ): void {
        if (!this.menuAberto) {
            return;
        }

        const alvo =
            event.target as Node | null;

        if (
            alvo &&
            !this.elementRef
                .nativeElement
                .contains(alvo)
        ) {
            this.fecharMenu();
        }
    }

    logout(): void {
        this.fecharMenu();

        this.autenticacaoService
            .logout()
            .subscribe({
                next: () => {
                    void this.finalizarLogout();
                },
                error: () => {
                    void this.finalizarLogout();
                }
            });
    }

    private criarNomeExibicao(
        email: string
    ): string {
        const identificador =
            email.split('@')[0];

        if (!identificador) {
            return 'Usuário';
        }

        return identificador
            .split(/[._-]+/)
            .filter(Boolean)
            .map(
                (parte) =>
                    parte
                        .charAt(0)
                        .toUpperCase() +
                    parte
                        .slice(1)
                        .toLowerCase()
            )
            .join(' ');
    }

    private async finalizarLogout():
        Promise<void> {

        try {
            await this.microsoftSsoService
                .limparCacheLocal();
        } catch {
            // A sessão interna já foi encerrada.
        }

        await this.router.navigate([
            '/login'
        ]);
    }
}
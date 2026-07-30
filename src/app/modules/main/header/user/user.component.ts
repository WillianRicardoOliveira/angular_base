import {
    Component,
    OnDestroy,
    OnInit
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
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    standalone: false
})
export class UserComponent
    implements OnInit, OnDestroy {
    userName = 'Usuário';

    userEmail = '';

    private readonly destroy$ =
        new Subject<void>();

    constructor(
        private autenticacaoService:
            AutenticacaoService,
        private microsoftSsoService:
            MicrosoftSsoService,
        private usuarioAutenticadoService:
            UsuarioAutenticadoService,
        private router: Router
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

    get userInitials(): string {
        return this.userName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(
                (name) =>
                    name
                        .charAt(0)
                        .toUpperCase()
            )
            .join('');
    }

    logout(): void {
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
            // Uma falha no cache MSAL não impede a saída.
        }

        this.router.navigate(['/login']);
    }
}
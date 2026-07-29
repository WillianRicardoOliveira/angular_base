import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AutenticacaoService} from '@/core/autenticacao/services/autenticacao.service';
import {MicrosoftSsoService} from '@/core/autenticacao/services/microsoft-sso.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    standalone: false
})
export class UserComponent {
    readonly userName = 'Willian Oliveira';
    readonly userEmail = 'willian.oliveira@alta-brasil.com';

    constructor(
        private autenticacaoService: AutenticacaoService,
        private microsoftSsoService: MicrosoftSsoService,
        private router: Router
    ) {}

    get userInitials(): string {
        return this.userName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((name) =>
                name.charAt(0).toUpperCase()
            )
            .join('');
    }

    logout(): void {
        this.autenticacaoService.logout().subscribe({
            next: () => {
                void this.finalizarLogout();
            },
            error: () => {
                void this.finalizarLogout();
            }
        });
    }

    private async finalizarLogout(): Promise<void> {
        try {
            await this.microsoftSsoService
                .limparCacheLocal();
        } catch {
            // A sessão interna já foi encerrada.
            // Uma falha no cache MSAL não deve impedir a saída.
        }

        this.router.navigate(['/login']);
    }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AutenticacaoService } from '@/core/autenticacao/services/autenticacao.service';

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
        private router: Router
    ) {}

    get userInitials(): string {
        return this.userName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((name) => name.charAt(0).toUpperCase())
            .join('');
    }

    logout(): void {
        this.autenticacaoService.logout().subscribe({
            next: () => {
                this.navegarParaLogin();
            },
            error: () => {
                this.navegarParaLogin();
            }
        });
    }

    private navegarParaLogin(): void {
        this.router.navigate(['/login']);
    }
}
import {Injectable} from '@angular/core';
import {MsalService} from '@azure/msal-angular';
import {map, Observable, tap} from 'rxjs';

import {
    requisicaoLoginSso
} from '@/core/autenticacao/configuracoes/msal.config';

@Injectable({
    providedIn: 'root'
})
export class MicrosoftSsoService {
    constructor(
        private msalService: MsalService
    ) {}

    login(): Observable<string> {
        return this.msalService
            .loginPopup(requisicaoLoginSso)
            .pipe(
                tap((resultado) => {
                    this.msalService.instance
                        .setActiveAccount(resultado.account);
                }),
                map((resultado) => resultado.accessToken)
            );
    }

    limparCacheLocal(): Promise<void> {
        return this.msalService.instance.clearCache();
    }
}
import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';

import { TokenService } from '@/core/autenticacao/services/token.service';

@Injectable({
    providedIn: 'root'
})
export class NaoAutenticadoGuard {
    constructor(
        private router: Router,
        private tokenService: TokenService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (!this.tokenService.possuiToken()) {
            return true;
        }

        this.router.navigateByUrl(
            this.obterUrlDestino(next)
        );

        return false;
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.canActivate(next, state);
    }

    private obterUrlDestino(
        next: ActivatedRouteSnapshot
    ): string {
        return this.normalizarReturnUrl(
            next.queryParamMap.get('returnUrl')
        );
    }

    private normalizarReturnUrl(
        returnUrl: string | null
    ): string {
        const url =
            returnUrl?.trim() ?? '';

        if (
            !url ||
            !url.startsWith('/') ||
            url.startsWith('//') ||
            url.startsWith('/login')
        ) {
            return '/';
        }

        return url;
    }
}
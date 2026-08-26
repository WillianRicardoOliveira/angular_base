import { TestBed } from '@angular/core/testing';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    convertToParamMap
} from '@angular/router';

import { TokenService } from '@/core/autenticacao/services/token.service';

import { NaoAutenticadoGuard } from './nao-autenticado.guard';

describe('NaoAutenticadoGuard', () => {
    let guard: NaoAutenticadoGuard;
    let routerMock: jasmine.SpyObj<Router>;
    let tokenServiceMock: jasmine.SpyObj<TokenService>;

    const routerStateSnapshot = {
        url: '/login'
    } as RouterStateSnapshot;

    beforeEach(() => {
        routerMock = jasmine.createSpyObj<Router>(
            'Router',
            ['navigateByUrl']
        );

        tokenServiceMock =
            jasmine.createSpyObj<TokenService>(
                'TokenService',
                ['possuiToken']
            );

        TestBed.configureTestingModule({
            providers: [
                NaoAutenticadoGuard,
                {
                    provide: Router,
                    useValue: routerMock
                },
                {
                    provide: TokenService,
                    useValue: tokenServiceMock
                }
            ]
        });

        guard = TestBed.inject(NaoAutenticadoGuard);
    });

    it('deve ser criado', () => {
        expect(guard).toBeTruthy();
    });

    it('deve permitir acesso quando nao houver token', () => {
        tokenServiceMock.possuiToken.and.returnValue(false);

        const resultado = guard.canActivate(
            criarRouteSnapshot(),
            routerStateSnapshot
        );

        expect(resultado).toBeTrue();

        expect(routerMock.navigateByUrl)
            .not.toHaveBeenCalled();
    });

    it('deve bloquear acesso e redirecionar para inicio quando houver token sem returnUrl', () => {
        tokenServiceMock.possuiToken.and.returnValue(true);

        const resultado = guard.canActivate(
            criarRouteSnapshot(),
            routerStateSnapshot
        );

        expect(resultado).toBeFalse();

        expect(routerMock.navigateByUrl)
            .toHaveBeenCalledOnceWith('/');
    });

    it('deve bloquear acesso e redirecionar para returnUrl interna quando houver token', () => {
        tokenServiceMock.possuiToken.and.returnValue(true);

        const resultado = guard.canActivate(
            criarRouteSnapshot(
                '/convites/organizacao/aceitar?token=token-convite'
            ),
            routerStateSnapshot
        );

        expect(resultado).toBeFalse();

        expect(routerMock.navigateByUrl)
            .toHaveBeenCalledOnceWith(
                '/convites/organizacao/aceitar?token=token-convite'
            );
    });

    it('deve ignorar returnUrl externa quando houver token', () => {
        tokenServiceMock.possuiToken.and.returnValue(true);

        const resultado = guard.canActivate(
            criarRouteSnapshot(
                'https://exemplo.com/externo'
            ),
            routerStateSnapshot
        );

        expect(resultado).toBeFalse();

        expect(routerMock.navigateByUrl)
            .toHaveBeenCalledOnceWith('/');
    });

    it('deve ignorar returnUrl iniciada por // quando houver token', () => {
        tokenServiceMock.possuiToken.and.returnValue(true);

        const resultado = guard.canActivate(
            criarRouteSnapshot(
                '//exemplo.com/externo'
            ),
            routerStateSnapshot
        );

        expect(resultado).toBeFalse();

        expect(routerMock.navigateByUrl)
            .toHaveBeenCalledOnceWith('/');
    });

    it('deve ignorar returnUrl de login quando houver token', () => {
        tokenServiceMock.possuiToken.and.returnValue(true);

        const resultado = guard.canActivate(
            criarRouteSnapshot(
                '/login?returnUrl=/convites/organizacao/aceitar'
            ),
            routerStateSnapshot
        );

        expect(resultado).toBeFalse();

        expect(routerMock.navigateByUrl)
            .toHaveBeenCalledOnceWith('/');
    });

    it('deve aplicar a mesma regra nas rotas filhas', () => {
        tokenServiceMock.possuiToken.and.returnValue(false);

        const resultado = guard.canActivateChild(
            criarRouteSnapshot(),
            routerStateSnapshot
        );

        expect(resultado).toBeTrue();

        expect(tokenServiceMock.possuiToken)
            .toHaveBeenCalled();
    });

    function criarRouteSnapshot(
        returnUrl?: string
    ): ActivatedRouteSnapshot {
        return {
            queryParamMap:
                convertToParamMap(
                    returnUrl
                        ? {
                            returnUrl
                        }
                        : {}
                )
        } as ActivatedRouteSnapshot;
    }
});
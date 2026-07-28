import { TestBed } from '@angular/core/testing';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot
} from '@angular/router';

import { TokenService } from '@/core/autenticacao/services/token.service';

import { NaoAutenticadoGuard } from './nao-autenticado.guard';

describe('NaoAutenticadoGuard', () => {
    let guard: NaoAutenticadoGuard;
    let routerMock: jasmine.SpyObj<Router>;
    let tokenServiceMock: jasmine.SpyObj<TokenService>;

    const routeSnapshot = {} as ActivatedRouteSnapshot;
    const routerStateSnapshot = {
        url: '/login'
    } as RouterStateSnapshot;

    beforeEach(() => {
        routerMock = jasmine.createSpyObj<Router>(
            'Router',
            ['navigate']
        );

        tokenServiceMock = jasmine.createSpyObj<TokenService>(
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

    it('deve permitir acesso quando não houver token', () => {
        tokenServiceMock.possuiToken.and.returnValue(false);

        const resultado = guard.canActivate(
            routeSnapshot,
            routerStateSnapshot
        );

        expect(resultado).toBeTrue();
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('deve bloquear acesso e redirecionar quando houver token', () => {
        tokenServiceMock.possuiToken.and.returnValue(true);

        const resultado = guard.canActivate(
            routeSnapshot,
            routerStateSnapshot
        );

        expect(resultado).toBeFalse();
        expect(routerMock.navigate).toHaveBeenCalledOnceWith(['/']);
    });

    it('deve aplicar a mesma regra nas rotas filhas', () => {
        tokenServiceMock.possuiToken.and.returnValue(false);

        const resultado = guard.canActivateChild(
            routeSnapshot,
            routerStateSnapshot
        );

        expect(resultado).toBeTrue();
        expect(tokenServiceMock.possuiToken).toHaveBeenCalled();
    });
});
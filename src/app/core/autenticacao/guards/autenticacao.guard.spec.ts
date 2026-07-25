import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';

import {AutenticacaoGuard} from './autenticacao.guard';
import {UsuarioAutenticadoService} from '@/core/autenticacao/services/usuario-autenticado.service';

describe('AutenticacaoGuard', () => {
    const routerMock = {
        navigate: jasmine.createSpy('navigate')
    };

    const usuarioAutenticadoServiceMock = {
        estaLogado: jasmine.createSpy('estaLogado')
    };

    beforeEach(() => {
        routerMock.navigate.calls.reset();
        usuarioAutenticadoServiceMock.estaLogado.calls.reset();

        TestBed.configureTestingModule({
            providers: [
                {provide: Router, useValue: routerMock},
                {provide: UsuarioAutenticadoService, useValue: usuarioAutenticadoServiceMock}
            ]
        });
    });

    it('should allow access when user is logged in', () => {
        usuarioAutenticadoServiceMock.estaLogado.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() => AutenticacaoGuard());

        expect(result).toBeTrue();
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to login when user is not logged in', () => {
        usuarioAutenticadoServiceMock.estaLogado.and.returnValue(false);

        const result = TestBed.runInInjectionContext(() => AutenticacaoGuard());

        expect(result).toBeFalse();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
});
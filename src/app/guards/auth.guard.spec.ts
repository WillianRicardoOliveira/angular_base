import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';

import {AuthGuard} from './auth.guard';
import {UserService} from '@services/user/user.service';

describe('AuthGuard', () => {
    const routerMock = {
        navigate: jasmine.createSpy('navigate')
    };

    const userServiceMock = {
        estaLogado: jasmine.createSpy('estaLogado')
    };

    beforeEach(() => {
        routerMock.navigate.calls.reset();
        userServiceMock.estaLogado.calls.reset();

        TestBed.configureTestingModule({
            providers: [
                {provide: Router, useValue: routerMock},
                {provide: UserService, useValue: userServiceMock}
            ]
        });
    });

    it('should allow access when user is logged in', () => {
        userServiceMock.estaLogado.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() => AuthGuard());

        expect(result).toBeTrue();
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to login when user is not logged in', () => {
        userServiceMock.estaLogado.and.returnValue(false);

        const result = TestBed.runInInjectionContext(() => AuthGuard());

        expect(result).toBeFalse();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
});
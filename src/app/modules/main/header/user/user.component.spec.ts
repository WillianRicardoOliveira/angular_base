import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UsuarioAutenticadoService } from '@/core/autenticacao/services/usuario-autenticado.service';

import { UserComponent } from './user.component';

describe('UserComponent', () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;
    let usuarioAutenticadoServiceMock: jasmine.SpyObj<UsuarioAutenticadoService>;
    let routerMock: jasmine.SpyObj<Router>;

    beforeEach(
        waitForAsync(() => {
            usuarioAutenticadoServiceMock = jasmine.createSpyObj<UsuarioAutenticadoService>('UsuarioAutenticadoService', [
                'logout'
            ]);
            routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

            TestBed.configureTestingModule({
                declarations: [UserComponent],
                providers: [
                    { provide: UsuarioAutenticadoService, useValue: usuarioAutenticadoServiceMock },
                    { provide: Router, useValue: routerMock }
                ],
                schemas: [NO_ERRORS_SCHEMA]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should build initials from the user name', () => {
        expect(component.userInitials).toBe('WO');
    });

    it('should logout and redirect to login', () => {
        component.logout();

        expect(usuarioAutenticadoServiceMock.logout).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { LoginService } from '@services/site/login/login.service';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    const loginServiceMock = {
        login: jasmine.createSpy('login').and.returnValue(of({}))
    };

    const routerMock = {
        navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    const toastrMock = {
        error: jasmine.createSpy('error'),
        info: jasmine.createSpy('info')
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                ReactiveFormsModule,
                NoopAnimationsModule,
                MatButtonModule,
                MatCardModule,
                MatFormFieldModule,
                MatInputModule
            ],
            providers: [
                { provide: LoginService, useValue: loginServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: ToastrService, useValue: toastrMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        loginServiceMock.login.calls.reset();
        loginServiceMock.login.and.returnValue(of({}));
        routerMock.navigateByUrl.calls.reset();
        toastrMock.error.calls.reset();
        toastrMock.info.calls.reset();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should login and redirect when form is valid', () => {
        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(loginServiceMock.login).toHaveBeenCalledWith('usuario@teste.com', '123456');
        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should show an error when login fails', () => {
        loginServiceMock.login.and.returnValue(throwError(() => new Error('login error')));

        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(toastrMock.error).toHaveBeenCalled();
    });

    it('should toggle password visibility', () => {
        expect(component.isPasswordVisible).toBeFalse();

        component.togglePasswordVisibility();

        expect(component.isPasswordVisible).toBeTrue();
    });

    it('should inform when Microsoft login is not configured', () => {
        component.loginWithMicrosoft();

        expect(toastrMock.info).toHaveBeenCalled();
    });
});
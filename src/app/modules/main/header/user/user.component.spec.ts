import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
    ComponentFixture,
    TestBed,
    waitForAsync
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AutenticacaoService } from '@/core/autenticacao/services/autenticacao.service';

import { UserComponent } from './user.component';

describe('UserComponent', () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;

    let autenticacaoServiceMock:
        jasmine.SpyObj<AutenticacaoService>;

    let routerMock:
        jasmine.SpyObj<Router>;

    beforeEach(
        waitForAsync(() => {
            autenticacaoServiceMock =
                jasmine.createSpyObj<AutenticacaoService>(
                    'AutenticacaoService',
                    ['logout']
                );

            routerMock = jasmine.createSpyObj<Router>(
                'Router',
                ['navigate']
            );

            TestBed.configureTestingModule({
                declarations: [UserComponent],
                providers: [
                    {
                        provide: AutenticacaoService,
                        useValue: autenticacaoServiceMock
                    },
                    {
                        provide: Router,
                        useValue: routerMock
                    }
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

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it('deve criar as iniciais do nome do usuário', () => {
        expect(component.userInitials).toBe('WO');
    });

    it('deve executar logout e redirecionar para o login', () => {
        autenticacaoServiceMock.logout.and.returnValue(
            of(undefined)
        );

        component.logout();

        expect(
            autenticacaoServiceMock.logout
        ).toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).toHaveBeenCalledOnceWith(['/login']);
    });

    it('deve redirecionar para o login quando o logout falhar', () => {
        autenticacaoServiceMock.logout.and.returnValue(
            throwError(() => new Error('Falha no logout'))
        );

        component.logout();

        expect(
            autenticacaoServiceMock.logout
        ).toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).toHaveBeenCalledOnceWith(['/login']);
    });
});
import {
    NO_ERRORS_SCHEMA
} from '@angular/core';
import {
    ComponentFixture,
    fakeAsync,
    flushMicrotasks,
    TestBed,
    waitForAsync
} from '@angular/core/testing';
import {
    Router
} from '@angular/router';
import {
    of,
    throwError
} from 'rxjs';

import {
    AutenticacaoService
} from '@/core/autenticacao/services/autenticacao.service';
import {
    MicrosoftSsoService
} from '@/core/autenticacao/services/microsoft-sso.service';
import {
    UsuarioAutenticadoService
} from '@/core/autenticacao/services/usuario-autenticado.service';

import {
    UserComponent
} from './user.component';

describe('UserComponent', () => {
    let component: UserComponent;

    let fixture:
        ComponentFixture<UserComponent>;

    let autenticacaoServiceMock:
        jasmine.SpyObj<AutenticacaoService>;

    let microsoftSsoServiceMock:
        jasmine.SpyObj<MicrosoftSsoService>;

    let usuarioAutenticadoServiceMock:
        jasmine.SpyObj<UsuarioAutenticadoService>;

    let routerMock:
        jasmine.SpyObj<Router>;

    beforeEach(
        waitForAsync(() => {
            autenticacaoServiceMock =
                jasmine.createSpyObj<AutenticacaoService>(
                    'AutenticacaoService',
                    ['logout']
                );

            microsoftSsoServiceMock =
                jasmine.createSpyObj<MicrosoftSsoService>(
                    'MicrosoftSsoService',
                    ['limparCacheLocal']
                );

            usuarioAutenticadoServiceMock =
                jasmine.createSpyObj<UsuarioAutenticadoService>(
                    'UsuarioAutenticadoService',
                    ['retornarUser']
                );

            usuarioAutenticadoServiceMock
                .retornarUser
                .and.returnValue(
                    of({
                        id: 1,
                        sub:
                            'willian.oliveira@alta-brasil.com',
                        jti: 'jti-token',
                        iss: 'spring-base',
                        exp: 9999999999
                    })
                );

            microsoftSsoServiceMock
                .limparCacheLocal
                .and.returnValue(
                    Promise.resolve()
                );

            routerMock =
                jasmine.createSpyObj<Router>(
                    'Router',
                    ['navigate']
                );

            TestBed.configureTestingModule({
                declarations: [
                    UserComponent
                ],
                providers: [
                    {
                        provide:
                            AutenticacaoService,
                        useValue:
                            autenticacaoServiceMock
                    },
                    {
                        provide:
                            MicrosoftSsoService,
                        useValue:
                            microsoftSsoServiceMock
                    },
                    {
                        provide:
                            UsuarioAutenticadoService,
                        useValue:
                            usuarioAutenticadoServiceMock
                    },
                    {
                        provide: Router,
                        useValue: routerMock
                    }
                ],
                schemas: [
                    NO_ERRORS_SCHEMA
                ]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture =
            TestBed.createComponent(
                UserComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it('deve exibir os dados do usuário autenticado', () => {
        expect(
            usuarioAutenticadoServiceMock
                .retornarUser
        ).toHaveBeenCalledTimes(1);

        expect(
            component.userEmail
        ).toBe(
            'willian.oliveira@alta-brasil.com'
        );

        expect(
            component.userName
        ).toBe(
            'Willian Oliveira'
        );

        expect(
            component.userInitials
        ).toBe('WO');
    });

    it('deve usar identificação segura quando não houver usuário', () => {
        component.userEmail = '';
        component.userName = 'Usuário';

        expect(
            component.userInitials
        ).toBe('U');
    });

    it('deve executar logout, limpar o MSAL e redirecionar', fakeAsync(() => {
        autenticacaoServiceMock
            .logout
            .and.returnValue(
                of(undefined)
            );

        component.logout();

        flushMicrotasks();

        expect(
            autenticacaoServiceMock.logout
        ).toHaveBeenCalledTimes(1);

        expect(
            microsoftSsoServiceMock
                .limparCacheLocal
        ).toHaveBeenCalledTimes(1);

        expect(
            routerMock.navigate
        ).toHaveBeenCalledOnceWith(
            ['/login']
        );
    }));

    it('deve limpar o MSAL e redirecionar quando o logout do backend falhar', fakeAsync(() => {
        autenticacaoServiceMock
            .logout
            .and.returnValue(
                throwError(
                    () =>
                        new Error(
                            'Falha no logout'
                        )
                )
            );

        component.logout();

        flushMicrotasks();

        expect(
            autenticacaoServiceMock.logout
        ).toHaveBeenCalledTimes(1);

        expect(
            microsoftSsoServiceMock
                .limparCacheLocal
        ).toHaveBeenCalledTimes(1);

        expect(
            routerMock.navigate
        ).toHaveBeenCalledOnceWith(
            ['/login']
        );
    }));

    it('deve redirecionar mesmo quando a limpeza do MSAL falhar', fakeAsync(() => {
        autenticacaoServiceMock
            .logout
            .and.returnValue(
                of(undefined)
            );

        microsoftSsoServiceMock
            .limparCacheLocal
            .and.returnValue(
                Promise.reject(
                    new Error(
                        'Falha ao limpar MSAL'
                    )
                )
            );

        component.logout();

        flushMicrotasks();

        expect(
            microsoftSsoServiceMock
                .limparCacheLocal
        ).toHaveBeenCalledTimes(1);

        expect(
            routerMock.navigate
        ).toHaveBeenCalledOnceWith(
            ['/login']
        );
    }));
});
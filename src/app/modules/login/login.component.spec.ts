import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import {
    ReactiveFormsModule
} from '@angular/forms';
import {
    Router
} from '@angular/router';
import {
    NoopAnimationsModule
} from '@angular/platform-browser/animations';
import {
    MatButtonModule
} from '@angular/material/button';
import {
    MatCardModule
} from '@angular/material/card';
import {
    MatFormFieldModule
} from '@angular/material/form-field';
import {
    MatInputModule
} from '@angular/material/input';
import {
    ToastrService
} from 'ngx-toastr';
import {
    of,
    throwError
} from 'rxjs';

import {
    AutenticacaoService
} from '@/core/autenticacao/services/autenticacao.service';
import {
    MensagemAutenticacaoService
} from '@/core/autenticacao/services/mensagem-autenticacao.service';
import {
    MicrosoftSsoService
} from '@/core/autenticacao/services/microsoft-sso.service';
import {
    PermissoesUsuarioService
} from '@/core/autorizacao/services/permissoes-usuario.service';

import {
    LoginComponent
} from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    const autenticacaoServiceMock = {
        login: jasmine
            .createSpy('login')
            .and.returnValue(
                of({})
            ),
        loginSso: jasmine
            .createSpy('loginSso')
            .and.returnValue(
                of({})
            ),
        logout: jasmine
            .createSpy('logout')
            .and.returnValue(
                of(undefined)
            )
    };

    const permissoesUsuarioServiceMock = {
        carregarPermissoes: jasmine
            .createSpy('carregarPermissoes')
            .and.returnValue(
                of(undefined)
            )
    };

    const microsoftSsoServiceMock = {
        login: jasmine
            .createSpy('login')
            .and.returnValue(
                of('access-token-microsoft')
            )
    };

    const mensagemAutenticacaoServiceMock = {
        obterMensagemLogin: jasmine.createSpy(
            'obterMensagemLogin'
        ),
        obterMensagemSso: jasmine.createSpy(
            'obterMensagemSso'
        )
    };

    const routerMock = {
        navigateByUrl: jasmine.createSpy(
            'navigateByUrl'
        )
    };

    const toastrMock = {
        error: jasmine.createSpy('error'),
        info: jasmine.createSpy('info')
    };

    beforeEach(async () => {
        mensagemAutenticacaoServiceMock
            .obterMensagemLogin
            .and.returnValue(
                'Não foi possível acessar o sistema. ' +
                'Verifique suas credenciais.'
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemSso
            .and.returnValue(
                'Não foi possível acessar com a Microsoft.'
            );

        await TestBed.configureTestingModule({
            declarations: [
                LoginComponent
            ],
            imports: [
                ReactiveFormsModule,
                NoopAnimationsModule,
                MatButtonModule,
                MatCardModule,
                MatFormFieldModule,
                MatInputModule
            ],
            providers: [
                {
                    provide: AutenticacaoService,
                    useValue: autenticacaoServiceMock
                },
                {
                    provide: PermissoesUsuarioService,
                    useValue:
                        permissoesUsuarioServiceMock
                },
                {
                    provide: MicrosoftSsoService,
                    useValue: microsoftSsoServiceMock
                },
                {
                    provide:
                        MensagemAutenticacaoService,
                    useValue:
                        mensagemAutenticacaoServiceMock
                },
                {
                    provide: Router,
                    useValue: routerMock
                },
                {
                    provide: ToastrService,
                    useValue: toastrMock
                }
            ]
        }).compileComponents();

        fixture =
            TestBed.createComponent(
                LoginComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    afterEach(() => {
        autenticacaoServiceMock
            .login
            .calls
            .reset();

        autenticacaoServiceMock
            .login
            .and.returnValue(
                of({})
            );

        autenticacaoServiceMock
            .loginSso
            .calls
            .reset();

        autenticacaoServiceMock
            .loginSso
            .and.returnValue(
                of({})
            );

        autenticacaoServiceMock
            .logout
            .calls
            .reset();

        autenticacaoServiceMock
            .logout
            .and.returnValue(
                of(undefined)
            );

        permissoesUsuarioServiceMock
            .carregarPermissoes
            .calls
            .reset();

        permissoesUsuarioServiceMock
            .carregarPermissoes
            .and.returnValue(
                of(undefined)
            );

        microsoftSsoServiceMock
            .login
            .calls
            .reset();

        microsoftSsoServiceMock
            .login
            .and.returnValue(
                of('access-token-microsoft')
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemLogin
            .calls
            .reset();

        mensagemAutenticacaoServiceMock
            .obterMensagemLogin
            .and.returnValue(
                'Não foi possível acessar o sistema. ' +
                'Verifique suas credenciais.'
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemSso
            .calls
            .reset();

        mensagemAutenticacaoServiceMock
            .obterMensagemSso
            .and.returnValue(
                'Não foi possível acessar com a Microsoft.'
            );

        routerMock
            .navigateByUrl
            .calls
            .reset();

        toastrMock
            .error
            .calls
            .reset();

        toastrMock
            .info
            .calls
            .reset();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it('deve autenticar, carregar permissões e redirecionar quando o formulário for válido', () => {
        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(
            autenticacaoServiceMock.login
        ).toHaveBeenCalledOnceWith(
            'usuario@teste.com',
            '123456'
        );

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(
            routerMock.navigateByUrl
        ).toHaveBeenCalledOnceWith('/');
    });

    it('deve encerrar a sessão quando as permissões falharem após o login comum', () => {
        const erroPermissoes =
            new Error(
                'Falha ao carregar permissões'
            );

        permissoesUsuarioServiceMock
            .carregarPermissoes
            .and.returnValue(
                throwError(
                    () => erroPermissoes
                )
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemLogin
            .and.returnValue(
                'Não foi possível concluir o acesso ao sistema.'
            );

        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(
            autenticacaoServiceMock.login
        ).toHaveBeenCalledOnceWith(
            'usuario@teste.com',
            '123456'
        );

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(
            autenticacaoServiceMock.logout
        ).toHaveBeenCalledTimes(1);

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemLogin
        ).toHaveBeenCalledOnceWith(
            erroPermissoes
        );

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Não foi possível concluir o acesso ao sistema.'
        );

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();

        expect(
            component.isAuthLoading
        ).toBeFalse();
    });

    it('deve preservar o erro das permissões quando o logout compensatório falhar', () => {
        const erroPermissoes =
            new Error(
                'Falha ao carregar permissões'
            );

        const erroLogout =
            new Error(
                'Falha ao revogar sessão'
            );

        permissoesUsuarioServiceMock
            .carregarPermissoes
            .and.returnValue(
                throwError(
                    () => erroPermissoes
                )
            );

        autenticacaoServiceMock
            .logout
            .and.returnValue(
                throwError(
                    () => erroLogout
                )
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemLogin
            .and.returnValue(
                'Não foi possível concluir o acesso ao sistema.'
            );

        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(
            autenticacaoServiceMock.logout
        ).toHaveBeenCalledTimes(1);

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemLogin
        ).toHaveBeenCalledOnceWith(
            erroPermissoes
        );

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemLogin
        ).not.toHaveBeenCalledWith(
            erroLogout
        );

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Não foi possível concluir o acesso ao sistema.'
        );

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();

        expect(
            component.isAuthLoading
        ).toBeFalse();
    });

    it('não deve autenticar quando o formulário for inválido', () => {
        component.loginForm.setValue({
            email: 'email-invalido',
            senha: ''
        });

        component.login();

        expect(
            autenticacaoServiceMock.login
        ).not.toHaveBeenCalled();

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();
    });

    it('não deve iniciar outro login enquanto houver autenticação em andamento', () => {
        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.isAuthLoading = true;

        component.login();

        expect(
            autenticacaoServiceMock.login
        ).not.toHaveBeenCalled();

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();
    });

    it('deve exibir a mensagem segura retornada pelo serviço', () => {
        const erroLogin =
            new Error(
                'Erro interno que não deve ser exibido'
            );

        autenticacaoServiceMock
            .login
            .and.returnValue(
                throwError(() => erroLogin)
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemLogin
            .and.returnValue(
                'Não foi possível acessar o sistema. ' +
                'Verifique suas credenciais.'
            );

        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemLogin
        ).toHaveBeenCalledOnceWith(
            erroLogin
        );

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Não foi possível acessar o sistema. ' +
            'Verifique suas credenciais.'
        );
    });

    it('deve exibir mensagem de login temporariamente bloqueado', () => {
        const erroBloqueio =
            new Error('Login bloqueado');

        autenticacaoServiceMock
            .login
            .and.returnValue(
                throwError(() => erroBloqueio)
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemLogin
            .and.returnValue(
                'Login temporariamente bloqueado. ' +
                'Tente novamente mais tarde.'
            );

        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemLogin
        ).toHaveBeenCalledOnceWith(
            erroBloqueio
        );

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Login temporariamente bloqueado. ' +
            'Tente novamente mais tarde.'
        );
    });

    it('deve restaurar o estado de carregamento após sucesso', () => {
        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(
            component.isAuthLoading
        ).toBeFalse();
    });

    it('deve restaurar o estado de carregamento após erro', () => {
        autenticacaoServiceMock
            .login
            .and.returnValue(
                throwError(
                    () => new Error('Erro')
                )
            );

        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(
            component.isAuthLoading
        ).toBeFalse();
    });

    it('deve alternar a visibilidade da senha', () => {
        expect(
            component.isPasswordVisible
        ).toBeFalse();

        component.togglePasswordVisibility();

        expect(
            component.isPasswordVisible
        ).toBeTrue();

        component.togglePasswordVisibility();

        expect(
            component.isPasswordVisible
        ).toBeFalse();
    });

    it('deve informar quando a recuperação de senha não estiver configurada', () => {
        component.recoverPassword();

        expect(
            toastrMock.info
        ).toHaveBeenCalledOnceWith(
            'Recuperação de senha ainda não configurada.'
        );
    });

    it('deve autenticar pela Microsoft, carregar permissões e redirecionar', () => {
        component.loginWithMicrosoft();

        expect(
            microsoftSsoServiceMock.login
        ).toHaveBeenCalledTimes(1);

        expect(
            autenticacaoServiceMock.loginSso
        ).toHaveBeenCalledOnceWith(
            'access-token-microsoft'
        );

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(
            routerMock.navigateByUrl
        ).toHaveBeenCalledOnceWith('/');
    });

    it('deve encerrar a sessão quando as permissões falharem após o login Microsoft', () => {
        const erroPermissoes =
            new Error(
                'Falha ao carregar permissões'
            );

        permissoesUsuarioServiceMock
            .carregarPermissoes
            .and.returnValue(
                throwError(
                    () => erroPermissoes
                )
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemSso
            .and.returnValue(
                'Não foi possível concluir o acesso corporativo.'
            );

        component.loginWithMicrosoft();

        expect(
            microsoftSsoServiceMock.login
        ).toHaveBeenCalledTimes(1);

        expect(
            autenticacaoServiceMock.loginSso
        ).toHaveBeenCalledOnceWith(
            'access-token-microsoft'
        );

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(
            autenticacaoServiceMock.logout
        ).toHaveBeenCalledTimes(1);

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemSso
        ).toHaveBeenCalledOnceWith(
            erroPermissoes
        );

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Não foi possível concluir o acesso corporativo.'
        );

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();

        expect(
            component.isAuthLoading
        ).toBeFalse();
    });

    it('não deve iniciar outro login Microsoft enquanto houver autenticação em andamento', () => {
        component.isAuthLoading = true;

        component.loginWithMicrosoft();

        expect(
            microsoftSsoServiceMock.login
        ).not.toHaveBeenCalled();

        expect(
            autenticacaoServiceMock.loginSso
        ).not.toHaveBeenCalled();

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();
    });

    it('deve tratar erro ao autenticar com a Microsoft', () => {
        const erroMicrosoft =
            new Error(
                'Falha interna do provedor'
            );

        microsoftSsoServiceMock
            .login
            .and.returnValue(
                throwError(
                    () => erroMicrosoft
                )
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemSso
            .and.returnValue(
                'Não foi possível acessar com a Microsoft.'
            );

        component.loginWithMicrosoft();

        expect(
            autenticacaoServiceMock.loginSso
        ).not.toHaveBeenCalled();

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemSso
        ).toHaveBeenCalledOnceWith(
            erroMicrosoft
        );

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Não foi possível acessar com a Microsoft.'
        );

        expect(
            component.isAuthLoading
        ).toBeFalse();

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();
    });

    it('deve tratar token SSO rejeitado pelo backend', () => {
        const erroBackend = {
            status: 401,
            error: {
                status: 401,
                erro: 'SSO_INVALIDO',
                mensagem:
                    'Detalhe interno que não deve ser exibido'
            }
        };

        autenticacaoServiceMock
            .loginSso
            .and.returnValue(
                throwError(
                    () => erroBackend
                )
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemSso
            .and.returnValue(
                'Não foi possível validar o acesso corporativo.'
            );

        component.loginWithMicrosoft();

        expect(
            microsoftSsoServiceMock.login
        ).toHaveBeenCalledTimes(1);

        expect(
            autenticacaoServiceMock.loginSso
        ).toHaveBeenCalledOnceWith(
            'access-token-microsoft'
        );

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemSso
        ).toHaveBeenCalledOnceWith(
            erroBackend
        );

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Não foi possível validar o acesso corporativo.'
        );

        expect(
            component.isAuthLoading
        ).toBeFalse();

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();
    });
});
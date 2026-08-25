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
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

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

    const contextoOrganizacaoServiceMock = {
        carregarESelecionarPadrao: jasmine
            .createSpy('carregarESelecionarPadrao')
            .and.returnValue(
                of({
                    id: 1,
                    nome: 'Matriz'
                })
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
                'Nao foi possivel acessar o sistema. ' +
                'Verifique suas credenciais.'
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemSso
            .and.returnValue(
                'Nao foi possivel acessar com a Microsoft.'
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
                    provide: ContextoOrganizacaoService,
                    useValue:
                        contextoOrganizacaoServiceMock
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

        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .calls
            .reset();

        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .and.returnValue(
                of({
                    id: 1,
                    nome: 'Matriz'
                })
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
                'Nao foi possivel acessar o sistema. ' +
                'Verifique suas credenciais.'
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemSso
            .calls
            .reset();

        mensagemAutenticacaoServiceMock
            .obterMensagemSso
            .and.returnValue(
                'Nao foi possivel acessar com a Microsoft.'
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

    it('deve autenticar, carregar contexto, carregar permissoes e redirecionar quando o formulario for valido', () => {
        const ordemExecucao: string[] = [];

        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .and.callFake(() => {
                ordemExecucao.push('contexto');

                return of({
                    id: 1,
                    nome: 'Matriz'
                });
            });

        permissoesUsuarioServiceMock
            .carregarPermissoes
            .and.callFake(() => {
                ordemExecucao.push('permissoes');

                return of(undefined);
            });

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
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(ordemExecucao).toEqual([
            'contexto',
            'permissoes'
        ]);

        expect(
            routerMock.navigateByUrl
        ).toHaveBeenCalledOnceWith('/');
    });

    it('deve encerrar a sessao quando as permissoes falharem apos o login comum', () => {
        const erroPermissoes =
            new Error(
                'Falha ao carregar permissoes'
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
                'Nao foi possivel concluir o acesso ao sistema.'
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
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);

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
            'Nao foi possivel concluir o acesso ao sistema.'
        );

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();

        expect(
            component.isAuthLoading
        ).toBeFalse();
    });

    it('deve encerrar a sessao quando o contexto falhar apos o login comum', () => {
        const erroContexto =
            new Error(
                'Falha ao carregar contexto'
            );

        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .and.returnValue(
                throwError(
                    () => erroContexto
                )
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemLogin
            .and.returnValue(
                'Nao foi possivel concluir o acesso ao sistema.'
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
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();

        expect(
            autenticacaoServiceMock.logout
        ).toHaveBeenCalledTimes(1);

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemLogin
        ).toHaveBeenCalledOnceWith(
            erroContexto
        );

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Nao foi possivel concluir o acesso ao sistema.'
        );

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();

        expect(
            component.isAuthLoading
        ).toBeFalse();
    });

    it('deve preservar o erro das permissoes quando o logout compensatorio falhar', () => {
        const erroPermissoes =
            new Error(
                'Falha ao carregar permissoes'
            );

        const erroLogout =
            new Error(
                'Falha ao revogar sessao'
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
                'Nao foi possivel concluir o acesso ao sistema.'
            );

        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);

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
            'Nao foi possivel concluir o acesso ao sistema.'
        );

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();

        expect(
            component.isAuthLoading
        ).toBeFalse();
    });

    it('nao deve autenticar quando o formulario for invalido', () => {
        component.loginForm.setValue({
            email: 'email-invalido',
            senha: ''
        });

        component.login();

        expect(
            autenticacaoServiceMock.login
        ).not.toHaveBeenCalled();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).not.toHaveBeenCalled();

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();
    });

    it('nao deve iniciar outro login enquanto houver autenticacao em andamento', () => {
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
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).not.toHaveBeenCalled();

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();
    });

    it('deve exibir a mensagem segura retornada pelo servico', () => {
        const erroLogin =
            new Error(
                'Erro interno que nao deve ser exibido'
            );

        autenticacaoServiceMock
            .login
            .and.returnValue(
                throwError(() => erroLogin)
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemLogin
            .and.returnValue(
                'Nao foi possivel acessar o sistema. ' +
                'Verifique suas credenciais.'
            );

        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).not.toHaveBeenCalled();

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
            'Nao foi possivel acessar o sistema. ' +
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
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).not.toHaveBeenCalled();

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

    it('deve restaurar o estado de carregamento apos sucesso', () => {
        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(
            component.isAuthLoading
        ).toBeFalse();
    });

    it('deve restaurar o estado de carregamento apos erro', () => {
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

    it('deve informar quando a recuperacao de senha nao estiver configurada', () => {
        component.recoverPassword();

        expect(
            toastrMock.info
        ).toHaveBeenCalledOnceWith(
            'Recuperacao de senha ainda nao configurada.'
        );
    });

    it('deve autenticar pela Microsoft, carregar contexto, carregar permissoes e redirecionar', () => {
        const ordemExecucao: string[] = [];

        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .and.callFake(() => {
                ordemExecucao.push('contexto');

                return of({
                    id: 1,
                    nome: 'Matriz'
                });
            });

        permissoesUsuarioServiceMock
            .carregarPermissoes
            .and.callFake(() => {
                ordemExecucao.push('permissoes');

                return of(undefined);
            });

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
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(ordemExecucao).toEqual([
            'contexto',
            'permissoes'
        ]);

        expect(
            routerMock.navigateByUrl
        ).toHaveBeenCalledOnceWith('/');
    });

    it('deve encerrar a sessao quando as permissoes falharem apos o login Microsoft', () => {
        const erroPermissoes =
            new Error(
                'Falha ao carregar permissoes'
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
                'Nao foi possivel concluir o acesso corporativo.'
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
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);

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
            'Nao foi possivel concluir o acesso corporativo.'
        );

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();

        expect(
            component.isAuthLoading
        ).toBeFalse();
    });

    it('deve encerrar a sessao quando o contexto falhar apos o login Microsoft', () => {
        const erroContexto =
            new Error(
                'Falha ao carregar contexto'
            );

        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .and.returnValue(
                throwError(
                    () => erroContexto
                )
            );

        mensagemAutenticacaoServiceMock
            .obterMensagemSso
            .and.returnValue(
                'Nao foi possivel concluir o acesso corporativo.'
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
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();

        expect(
            autenticacaoServiceMock.logout
        ).toHaveBeenCalledTimes(1);

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemSso
        ).toHaveBeenCalledOnceWith(
            erroContexto
        );

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Nao foi possivel concluir o acesso corporativo.'
        );

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();

        expect(
            component.isAuthLoading
        ).toBeFalse();
    });

    it('nao deve iniciar outro login Microsoft enquanto houver autenticacao em andamento', () => {
        component.isAuthLoading = true;

        component.loginWithMicrosoft();

        expect(
            microsoftSsoServiceMock.login
        ).not.toHaveBeenCalled();

        expect(
            autenticacaoServiceMock.loginSso
        ).not.toHaveBeenCalled();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
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
                'Nao foi possivel acessar com a Microsoft.'
            );

        component.loginWithMicrosoft();

        expect(
            autenticacaoServiceMock.loginSso
        ).not.toHaveBeenCalled();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
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
            'Nao foi possivel acessar com a Microsoft.'
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
                    'Detalhe interno que nao deve ser exibido'
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
                'Nao foi possivel validar o acesso corporativo.'
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
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).not.toHaveBeenCalled();

        expect(
            mensagemAutenticacaoServiceMock
                .obterMensagemSso
        ).toHaveBeenCalledOnceWith(
            erroBackend
        );

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Nao foi possivel validar o acesso corporativo.'
        );

        expect(
            component.isAuthLoading
        ).toBeFalse();

        expect(
            routerMock.navigateByUrl
        ).not.toHaveBeenCalled();
    });
});
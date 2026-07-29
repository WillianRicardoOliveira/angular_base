import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import {
    ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import {
    NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
    MatFormFieldModule
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import {
    of,
    throwError
} from 'rxjs';

import { AutenticacaoService } from '@/core/autenticacao/services/autenticacao.service';
import { MensagemAutenticacaoService } from '@/core/autenticacao/services/mensagem-autenticacao.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    const autenticacaoServiceMock = {
        login: jasmine
            .createSpy('login')
            .and.returnValue(of({}))
    };

    const mensagemAutenticacaoServiceMock = {
        obterMensagemLogin: jasmine.createSpy(
            'obterMensagemLogin'
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

        fixture = TestBed.createComponent(
            LoginComponent
        );

        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    afterEach(() => {
        autenticacaoServiceMock.login.calls.reset();

        autenticacaoServiceMock.login.and.returnValue(
            of({})
        );

        mensagemAutenticacaoServiceMock
            .obterMensagemLogin
            .calls.reset();

        mensagemAutenticacaoServiceMock
            .obterMensagemLogin
            .and.returnValue(
                'Não foi possível acessar o sistema. ' +
                'Verifique suas credenciais.'
            );

        routerMock.navigateByUrl.calls.reset();
        toastrMock.error.calls.reset();
        toastrMock.info.calls.reset();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it('deve autenticar e redirecionar quando o formulário for válido', () => {
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
            routerMock.navigateByUrl
        ).toHaveBeenCalledOnceWith('/');
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
    });

    it('deve exibir a mensagem segura retornada pelo serviço', () => {
        const erroLogin = new Error(
            'Erro interno que não deve ser exibido'
        );

        autenticacaoServiceMock.login.and.returnValue(
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
            mensagemAutenticacaoServiceMock
                .obterMensagemLogin
        ).toHaveBeenCalledOnceWith(erroLogin);

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Não foi possível acessar o sistema. ' +
            'Verifique suas credenciais.'
        );
    });

    it('deve exibir mensagem de login temporariamente bloqueado', () => {
        const erroBloqueio = new Error(
            'Login bloqueado'
        );

        autenticacaoServiceMock.login.and.returnValue(
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
            mensagemAutenticacaoServiceMock
                .obterMensagemLogin
        ).toHaveBeenCalledOnceWith(erroBloqueio);

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

        expect(component.isAuthLoading).toBeFalse();
    });

    it('deve restaurar o estado de carregamento após erro', () => {
        autenticacaoServiceMock.login.and.returnValue(
            throwError(() => new Error('Erro'))
        );

        component.loginForm.setValue({
            email: 'usuario@teste.com',
            senha: '123456'
        });

        component.login();

        expect(component.isAuthLoading).toBeFalse();
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

    it('deve informar quando o login Microsoft não estiver configurado', () => {
        component.loginWithMicrosoft();

        expect(
            toastrMock.info
        ).toHaveBeenCalledOnceWith(
            'Acesso com Microsoft ainda não configurado.'
        );
    });
});
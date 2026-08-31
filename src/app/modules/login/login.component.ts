import {
    Component,
    OnInit
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import {
    ActivatedRoute,
    Router
} from '@angular/router';
import {
    ToastrService
} from 'ngx-toastr';
import {
    catchError,
    finalize,
    Observable,
    of,
    switchMap,
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

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;

    isAuthLoading = false;

    isPasswordVisible = false;

    private returnUrl = '/';

    constructor(
        private formBuilder: FormBuilder,
        private service:
            AutenticacaoService,
        private permissoesUsuarioService:
            PermissoesUsuarioService,
        private contextoOrganizacaoService:
            ContextoOrganizacaoService,
        private microsoftSsoService:
            MicrosoftSsoService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private mensagemAutenticacaoService:
            MensagemAutenticacaoService
    ) {}

    ngOnInit(): void {
        this.returnUrl =
            this.normalizarReturnUrl(
                this.route.snapshot
                    .queryParamMap
                    .get('returnUrl')
            );

        this.loginForm =
            this.formBuilder.group({
                email: [
                    null,
                    [
                        Validators.required,
                        Validators.email
                    ]
                ],
                senha: [
                    null,
                    Validators.required
                ]
            });
    }

    login(): void {
        if (
            this.loginForm.invalid ||
            this.isAuthLoading
        ) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const {
            email,
            senha
        } =
            this.loginForm.getRawValue();

        this.isAuthLoading = true;

        this.service
            .login(
                email,
                senha
            )
            .pipe(
                switchMap(() =>
                    this.carregarPermissoesAposLogin()
                ),
                finalize(() => {
                    this.isAuthLoading = false;
                })
            )
            .subscribe({
                next: () => {
                    this.router
                        .navigateByUrl(
                            this.returnUrl
                        );
                },
                error: (erro: unknown) => {
                    const mensagem =
                        this.mensagemAutenticacaoService
                            .obterMensagemLogin(
                                erro
                            );

                    this.toastr.error(
                        mensagem
                    );
                }
            });
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible =
            !this.isPasswordVisible;
    }

    recoverPassword(): void {
        this.toastr.info(
            'Recuperacao de senha ainda nao configurada.'
        );
    }

    loginWithMicrosoft(): void {
        if (this.isAuthLoading) {
            return;
        }

        this.isAuthLoading = true;

        this.microsoftSsoService
            .login()
            .pipe(
                switchMap(
                    (tokenMicrosoft) =>
                        this.service
                            .loginSso(
                                tokenMicrosoft
                            )
                ),
                switchMap(() =>
                    this.carregarPermissoesAposLogin()
                ),
                finalize(() => {
                    this.isAuthLoading = false;
                })
            )
            .subscribe({
                next: () => {
                    this.router
                        .navigateByUrl(
                            this.returnUrl
                        );
                },
                error: (erro: unknown) => {
                    const mensagem =
                        this.mensagemAutenticacaoService
                            .obterMensagemSso(
                                erro
                            );

                    this.toastr.error(
                        mensagem
                    );
                }
            });
    }

    private normalizarReturnUrl(
        returnUrl: string | null
    ): string {
        const url =
            returnUrl?.trim() ?? '';

        if (
            !url ||
            !url.startsWith('/') ||
            url.startsWith('//') ||
            url.startsWith('/login')
        ) {
            return '/';
        }

        return url;
    }

    private carregarPermissoesAposLogin():
        Observable<void> {
        return this.contextoOrganizacaoService
            .carregarESelecionarPadrao()
            .pipe(
                switchMap(() =>
                    this.permissoesUsuarioService
                        .carregarPermissoes()
                ),
                catchError(
                    (erro: unknown) =>
                        this.service
                            .logout()
                            .pipe(
                                catchError(() =>
                                    of(undefined)
                                ),
                                switchMap(() =>
                                    throwError(
                                        () => erro
                                    )
                                )
                            )
                )
            );
    }
}
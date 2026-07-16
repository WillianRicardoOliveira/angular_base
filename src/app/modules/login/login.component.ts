import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '@services/site/login/login.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

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

    constructor(
        private formBuilder: FormBuilder,
        private service: LoginService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: [null, [Validators.required, Validators.email]],
            senha: [null, Validators.required]
        });
    }

    login(): void {
        if (this.loginForm.invalid || this.isAuthLoading) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const { email, senha } = this.loginForm.getRawValue();

        this.isAuthLoading = true;

        this.service
            .login(email, senha)
            .pipe(
                finalize(() => {
                    this.isAuthLoading = false;
                })
            )
            .subscribe({
                next: () => {
                    this.router.navigateByUrl('/');
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível acessar o sistema. Verifique suas credenciais.'
                    );
                }
            });
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    recoverPassword(): void {
        this.toastr.info(
            'Recuperação de senha ainda não configurada.'
        );
    }

    loginWithMicrosoft(): void {
        this.toastr.info(
            'Acesso com Microsoft ainda não configurado.'
        );
    }
}
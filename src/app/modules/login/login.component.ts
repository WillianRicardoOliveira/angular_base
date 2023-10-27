import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding
} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AppService} from '@services/app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'login-box';
    //public loginForm: UntypedFormGroup;
    public loginForm: FormGroup;




    public isAuthLoading = false;
    public isGoogleLoading = false;
    public isFacebookLoading = false;

    constructor(
        private formBuilder: FormBuilder,
        private appService: AppService,
        private router: Router,


        private renderer: Renderer2,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.renderer.addClass(
            document.querySelector('app-root'),
            'login-page'
        );
        this.loginForm = this.formBuilder.group({
            usuario:[null, Validators.required],
            senha:[null, Validators.required]
        })

    }

    async loginByAuth() {
        if (this.loginForm.valid) {

            const usuario = this.loginForm.value.usuario
            const senha = this.loginForm.value.senha

            this.isAuthLoading = true;
            
            this.appService.autenticacao(usuario, senha).subscribe({
                next: (value) => {
                    this.router.navigateByUrl("/")
                },
                error: (err) => {
                    console.log("Erro no login", err)
                }
            })

            this.isAuthLoading = false;
        } else {
            this.toastr.error('Form is not valid!');
        }
    }

    async loginByGoogle() {
        this.isGoogleLoading = true;
        await this.appService.loginByGoogle();
        this.isGoogleLoading = false;
    }

    async loginByFacebook() {
        this.isFacebookLoading = true;
        await this.appService.loginByFacebook();
        this.isFacebookLoading = false;
    }

    ngOnDestroy() {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }
}

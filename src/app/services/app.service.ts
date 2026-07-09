import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public user: any = null;

    constructor(private router: Router, private toastr: ToastrService) {}

    async loginByAuth({email, password}) {
    this.toastr.error('Login legado desativado.');
    }

    async registerByAuth({email, password}) {
        this.toastr.error('Cadastro legado desativado.');
    }

    async loginByGoogle() {
        this.toastr.error('Login Google legado desativado.');
    }

    async registerByGoogle() {
        this.toastr.error('Cadastro Google legado desativado.');
    }

    async loginByFacebook() {
        this.toastr.error('Login Facebook legado desativado.');
    }

    async registerByFacebook() {
        this.toastr.error('Cadastro Facebook legado desativado.');
    }

    async getProfile() {
        return this.user;
    }

    logout() {
        localStorage.removeItem('token');
        this.user = null;
        this.router.navigate(['/login']);
    }
}
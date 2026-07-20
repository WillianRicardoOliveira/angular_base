import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '@services/user/user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    standalone: false
})
export class UserComponent {
    readonly userName = 'Usuario';
    readonly userDescription = 'ERP';

    constructor(
        private userService: UserService,
        private router: Router
    ) {}

    logout() {
        this.userService.logout();
        this.router.navigate(['/login']);
    }
}
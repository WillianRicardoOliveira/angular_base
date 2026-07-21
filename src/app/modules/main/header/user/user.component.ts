import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@services/user/user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    standalone: false
})
export class UserComponent {
    readonly userName = 'Willian Oliveira';
    readonly userEmail = 'willian.oliveira@alta-brasil.com';

    get userInitials(): string {
        return this.userName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((name) => name.charAt(0).toUpperCase())
            .join('');
    }

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    logout() {
        this.userService.logout();
        this.router.navigate(['/login']);
    }
}
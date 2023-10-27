import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-header-site',
  templateUrl: './header-site.component.html',
  styleUrls: ['./header-site.component.scss']
})
export class HeaderSiteComponent {

  constructor(
    private userService: UserService,
    private router: Router
    ) {}

  user$ = this.userService.retornarUser()

  logout() {
    this.userService.logout()
    this.router.navigate(["/"])
  }

}

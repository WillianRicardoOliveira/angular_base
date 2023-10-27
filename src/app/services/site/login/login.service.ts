import { Injectable } from '@angular/core';
import { BaseService } from '@services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private service: BaseService) {}

  login(email: string, senha: string) {
    return this.service.login("login", {email, senha})
  }

}

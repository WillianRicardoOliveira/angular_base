import { PessoaUsuario } from '@/interfaces/interfaces';
import { Injectable } from '@angular/core';
import { TokenService } from '@services/token/token.service';
import { BehaviorSubject } from 'rxjs';
import jwt_decode from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<PessoaUsuario | null>(null)

  constructor(private tokenService: TokenService) { 
    if(this.tokenService.possuiToken()) {
      this.decodificarJWT()
    }
  }

  decodificarJWT() {
    const token = this.tokenService.retornarToken()
    const user = jwt_decode(token) as PessoaUsuario
    this.userSubject.next(user)
  }

  retornarUser() {
    return this.userSubject.asObservable()
  }

  retornarToken() {
    return this.tokenService.retornarToken()
  }

  salvarToken(token: string) {
    this.tokenService.salvarToken(token)
    this.decodificarJWT()
  }

  logout() {
    this.tokenService.excluirToken()
    this.userSubject.next(null)
  }

  estaLogado() {
    return this.tokenService.possuiToken()
  }

}

import { PessoaUsuario } from '@/interfaces/interfaces';
import { TokenJwt } from '@/core/autenticacao/models/token-jwt.model';
import { Injectable } from '@angular/core';
import { TokenService } from '@/core/autenticacao/services/token.service';
import { BehaviorSubject } from 'rxjs';
import jwt_decode from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class UsuarioAutenticadoService {

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

  salvarTokens(tokens: TokenJwt): void {
    this.tokenService.salvarToken(tokens.token);
    this.tokenService.salvarRefreshToken(tokens.refreshToken);
    this.decodificarJWT();
  }

  logout(): void {
    this.tokenService.excluirTokens();
    this.userSubject.next(null);
  }

  estaLogado() {
    return this.tokenService.possuiToken()
  }

}

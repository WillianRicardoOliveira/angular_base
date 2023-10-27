import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '@services/user/user.service';
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
    token: string
}

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private api: string = environment.api
  
  constructor(
    private http: HttpClient,
    private userService: UserService
    ) {}

  login(endPoint: string, dados: any): Observable<HttpResponse<AuthResponse>> {
    return this.http.post<AuthResponse>(`${this.api}/${endPoint}`, dados, { observe: "response" })
        .pipe(
          tap((response) => {
            const authtoken = response.body?.token || ""
            this.userService.salvarToken(authtoken)
          })
        )
  }

  cadastrar(endPoint: string, dados: any): Observable<any> {
    return this.http.post<any>(`${this.api}/${endPoint}`, dados)
  }

  listar(endPoint: string): Observable<any[]> {
    return this.http.get<any>(`${this.api}/${endPoint}`)
  }

  atualizar(endPoint: string, dados: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${endPoint}/${dados.id}`, dados)
  }

  excluir(endPoint: string, id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${endPoint}/${id}`)
  }

  detalhar(endPoint: string, id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${endPoint}/${id}`)
  }

}

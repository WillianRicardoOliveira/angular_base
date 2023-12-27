
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  listar(endPoint: string, page?: number, size?: number, sort?: string, filtro?: string, outroId?: number): Observable<any[]> {
    let params = new HttpParams()
    if(page) {
      params = params.set("page", page)
    }
    if(size) {
      params = params.set("size", size)
    }
    if(sort) {
      params = params.set("sort", sort)
    }
    if(filtro && filtro.length >= 3) {
      params = params.set("filtro", filtro)
    }
    if(outroId) {
      params = params.set("outroId", outroId)
    }
    return this.http.get<any>(`${this.api}/${endPoint}`, { params })
  }

  atualizar(endPoint: string, dados: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${endPoint}`, dados)
  }

  excluir(endPoint: string, id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${endPoint}/${id}`)
  }

  detalhar(endPoint: string, id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${endPoint}/${id}`)
  }

  salvar(endPoint: string, formulario: FormGroup) {
    if(formulario.valid) {
      if(formulario.value.id != "") {
        return this.atualizar(endPoint, formulario.value)
      } else {
        return this.cadastrar(endPoint, formulario.value)
      }
    }
  }

  inativar(endPoint: string, id: number) {
    return this.excluir(endPoint, id)
  }

}

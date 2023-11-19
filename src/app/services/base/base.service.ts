import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
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
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
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
        this.atualizar(endPoint, formulario.value).subscribe(() => {
          this.toastr.success('Atualizado com successo');
        })
      } else {
        this.cadastrar(endPoint, formulario.value).subscribe(() => {
          this.toastr.success('Salvo com successo');
        })
      }
    }
  }

  inativar(endPoint: string, id: number) {
    this.excluir(endPoint, id).subscribe(
      () => {
        this.toastr.success('Inativado com successo');
      }
    )    
  }

}

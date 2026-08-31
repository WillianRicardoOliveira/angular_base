import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UsuarioSubsidiaria } from '@/interfaces/interfaces';
import { environment } from 'environments/environment';

export interface Pagina<T> {
    content: T[];
    totalElements: number;
}

export interface CadastrarUsuarioSubsidiaria {
    idUsuarioEmpresa: number;
    idSubsidiaria: number;
}

@Injectable({
    providedIn: 'root'
})
export class UsuarioSubsidiariaService {

    private readonly api =
        environment.api;

    constructor(
        private readonly http: HttpClient
    ) {}

    listar(
        page?: number,
        size?: number,
        sort?: string,
        idUsuarioEmpresa?: number
    ): Observable<Pagina<UsuarioSubsidiaria>> {
        let params = new HttpParams();

        if (page !== undefined && page !== null) {
            params = params.set('page', page);
        }

        if (size !== undefined && size !== null) {
            params = params.set('size', size);
        }

        if (sort?.trim()) {
            params = params.set('sort', sort.trim());
        }

        if (idUsuarioEmpresa !== undefined && idUsuarioEmpresa !== null) {
            params = params.set('idUsuarioEmpresa', idUsuarioEmpresa);
        }

        return this.http.get<Pagina<UsuarioSubsidiaria>>(
            `${this.api}/acesso/usuario-subsidiaria`,
            { params }
        );
    }

    cadastrar(
        dados: CadastrarUsuarioSubsidiaria
    ): Observable<UsuarioSubsidiaria> {
        return this.http.post<UsuarioSubsidiaria>(
            `${this.api}/acesso/usuario-subsidiaria`,
            dados
        );
    }

    detalhar(id: number): Observable<UsuarioSubsidiaria> {
        return this.http.get<UsuarioSubsidiaria>(
            `${this.api}/acesso/usuario-subsidiaria/${id}`
        );
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.api}/acesso/usuario-subsidiaria/${id}`
        );
    }
}
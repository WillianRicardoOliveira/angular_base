import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UsuarioEstabelecimento } from '@/interfaces/interfaces';
import { environment } from 'environments/environment';

export interface Pagina<T> {
    content: T[];
    totalElements: number;
}

export interface CadastrarUsuarioEstabelecimento {
    idUsuarioEmpresa: number;
    idEstabelecimento: number;
}

@Injectable({
    providedIn: 'root'
})
export class UsuarioEstabelecimentoService {

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
    ): Observable<Pagina<UsuarioEstabelecimento>> {
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

        return this.http.get<Pagina<UsuarioEstabelecimento>>(
            `${this.api}/acesso/usuario-estabelecimento`,
            { params }
        );
    }

    cadastrar(
        dados: CadastrarUsuarioEstabelecimento
    ): Observable<UsuarioEstabelecimento> {
        return this.http.post<UsuarioEstabelecimento>(
            `${this.api}/acesso/usuario-estabelecimento`,
            dados
        );
    }

    detalhar(id: number): Observable<UsuarioEstabelecimento> {
        return this.http.get<UsuarioEstabelecimento>(
            `${this.api}/acesso/usuario-estabelecimento/${id}`
        );
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.api}/acesso/usuario-estabelecimento/${id}`
        );
    }
}
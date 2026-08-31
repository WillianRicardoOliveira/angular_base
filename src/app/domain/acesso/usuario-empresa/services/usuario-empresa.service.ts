import {
    HttpClient,
    HttpParams
} from '@angular/common/http';

import {
    Injectable
} from '@angular/core';

import {
    Observable
} from 'rxjs';

import {
    Empresa,
    UsuarioEmpresa
} from '@/interfaces/interfaces';

import {
    environment
} from 'environments/environment';

export interface Pagina<T> {
    content: T[];
    totalElements: number;
}

export interface CadastrarUsuarioEmpresa {
    idUsuario: number;
    idEmpresa: number;
    todasSubsidiarias: boolean;
}

export interface AtualizarUsuarioEmpresa {
    id: number;
    todasSubsidiarias: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UsuarioEmpresaService {

    private readonly api =
        environment.api;

    constructor(
        private readonly http:
            HttpClient
    ) {}

    listar(
        page?: number,
        size?: number,
        sort?: string,
        idUsuario?: number,
        idEmpresa?: number
    ): Observable<Pagina<UsuarioEmpresa>> {
        let params = new HttpParams();

        if (
            page !== undefined &&
            page !== null
        ) {
            params = params.set(
                'page',
                page
            );
        }

        if (
            size !== undefined &&
            size !== null
        ) {
            params = params.set(
                'size',
                size
            );
        }

        if (sort?.trim()) {
            params = params.set(
                'sort',
                sort.trim()
            );
        }

        if (
            idUsuario !== undefined &&
            idUsuario !== null
        ) {
            params = params.set(
                'idUsuario',
                idUsuario
            );
        }

        if (
            idEmpresa !== undefined &&
            idEmpresa !== null
        ) {
            params = params.set(
                'idEmpresa',
                idEmpresa
            );
        }

        return this.http.get<
            Pagina<UsuarioEmpresa>
        >(
            `${this.api}/acesso/usuario-empresa`,
            {
                params
            }
        );
    }

    listarEmpresas(
        filtro?: string,
        page = 0,
        size = 10
    ): Observable<Pagina<Empresa>> {
        let params = new HttpParams()
            .set(
                'page',
                page
            )
            .set(
                'size',
                size
            )
            .set(
                'sort',
                'nome,asc'
            );

        if (filtro?.trim()) {
            params = params.set(
                'filtro',
                filtro.trim()
            );
        }

        return this.http.get<
            Pagina<Empresa>
        >(
            `${this.api}/acesso/usuario-empresa/empresas`,
            {
                params
            }
        );
    }

    cadastrar(
        dados: CadastrarUsuarioEmpresa
    ): Observable<UsuarioEmpresa> {
        return this.http.post<UsuarioEmpresa>(
            `${this.api}/acesso/usuario-empresa`,
            dados
        );
    }

    atualizar(
        dados: AtualizarUsuarioEmpresa
    ): Observable<UsuarioEmpresa> {
        return this.http.put<UsuarioEmpresa>(
            `${this.api}/acesso/usuario-empresa`,
            dados
        );
    }

    detalhar(
        id: number
    ): Observable<UsuarioEmpresa> {
        return this.http.get<UsuarioEmpresa>(
            `${this.api}/acesso/usuario-empresa/${id}`
        );
    }

    excluir(
        id: number
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.api}/acesso/usuario-empresa/${id}`
        );
    }
}
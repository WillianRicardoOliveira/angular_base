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
    Subsidiaria
} from '@/interfaces/interfaces';

import {
    environment
} from 'environments/environment';

export interface Pagina<T> {
    content: T[];
    totalElements: number;
}

export interface CadastrarSubsidiaria {
    idEmpresa: number;
    nome: string;
}

export interface AtualizarSubsidiaria {
    id: number;
    nome: string;
}

@Injectable({
    providedIn: 'root'
})
export class SubsidiariaService {

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
        filtro?: string,
        idEmpresa?: number
    ): Observable<Pagina<Subsidiaria>> {
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

        if (filtro?.trim()) {
            params = params.set(
                'filtro',
                filtro.trim()
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
            Pagina<Subsidiaria>
        >(
            `${this.api}/configuracao/subsidiaria`,
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
            `${this.api}/configuracao/empresa`,
            {
                params
            }
        );
    }

    cadastrar(
        dados: CadastrarSubsidiaria
    ): Observable<Subsidiaria> {
        return this.http.post<Subsidiaria>(
            `${this.api}/configuracao/subsidiaria`,
            dados
        );
    }

    atualizar(
        dados: AtualizarSubsidiaria
    ): Observable<Subsidiaria> {
        return this.http.put<Subsidiaria>(
            `${this.api}/configuracao/subsidiaria`,
            dados
        );
    }

    detalhar(
        id: number
    ): Observable<Subsidiaria> {
        return this.http.get<Subsidiaria>(
            `${this.api}/configuracao/subsidiaria/${id}`
        );
    }

    excluir(
        id: number
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.api}/configuracao/subsidiaria/${id}`
        );
    }
}
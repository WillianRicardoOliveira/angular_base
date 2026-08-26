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
    OrganizacaoPlataforma
} from '@/interfaces/interfaces';

import {
    environment
} from 'environments/environment';

export interface Pagina<T> {
    content: T[];
    totalElements: number;
}

export interface SalvarOrganizacaoPlataforma {
    nome: string;
}

@Injectable({
    providedIn: 'root'
})
export class OrganizacaoPlataformaService {

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
        filtro?: string
    ): Observable<Pagina<OrganizacaoPlataforma>> {
        let params =
            new HttpParams();

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

        return this.http.get<
            Pagina<OrganizacaoPlataforma>
        >(
            `${this.api}/plataforma/organizacao`,
            {
                params
            }
        );
    }

    detalhar(
        id: number
    ): Observable<OrganizacaoPlataforma> {
        return this.http.get<OrganizacaoPlataforma>(
            `${this.api}/plataforma/organizacao/${id}`
        );
    }

    editar(
        id: number,
        dados: SalvarOrganizacaoPlataforma
    ): Observable<OrganizacaoPlataforma> {
        return this.http.put<OrganizacaoPlataforma>(
            `${this.api}/plataforma/organizacao/${id}`,
            dados
        );
    }

    inativar(
        id: number
    ): Observable<OrganizacaoPlataforma> {
        return this.http.patch<OrganizacaoPlataforma>(
            `${this.api}/plataforma/organizacao/${id}/inativar`,
            null
        );
    }

    reativar(
        id: number
    ): Observable<OrganizacaoPlataforma> {
        return this.http.patch<OrganizacaoPlataforma>(
            `${this.api}/plataforma/organizacao/${id}/reativar`,
            null
        );
    }

    remover(
        id: number
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.api}/plataforma/organizacao/${id}`
        );
    }
}
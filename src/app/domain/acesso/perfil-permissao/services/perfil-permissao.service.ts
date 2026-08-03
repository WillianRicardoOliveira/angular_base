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
    PerfilPermissao
} from '@/interfaces/interfaces';

import {
    environment
} from 'environments/environment';

export interface VincularPerfilPermissao {
    idPerfil: number;
    idPermissao: number;
}

export interface PaginaPerfilPermissao {
    content: PerfilPermissao[];
    totalElements: number;
}

@Injectable({
    providedIn: 'root'
})
export class PerfilPermissaoService {

    private readonly api =
        environment.api;

    constructor(
        private readonly http:
            HttpClient
    ) {}

    listarPorPerfil(
        idPerfil: number,
        page?: number,
        size?: number
    ): Observable<PaginaPerfilPermissao> {
        let params =
            new HttpParams();

        if (
            page !== undefined &&
            page !== null
        ) {
            params =
                params.set(
                    'page',
                    page
                );
        }

        if (
            size !== undefined &&
            size !== null
        ) {
            params =
                params.set(
                    'size',
                    size
                );
        }

        return this.http
            .get<PaginaPerfilPermissao>(
                `${this.api}/perfil-permissao/perfil/${idPerfil}`,
                {
                    params
                }
            );
    }

    cadastrar(
        dados:
            VincularPerfilPermissao
    ): Observable<PerfilPermissao> {
        return this.http
            .post<PerfilPermissao>(
                `${this.api}/perfil-permissao`,
                dados
            );
    }

    excluir(
        id: number
    ): Observable<void> {
        return this.http
            .delete<void>(
                `${this.api}/perfil-permissao/${id}`
            );
    }

    detalhar(
        id: number
    ): Observable<PerfilPermissao> {
        return this.http
            .get<PerfilPermissao>(
                `${this.api}/perfil-permissao/${id}`
            );
    }
}
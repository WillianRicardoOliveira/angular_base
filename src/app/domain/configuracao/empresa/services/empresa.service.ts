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
    Empresa
} from '@/interfaces/interfaces';

import {
    environment
} from 'environments/environment';

export interface Pagina<T> {
    content: T[];
    totalElements: number;
}

@Injectable({
    providedIn: 'root'
})
export class EmpresaService {

    private readonly api =
        environment.api;

    constructor(
        private readonly http:
            HttpClient
    ) {}

    listar(
        filtro?: string,
        page = 0,
        size = 20
    ): Observable<Pagina<Empresa>> {
        let params =
            new HttpParams()
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

        return this.http.get<Pagina<Empresa>>(
            `${this.api}/configuracao/empresa`,
            {
                params
            }
        );
    }
}
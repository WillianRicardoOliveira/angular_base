import {
    HttpClient
} from '@angular/common/http';

import {
    Injectable
} from '@angular/core';

import {
    Observable
} from 'rxjs';

import {
    Pais,
    TipoDocumentoFiscalOpcao
} from '@/interfaces/interfaces';

import {
    environment
} from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaisService {

    private readonly api =
        environment.api;

    constructor(
        private readonly http:
            HttpClient
    ) {}

    listar(): Observable<Pais[]> {
        return this.http.get<Pais[]>(
            `${this.api}/configuracao/pais`
        );
    }

    listarTiposDocumentoFiscal(
        codigoPais: string
    ): Observable<TipoDocumentoFiscalOpcao[]> {
        return this.http.get<TipoDocumentoFiscalOpcao[]>(
            `${this.api}/configuracao/pais/${encodeURIComponent(codigoPais)}/tipos-documento-fiscal`
        );
    }
}
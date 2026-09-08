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
    Estabelecimento,
    TipoDocumentoFiscal,
    TipoEstabelecimento
} from '@/interfaces/interfaces';

import {
    environment
} from 'environments/environment';

export interface Pagina<T> {
    content: T[];
    totalElements: number;
}

export interface CadastrarEstabelecimento {
    idEmpresa: number;
    nome: string;
    tipo: TipoEstabelecimento;
    pais: string;
    tipoDocumentoFiscal?: TipoDocumentoFiscal | null;
    documentoFiscal?: string | null;
    inscricaoEstadual?: string | null;
    inscricaoMunicipal?: string | null;
}

export interface AtualizarEstabelecimento {
    id: number;
    nome: string;
    tipo: TipoEstabelecimento;
    pais: string;
    tipoDocumentoFiscal?: TipoDocumentoFiscal | null;
    documentoFiscal?: string | null;
    inscricaoEstadual?: string | null;
    inscricaoMunicipal?: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class EstabelecimentoService {

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
    ): Observable<Pagina<Estabelecimento>> {
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

        if (filtro?.trim()) {
            params = params.set('filtro', filtro.trim());
        }

        if (idEmpresa !== undefined && idEmpresa !== null) {
            params = params.set('idEmpresa', idEmpresa);
        }

        return this.http.get<Pagina<Estabelecimento>>(
            `${this.api}/configuracao/estabelecimento`,
            { params }
        );
    }

    listarEmpresas(
        filtro?: string,
        page = 0,
        size = 10
    ): Observable<Pagina<Empresa>> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('sort', 'nome,asc');

        if (filtro?.trim()) {
            params = params.set('filtro', filtro.trim());
        }

        return this.http.get<Pagina<Empresa>>(
            `${this.api}/configuracao/empresa`,
            { params }
        );
    }

    cadastrar(
        dados: CadastrarEstabelecimento
    ): Observable<Estabelecimento> {
        return this.http.post<Estabelecimento>(
            `${this.api}/configuracao/estabelecimento`,
            dados
        );
    }

    atualizar(
        dados: AtualizarEstabelecimento
    ): Observable<Estabelecimento> {
        return this.http.put<Estabelecimento>(
            `${this.api}/configuracao/estabelecimento`,
            dados
        );
    }

    detalhar(
        id: number
    ): Observable<Estabelecimento> {
        return this.http.get<Estabelecimento>(
            `${this.api}/configuracao/estabelecimento/${id}`
        );
    }

    excluir(
        id: number
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.api}/configuracao/estabelecimento/${id}`
        );
    }
}
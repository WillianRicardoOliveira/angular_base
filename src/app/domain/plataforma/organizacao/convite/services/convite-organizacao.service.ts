import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    ConsultaConviteOrganizacao,
    ConviteOrganizacao,
    ResultadoAceiteConviteOrganizacao,
    StatusConviteOrganizacao
} from '@/interfaces/interfaces';

import { environment } from 'environments/environment';

export interface Pagina<T> {
    content: T[];
    totalElements: number;
}

export interface CriarConviteOrganizacao {
    nomeOrganizacao: string;
    emailAdministrador: string;
}

export interface AceitarConviteOrganizacaoNovoUsuario {
    token: string;
    senha: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConviteOrganizacaoService {
    private readonly api =
        `${environment.api}/plataforma/organizacao/convite`;

    constructor(
        private readonly http: HttpClient
    ) {}

    convidar(
        dados: CriarConviteOrganizacao
    ): Observable<ConviteOrganizacao> {
        return this.http.post<ConviteOrganizacao>(
            this.api,
            dados
        );
    }

    listar(
        page?: number,
        size?: number,
        sort?: string,
        filtro?: string,
        status?: StatusConviteOrganizacao
    ): Observable<Pagina<ConviteOrganizacao>> {
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

        if (status) {
            params = params.set('status', status);
        }

        return this.http.get<Pagina<ConviteOrganizacao>>(
            this.api,
            { params }
        );
    }

    detalhar(
        id: number
    ): Observable<ConviteOrganizacao> {
        return this.http.get<ConviteOrganizacao>(
            `${this.api}/${id}`
        );
    }

    revogar(
        id: number
    ): Observable<void> {
        return this.http.delete<void>(
            `${this.api}/${id}`
        );
    }

    reenviar(
        id: number
    ): Observable<ConviteOrganizacao> {
        return this.http.post<ConviteOrganizacao>(
            `${this.api}/${id}/reenvio`,
            null
        );
    }

    consultar(
        token: string
    ): Observable<ConsultaConviteOrganizacao> {
        return this.http.post<ConsultaConviteOrganizacao>(
            `${this.api}/consulta`,
            {
                token: token.trim()
            }
        );
    }

    aceitarUsuarioExistente(
        token: string
    ): Observable<ResultadoAceiteConviteOrganizacao> {
        return this.http.post<ResultadoAceiteConviteOrganizacao>(
            `${this.api}/aceite/usuario-existente`,
            {
                token: token.trim()
            }
        );
    }

    aceitarNovoUsuario(
        dados: AceitarConviteOrganizacaoNovoUsuario
    ): Observable<ResultadoAceiteConviteOrganizacao> {
        return this.http.post<ResultadoAceiteConviteOrganizacao>(
            `${this.api}/aceite/novo-usuario`,
            {
                token: dados.token.trim(),
                senha: dados.senha
            }
        );
    }
}
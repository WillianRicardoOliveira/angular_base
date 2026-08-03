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
    UsuarioPerfil
} from '@/interfaces/interfaces';

import {
    environment
} from 'environments/environment';

export interface VincularUsuarioPerfil {
    idUsuario: number;
    idPerfil: number;
}

@Injectable({
    providedIn: 'root'
})
export class UsuarioPerfilService {

    private readonly api =
        environment.api;

    constructor(
        private readonly http:
            HttpClient
    ) {}

    listarPorUsuario(
        idUsuario: number
    ): Observable<UsuarioPerfil[]> {
        return this.http
            .get<UsuarioPerfil[]>(
                `${this.api}/usuario-perfil/usuario/${idUsuario}`
            );
    }

    cadastrar(
        dados:
            VincularUsuarioPerfil
    ): Observable<UsuarioPerfil> {
        return this.http
            .post<UsuarioPerfil>(
                `${this.api}/usuario-perfil`,
                dados
            );
    }

    excluir(
        id: number
    ): Observable<void> {
        return this.http
            .delete<void>(
                `${this.api}/usuario-perfil/${id}`
            );
    }

    detalhar(
        id: number
    ): Observable<UsuarioPerfil> {
        return this.http
            .get<UsuarioPerfil>(
                `${this.api}/usuario-perfil/${id}`
            );
    }
}
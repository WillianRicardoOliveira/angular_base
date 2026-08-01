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
    Usuario
} from '@/interfaces/interfaces';

import {
    environment
} from 'environments/environment';

export interface AlterarSenhaUsuario {
    id: number;
    senha: string;
}

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private readonly api =
        environment.api;

    constructor(
        private readonly http:
            HttpClient
    ) {}

    alterarSenha(
        dados: AlterarSenhaUsuario
    ): Observable<Usuario> {
        return this.http.put<Usuario>(
            `${this.api}/usuario/senha`,
            dados
        );
    }
}
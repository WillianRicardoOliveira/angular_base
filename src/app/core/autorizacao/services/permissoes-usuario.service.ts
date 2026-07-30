import {
    HttpClient
} from '@angular/common/http';
import {
    Injectable
} from '@angular/core';
import {
    map,
    Observable,
    tap
} from 'rxjs';

import {
    PermissoesUsuario
} from '@/core/autorizacao/models/permissoes-usuario.model';
import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';
import {
    environment
} from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PermissoesUsuarioService {
    private readonly url =
        `${environment.api}/login/permissoes`;

    constructor(
        private http: HttpClient,
        private autorizacaoService:
            AutorizacaoService
    ) {}

    carregarPermissoes(): Observable<void> {
        return this.http
            .get<PermissoesUsuario>(
                this.url
            )
            .pipe(
                tap((resposta) => {
                    this.autorizacaoService
                        .definirPermissoes(
                            resposta.permissoes
                        );
                }),
                map(() => undefined)
            );
    }
}
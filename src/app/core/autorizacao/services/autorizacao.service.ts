import {Injectable} from '@angular/core';
import {
    BehaviorSubject,
    Observable
} from 'rxjs';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

interface EstadoAutorizacao {
    carregado: boolean;
    permissoes: ReadonlySet<ChavePermissao>;
}

@Injectable({
    providedIn: 'root'
})
export class AutorizacaoService {
    private readonly estadoSubject =
        new BehaviorSubject<EstadoAutorizacao>({
            carregado: false,
            permissoes:
                new Set<ChavePermissao>()
        });

    retornarEstado():
        Observable<EstadoAutorizacao> {
        return this.estadoSubject.asObservable();
    }

    definirPermissoes(
        permissoes: readonly ChavePermissao[]
    ): void {
        this.estadoSubject.next({
            carregado: true,
            permissoes: new Set(permissoes)
        });
    }

    possuiPermissao(
        permissao: ChavePermissao
    ): boolean {
        return this.estadoSubject
            .value
            .permissoes
            .has(permissao);
    }

    possuiAlgumaPermissao(
        permissoes: readonly ChavePermissao[]
    ): boolean {
        return permissoes.some(
            (permissao) =>
                this.possuiPermissao(permissao)
        );
    }

    possuiTodasPermissoes(
        permissoes: readonly ChavePermissao[]
    ): boolean {
        return (
            permissoes.length > 0 &&
            permissoes.every(
                (permissao) =>
                    this.possuiPermissao(permissao)
            )
        );
    }

    permissoesCarregadas(): boolean {
        return this.estadoSubject
            .value
            .carregado;
    }

    limpar(): void {
        this.estadoSubject.next({
            carregado: false,
            permissoes:
                new Set<ChavePermissao>()
        });
    }
}
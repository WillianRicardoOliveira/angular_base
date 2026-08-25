import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
    BehaviorSubject,
    map,
    Observable
} from 'rxjs';

import {
    OrganizacaoDisponivel
} from '@/core/organizacao/models/organizacao-disponivel.model';
import {environment} from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContextoOrganizacaoService {
    private readonly storageKey =
        'erp.organizacao.ativa.id';

    private readonly url =
        `${environment.api}/organizacao/disponiveis`;

    private readonly organizacoesSubject =
        new BehaviorSubject<OrganizacaoDisponivel[]>([]);

    private readonly organizacaoAtivaSubject =
        new BehaviorSubject<OrganizacaoDisponivel | null>(
            null
        );

    private carregado = false;

    constructor(
        private http: HttpClient
    ) {}

    carregarESelecionarPadrao():
        Observable<OrganizacaoDisponivel | null> {
        return this.http
            .get<OrganizacaoDisponivel[]>(
                this.url
            )
            .pipe(
                map((organizacoes) => {
                    const organizacaoAtiva =
                        this.selecionarPadrao(
                            organizacoes
                        );

                    this.organizacoesSubject.next(
                        organizacoes
                    );

                    this.organizacaoAtivaSubject.next(
                        organizacaoAtiva
                    );

                    this.carregado = true;

                    return organizacaoAtiva;
                })
            );
    }

    listarDisponiveis():
        Observable<OrganizacaoDisponivel[]> {
        return this.http.get<OrganizacaoDisponivel[]>(
            this.url
        );
    }

    definirOrganizacaoAtiva(
        idOrganizacao: number
    ): OrganizacaoDisponivel {
        const organizacao =
            this.organizacoesSubject
                .getValue()
                .find((item) =>
                    item.id === idOrganizacao
                );

        if (!organizacao) {
            throw new Error(
                'Organizacao nao disponivel.'
            );
        }

        this.salvarIdOrganizacaoAtiva(
            organizacao.id
        );

        this.organizacaoAtivaSubject.next(
            organizacao
        );

        return organizacao;
    }

    retornarOrganizacoesDisponiveis():
        Observable<OrganizacaoDisponivel[]> {
        return this.organizacoesSubject
            .asObservable();
    }

    retornarOrganizacaoAtivaObservable():
        Observable<OrganizacaoDisponivel | null> {
        return this.organizacaoAtivaSubject
            .asObservable();
    }

    retornarOrganizacaoAtiva():
        OrganizacaoDisponivel | null {
        return this.organizacaoAtivaSubject
            .getValue();
    }

    retornarIdOrganizacaoAtiva(): number | null {
        return this.retornarOrganizacaoAtiva()
            ?.id ?? null;
    }

    possuiOrganizacaoAtiva(): boolean {
        return this.retornarIdOrganizacaoAtiva()
            !== null;
    }

    foiCarregado(): boolean {
        return this.carregado;
    }

    limpar(): void {
        this.removerIdOrganizacaoAtiva();

        this.organizacoesSubject.next([]);
        this.organizacaoAtivaSubject.next(null);

        this.carregado = false;
    }

    private selecionarPadrao(
        organizacoes: OrganizacaoDisponivel[]
    ): OrganizacaoDisponivel | null {
        if (organizacoes.length === 0) {
            this.removerIdOrganizacaoAtiva();

            return null;
        }

        const idSalvo =
            this.lerIdOrganizacaoAtiva();

        const organizacaoSalva =
            organizacoes.find((organizacao) =>
                organizacao.id === idSalvo
            );

        const organizacaoAtiva =
            organizacaoSalva ?? organizacoes[0];

        this.salvarIdOrganizacaoAtiva(
            organizacaoAtiva.id
        );

        return organizacaoAtiva;
    }

    private salvarIdOrganizacaoAtiva(
        idOrganizacao: number
    ): void {
        localStorage.setItem(
            this.storageKey,
            String(idOrganizacao)
        );
    }

    private lerIdOrganizacaoAtiva(): number | null {
        const valor =
            localStorage.getItem(
                this.storageKey
            );

        if (!valor) {
            return null;
        }

        const id = Number(valor);

        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            return null;
        }

        return id;
    }

    private removerIdOrganizacaoAtiva(): void {
        localStorage.removeItem(
            this.storageKey
        );
    }
}
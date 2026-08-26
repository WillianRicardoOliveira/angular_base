import {
    Component,
    DestroyRef,
    inject
} from '@angular/core';

import {
    takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
    FormGroup,
    Validators
} from '@angular/forms';

import {
    skip
} from 'rxjs';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

import {
    Permissao
} from '@/interfaces/interfaces';

import {
    Base
} from '@components/grid/base/base';

import {
    ItemBreadcrumbPagina
} from '@components/cabecalho-pagina/cabecalho-pagina.component';

@Component({
    selector: 'app-permissao',
    templateUrl: './permissao.component.html',
    styleUrls: ['./permissao.component.scss'],
    standalone: false
})
export class PermissaoComponent extends Base {

    private readonly autorizacaoService =
        inject(
            AutorizacaoService
        );

    private readonly contextoOrganizacaoService =
        inject(
            ContextoOrganizacaoService
        );

    private readonly destroyRef =
        inject(
            DestroyRef
        );

    get podeCriar(): boolean {
        return false;
    }

    get podeEditar(): boolean {
        return false;
    }

    get podeExcluir(): boolean {
        return false;
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.PermissaoDetalhar
            );
    }

    get podeSalvar(): boolean {
        return false;
    }

    pagina = 'Permissões';

    descricao =
        'Consulte as permissões de acesso disponíveis para perfis da organização';

    breadcrumb: ItemBreadcrumbPagina[] = [
        {
            titulo: 'Acesso e Segurança'
        }
    ];

    endPoint = 'permissao';

    coluna = [
        'Nome',
        'Chave',
        'Descrição',
        'Status'
    ];

    override ngOnInit(): void {
        this.configurarAtualizacaoPorOrganizacao();

        super.ngOnInit();
    }

    override botaoAdicionar(): void {}

    override botaoEditar(
        id: number
    ): void {}

    override botaoExcluir(
        id: number
    ): void {}

    override salvar(): void {}

    campos(
        dados?: Permissao
    ): FormGroup {
        return this.builder.group({
            id: [
                dados?.id ?? null
            ],
            nome: [
                dados?.nome ?? '',
                Validators.required
            ],
            chave: [
                dados?.chave ?? '',
                Validators.required
            ],
            descricao: [
                dados?.descricao ?? ''
            ]
        });
    }

    private configurarAtualizacaoPorOrganizacao(): void {
        this.contextoOrganizacaoService
            .retornarOrganizacaoAtivaObservable()
            .pipe(
                skip(1),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((organizacao) => {
                this.limparEstadoPorTrocaOrganizacao();

                if (organizacao) {
                    this.carregarLista();
                }
            });
    }

    private limparEstadoPorTrocaOrganizacao(): void {
        this.cancelar();

        this.lista = [];
        this.totalRegistros = 0;
    }
}
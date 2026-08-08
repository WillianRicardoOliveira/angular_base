import {
    Component,
    inject
} from '@angular/core';

import {
    FormGroup,
    Validators
} from '@angular/forms';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

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

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.PermissaoCriar
            );
    }

    get podeEditar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.PermissaoEditar
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.PermissaoExcluir
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.PermissaoDetalhar
            );
    }

    get podeSalvar(): boolean {
        const possuiId =
            !!this.formulario
                ?.get('id')
                ?.value;

        return possuiId
            ? this.podeEditar
            : this.podeCriar;
    }

    pagina = 'Permissões';

    descricao =
        'Gerencie as permissões de acesso do sistema';

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

    campos(
        dados?: Permissao
    ): FormGroup {
        if (dados) {
            return this.builder.group({
                id: [
                    dados.id
                ],
                nome: [
                    dados.nome,
                    Validators.required
                ],
                chave: [
                    dados.chave,
                    Validators.required
                ],
                descricao: [
                    dados.descricao ?? ''
                ]
            });
        }

        return this.builder.group({
            nome: [
                '',
                Validators.required
            ],
            chave: [
                '',
                Validators.required
            ],
            descricao: [
                ''
            ]
        });
    }
}
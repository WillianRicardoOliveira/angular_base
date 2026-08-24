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
    Empresa
} from '@/interfaces/interfaces';

import {
    Base
} from '@components/grid/base/base';

import {
    ItemBreadcrumbPagina
} from '@components/cabecalho-pagina/cabecalho-pagina.component';

@Component({
    selector: 'app-empresa',
    templateUrl: './empresa.component.html',
    styleUrls: ['./empresa.component.scss'],
    standalone: false
})
export class EmpresaComponent extends Base {

    private readonly autorizacaoService =
        inject(
            AutorizacaoService
        );

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.EmpresaCriar
            );
    }

    get podeEditar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.EmpresaEditar
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.EmpresaExcluir
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.EmpresaDetalhar
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

    pagina = 'Empresas';

    descricao =
        'Gerencie as empresas do sistema';

    breadcrumb: ItemBreadcrumbPagina[] = [
        {
            titulo: 'Configuração'
        }
    ];

    endPoint = 'configuracao/empresa';

    coluna = [
        'Nome',
        'Status'
    ];

    campos(
        dados?: Empresa
    ): FormGroup {
        if (dados) {
            return this.builder.group({
                id: [
                    dados.id
                ],
                nome: [
                    dados.nome,
                    [
                        Validators.required,
                        Validators.maxLength(100)
                    ]
                ]
            });
        }

        return this.builder.group({
            nome: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(100)
                ]
            ]
        });
    }
}
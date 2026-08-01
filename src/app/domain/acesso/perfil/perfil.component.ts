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
    Perfil
} from '@/interfaces/interfaces';

import {
    Base
} from '@components/grid/base/base';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.scss'],
    standalone: false
})
export class PerfilComponent extends Base {

    private readonly autorizacaoService =
        inject(
            AutorizacaoService
        );

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.PerfilCriar
            );
    }

    get podeEditar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.PerfilEditar
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.PerfilExcluir
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.PerfilDetalhar
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

    pagina = 'Perfis';

    endPoint = 'perfil';

    coluna = [
        'Nome',
        'Descrição',
        'Status'
    ];

    campos(
        dados?: Perfil
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
            descricao: [
                ''
            ]
        });
    }
}
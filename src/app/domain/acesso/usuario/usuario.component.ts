import {
    Component,
    inject
} from '@angular/core';

import {
    FormGroup,
    Validators
} from '@angular/forms';

import {
    Base
} from '@components/grid/base/base';
import {
    Usuario
} from '@/interfaces/interfaces';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.scss'],
    standalone: false
})
export class UsuarioComponent extends Base {

    private readonly autorizacaoService =
    inject(
        AutorizacaoService
    );

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.UsuarioCriar
            );
    }

    get podeEditar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.UsuarioEditar
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.UsuarioExcluir
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.UsuarioDetalhar
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

    pagina = 'Usuários';

    endPoint = 'usuario';

    coluna = [
        'E-mail',
        'Status'
    ];

    campos(
        dados?: Usuario
    ): FormGroup {
        if (dados) {
            return this.builder.group({
                id: [
                    dados.id
                ],
                email: [
                    dados.email,
                    [
                        Validators.required,
                        Validators.email
                    ]
                ]
            });
        }

        return this.builder.group({
            email: [
                '',
                [
                    Validators.required,
                    Validators.email
                ]
            ],
            senha: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8)
                ]
            ]
        });
    }
}
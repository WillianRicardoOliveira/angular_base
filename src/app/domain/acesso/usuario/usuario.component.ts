import {
    Component,
    inject
} from '@angular/core';

import {
    FormGroup,
    Validators
} from '@angular/forms';

import {
    Router
} from '@angular/router';

import {
    Base
} from '@components/grid/base/base';

import {
    AcaoExtraGrid,
    EventoAcaoExtraGrid
} from '@components/grid/grid.component';

import {
    ItemBreadcrumbPagina
} from '@components/cabecalho-pagina/cabecalho-pagina.component';

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
    styleUrls: [
        './usuario.component.scss'
    ],
    standalone: false
})
export class UsuarioComponent extends Base {

    private readonly autorizacaoService =
        inject(
            AutorizacaoService
        );

    private readonly routerUsuario =
        inject(
            Router
        );

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioCriar
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioExcluir
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioDetalhar
            );
    }

    get podeGerenciarPerfis(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioPerfilListar
            );
    }

    get podeGerenciarEmpresas(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioEmpresaListar
            );
    }

    get acoesExtras(): AcaoExtraGrid[] {
        const acoes:
            AcaoExtraGrid[] = [];

        if (this.podeGerenciarPerfis) {
            acoes.push({
                chave: 'perfis',
                icone:
                    'manage_accounts',
                tooltip:
                    'Gerenciar perfis'
            });
        }

        if (this.podeGerenciarEmpresas) {
            acoes.push({
                chave: 'empresas',
                icone: 'business',
                tooltip:
                    'Gerenciar empresas'
            });
        }

        return acoes;
    }

    get podeSalvar(): boolean {
        const possuiId =
            !!this.formulario
                ?.get('id')
                ?.value;

        return !possuiId &&
            this.podeCriar;
    }

    pagina = 'Usuários';

    descricao =
        'Gerencie usuários, acessos e perfis do sistema';

    breadcrumb: ItemBreadcrumbPagina[] = [
        {
            titulo:
                'Acesso e Segurança'
        }
    ];

    endPoint = 'usuario';

    coluna = [
        'E-mail',
        'Status'
    ];

    botaoAcaoExtra(
        evento: EventoAcaoExtraGrid
    ): void {
        if (evento.chave === 'perfis') {
            this.botaoPerfis(
                evento.id
            );

            return;
        }

        if (evento.chave === 'empresas') {
            this.botaoEmpresas(
                evento.id
            );
        }
    }

    botaoPerfis(
        id: number
    ): void {
        if (!this.podeGerenciarPerfis) {
            return;
        }

        this.routerUsuario.navigate([
            '/acesso/usuarios',
            id,
            'perfis'
        ]);
    }

    botaoEmpresas(
        id: number
    ): void {
        if (!this.podeGerenciarEmpresas) {
            return;
        }

        this.routerUsuario.navigate([
            '/acesso/usuarios',
            id,
            'empresas'
        ]);
    }

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
                    Validators.minLength(
                        8
                    ),
                    Validators.pattern(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
                    )
                ]
            ]
        });
    }
}
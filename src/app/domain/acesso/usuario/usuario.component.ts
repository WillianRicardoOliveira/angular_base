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

import {
    AlterarSenhaUsuario,
    UsuarioService
} from './services/usuario.service';

import {
    ToastrService
} from 'ngx-toastr';

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

    private readonly usuarioService =
    inject(
        UsuarioService
    );

    private readonly toastrUsuario =
    inject(
        ToastrService
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

    get podeAlterarSenha(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao.UsuarioSenhaEditar
            );
    }

    get podeSalvar(): boolean {
        if (this.isAlteracaoSenha) {
            return this.podeAlterarSenha;
        }

        const possuiId =
            !!this.formulario
                ?.get('id')
                ?.value;

        return possuiId
            ? this.podeEditar
            : this.podeCriar;
    }

    isAlteracaoSenha = false;

    pagina = 'Usuários';

    endPoint = 'usuario';

    coluna = [
        'E-mail',
        'Status'
    ];

    override salvar(): void {
        if (!this.isAlteracaoSenha) {
            super.salvar();
            return;
        }

        if (
            !this.podeAlterarSenha ||
            this.formulario.invalid
        ) {
            return;
        }

        const dados:
            AlterarSenhaUsuario =
                this.formulario.getRawValue();

        this.usuarioService
            .alterarSenha(dados)
            .subscribe({
                next: () => {
                    this.cancelar();
                    this.carregarLista();

                    this.toastrUsuario.success(
                        'Senha alterada com sucesso'
                    );
                },
                error: () => {
                    this.toastrUsuario.error(
                        'Não foi possível alterar a senha'
                    );
                }
            });
    }

    botaoAlterarSenha(id: number): void {
        if (!this.podeAlterarSenha) {
            return;
        }

        this.resetForm();

        this.isAlteracaoSenha = true;
        this.isVisualizacao = false;
        this.isLista = false;
        this.isFormulario = true;

        this.formulario =
            this.builder.group({
                id: [
                    id,
                    Validators.required
                ],
                senha: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.pattern(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
                        )
                    ]
                ]
            });
    }

    override cancelar(): void {
        this.isAlteracaoSenha = false;

        super.cancelar();
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
                    Validators.minLength(8),
                    Validators.pattern(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
                    )
                ]
            ]
        });
    }
}
import {
    Component,
    OnInit,
    inject
} from '@angular/core';

import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';

import {
    ActivatedRoute,
    Router
} from '@angular/router';

import {
    ToastrService
} from 'ngx-toastr';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    UsuarioPerfil
} from '@/interfaces/interfaces';

import {
    UsuarioPerfilService,
    VincularUsuarioPerfil
} from './services/usuario-perfil.service';

@Component({
    selector: 'app-usuario-perfil',
    templateUrl:
        './usuario-perfil.component.html',
    styleUrls: [
        './usuario-perfil.component.scss'
    ],
    standalone: false
})
export class UsuarioPerfilComponent
    implements OnInit {

    private readonly service =
        inject(
            UsuarioPerfilService
        );

    private readonly autorizacaoService =
        inject(
            AutorizacaoService
        );

    private readonly builder =
        inject(
            FormBuilder
        );

    private readonly route =
        inject(
            ActivatedRoute
        );

    private readonly router =
        inject(
            Router
        );

    private readonly toastr =
        inject(
            ToastrService
        );

    idUsuario = 0;

    pagina =
        'Perfis do usuário';

    coluna = [
        'Código do perfil',
        'Perfil',
        'Status'
    ];

    lista:
        UsuarioPerfil[] = [];

    totalRegistros = 0;

    isLista = true;

    isFormulario = false;

    isVisualizacao = false;

    formulario!: FormGroup;

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioPerfilCriar
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioPerfilExcluir
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .UsuarioPerfilDetalhar
            );
    }

    ngOnInit(): void {
        const parametro =
            this.route.snapshot
                .paramMap
                .get('idUsuario');

        this.idUsuario =
            Number(parametro);

        if (
            !Number.isInteger(
                this.idUsuario
            ) ||
            this.idUsuario <= 0
        ) {
            this.router.navigate([
                '/acesso/usuarios'
            ]);

            return;
        }

        this.carregarLista();
    }

    carregarLista(): void {
        this.service
            .listarPorUsuario(
                this.idUsuario
            )
            .subscribe({
                next: (lista) => {
                    this.lista = lista;

                    this.totalRegistros =
                        lista.length;
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível carregar os perfis do usuário'
                    );
                }
            });
    }

    botaoAdicionar(): void {
        if (!this.podeCriar) {
            return;
        }

        this.isLista = false;
        this.isFormulario = true;
        this.isVisualizacao = false;

        this.formulario =
            this.builder.group({
                idUsuario: [
                    this.idUsuario,
                    Validators.required
                ],
                idPerfil: [
                    null,
                    Validators.required
                ]
            });
    }

    botaoVisualizar(
        id: number
    ): void {
        if (!this.podeDetalhar) {
            return;
        }

        this.service
            .detalhar(id)
            .subscribe({
                next: (dados) => {
                    this.isLista = false;
                    this.isFormulario = true;
                    this.isVisualizacao = true;

                    this.formulario =
                        this.builder.group({
                            id: [
                                dados.id
                            ],
                            idUsuario: [
                                dados.idUsuario
                            ],
                            usuario: [
                                dados.usuario
                            ],
                            idPerfil: [
                                dados.idPerfil
                            ],
                            perfil: [
                                dados.perfil
                            ],
                            status: [
                                dados.status
                            ]
                        });

                    this.formulario.disable();
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível detalhar o perfil do usuário'
                    );
                }
            });
    }

    salvar(): void {
        if (
            !this.podeCriar ||
            this.formulario.invalid
        ) {
            return;
        }

        const dados:
            VincularUsuarioPerfil =
                this.formulario
                    .getRawValue();

        this.service
            .cadastrar(dados)
            .subscribe({
                next: () => {
                    this.cancelar();
                    this.carregarLista();

                    this.toastr.success(
                        'Perfil vinculado com sucesso'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível vincular o perfil'
                    );
                }
            });
    }

    botaoExcluir(
        id: number
    ): void {
        if (!this.podeExcluir) {
            return;
        }

        this.service
            .excluir(id)
            .subscribe({
                next: () => {
                    this.carregarLista();

                    this.toastr.info(
                        'Perfil removido do usuário'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível remover o perfil do usuário'
                    );
                }
            });
    }

    cancelar(): void {
        this.isLista = true;
        this.isFormulario = false;
        this.isVisualizacao = false;

        if (this.formulario) {
            this.formulario.reset();
        }
    }

    voltar(): void {
        this.router.navigate([
            '/acesso/usuarios'
        ]);
    }
}
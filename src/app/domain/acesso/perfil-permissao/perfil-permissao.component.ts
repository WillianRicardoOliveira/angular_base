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
    PageEvent
} from '@angular/material/paginator';

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
    PerfilPermissao
} from '@/interfaces/interfaces';

import {
    PerfilPermissaoService,
    VincularPerfilPermissao
} from './services/perfil-permissao.service';

@Component({
    selector: 'app-perfil-permissao',
    templateUrl:
        './perfil-permissao.component.html',
    styleUrls: [
        './perfil-permissao.component.scss'
    ],
    standalone: false
})
export class PerfilPermissaoComponent
    implements OnInit {

    private readonly service =
        inject(
            PerfilPermissaoService
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

    idPerfil = 0;

    pagina =
        'Permissões do perfil';

    coluna = [
        'Código da permissão',
        'Permissão',
        'Chave',
        'Status'
    ];

    lista:
        PerfilPermissao[] = [];

    totalRegistros = 0;

    isLista = true;

    isFormulario = false;

    isVisualizacao = false;

    formulario!: FormGroup;

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .PerfilPermissaoCriar
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .PerfilPermissaoExcluir
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .PerfilPermissaoDetalhar
            );
    }

    ngOnInit(): void {
        const parametro =
            this.route.snapshot
                .paramMap
                .get('idPerfil');

        this.idPerfil =
            Number(parametro);

        if (
            !Number.isInteger(
                this.idPerfil
            ) ||
            this.idPerfil <= 0
        ) {
            this.router.navigate([
                '/acesso/perfis'
            ]);

            return;
        }

        this.carregarLista();
    }

    carregarLista(
        page?: number,
        size?: number
    ): void {
        this.service
            .listarPorPerfil(
                this.idPerfil,
                page,
                size
            )
            .subscribe({
                next: (pagina) => {
                    this.lista =
                        pagina.content;

                    this.totalRegistros =
                        pagina.totalElements;
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível carregar as permissões do perfil'
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
                idPerfil: [
                    this.idPerfil,
                    Validators.required
                ],
                idPermissao: [
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
                            idPerfil: [
                                dados.idPerfil
                            ],
                            perfil: [
                                dados.perfil
                            ],
                            idPermissao: [
                                dados.idPermissao
                            ],
                            permissao: [
                                dados.permissao
                            ],
                            chave: [
                                dados.chave
                            ],
                            status: [
                                dados.status
                            ]
                        });

                    this.formulario.disable();
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível detalhar a permissão do perfil'
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
            VincularPerfilPermissao =
                this.formulario
                    .getRawValue();

        this.service
            .cadastrar(dados)
            .subscribe({
                next: () => {
                    this.cancelar();
                    this.carregarLista();

                    this.toastr.success(
                        'Permissão vinculada com sucesso'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível vincular a permissão'
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
                        'Permissão removida do perfil'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Não foi possível remover a permissão do perfil'
                    );
                }
            });
    }

    quantidadePorPagina(
        evento: PageEvent
    ): void {
        this.carregarLista(
            evento.pageIndex,
            evento.pageSize
        );
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
            '/acesso/perfis'
        ]);
    }
}
import {
    Component,
    DestroyRef,
    OnInit,
    inject
} from '@angular/core';

import {
    takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';

import {
    MatDialog
} from '@angular/material/dialog';

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
    ConviteOrganizacao,
    StatusConviteOrganizacao
} from '@/interfaces/interfaces';

import {
    AppSharedConfirmacaoComponent,
    DadosConfirmacao
} from '@components/shared/app-shared-confirmacao/app-shared-confirmacao.component';

import {
    ItemBreadcrumbPagina
} from '@components/cabecalho-pagina/cabecalho-pagina.component';

import {
    ConviteOrganizacaoService
} from './services/convite-organizacao.service';

@Component({
    selector: 'app-convite-organizacao',
    templateUrl:
        './convite-organizacao.component.html',
    styleUrls: [
        './convite-organizacao.component.scss'
    ],
    standalone: false
})
export class ConviteOrganizacaoComponent
    implements OnInit {

    private readonly service =
        inject(ConviteOrganizacaoService);

    private readonly autorizacaoService =
        inject(AutorizacaoService);

    private readonly builder =
        inject(FormBuilder);

    private readonly dialog =
        inject(MatDialog);

    private readonly toastr =
        inject(ToastrService);

    private readonly destroyRef =
        inject(DestroyRef);

    pagina =
        'Convites de organizacao';

    descricao =
        'Gerencie convites para administradores iniciais de organizacoes';

    breadcrumb: ItemBreadcrumbPagina[] = [
        {
            titulo: 'Plataforma'
        }
    ];

    lista: ConviteOrganizacao[] = [];

    totalRegistros = 0;

    paginaAtual = 0;

    tamanhoPagina = 10;

    filtro = '';

    statusFiltro:
        StatusConviteOrganizacao | null = null;

    isLista = true;

    isFormulario = false;

    isVisualizacao = false;

    formulario!: FormGroup;

    get podeCriar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .PlataformaOrganizacaoCriar
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .PlataformaOrganizacaoDetalhar
            );
    }

    ngOnInit(): void {
        this.carregarLista();
    }

    carregarLista(
        page = this.paginaAtual,
        size = this.tamanhoPagina
    ): void {
        this.service
            .listar(
                page,
                size,
                'id,desc',
                this.filtro.trim() || undefined,
                this.statusFiltro || undefined
            )
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (pagina) => {
                    this.lista = pagina.content;
                    this.totalRegistros =
                        pagina.totalElements;
                    this.paginaAtual = page;
                    this.tamanhoPagina = size;
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel carregar os convites'
                    );
                }
            });
    }

    pesquisar(): void {
        this.carregarLista(
            0,
            this.tamanhoPagina
        );
    }

    quantidadePorPagina(
        evento: PageEvent
    ): void {
        this.carregarLista(
            evento.pageIndex,
            evento.pageSize
        );
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
                nomeOrganizacao: [
                    '',
                    [
                        Validators.required,
                        Validators.maxLength(100)
                    ]
                ],
                emailAdministrador: [
                    '',
                    [
                        Validators.required,
                        Validators.email,
                        Validators.maxLength(100)
                    ]
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
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (convite) => {
                    this.isLista = false;
                    this.isFormulario = true;
                    this.isVisualizacao = true;

                    this.formulario =
                        this.builder.group({
                            id: [convite.id],
                            nomeOrganizacao: [
                                convite.nomeOrganizacao
                            ],
                            emailAdministrador: [
                                convite.emailAdministrador
                            ],
                            criadoEm: [
                                convite.criadoEm
                            ],
                            expiraEm: [
                                convite.expiraEm
                            ],
                            aceitoEm: [
                                convite.aceitoEm
                            ],
                            status: [
                                convite.status
                            ],
                            expirado: [
                                convite.expirado
                                    ? 'Sim'
                                    : 'Nao'
                            ]
                        });

                    this.formulario.disable();
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel detalhar o convite'
                    );
                }
            });
    }

    salvar(): void {
        if (!this.podeCriar) {
            return;
        }

        const nomeOrganizacao =
            String(
                this.formulario
                    .get('nomeOrganizacao')
                    ?.value ?? ''
            ).trim();

        const emailAdministrador =
            String(
                this.formulario
                    .get('emailAdministrador')
                    ?.value ?? ''
            ).trim();

        this.formulario.patchValue({
            nomeOrganizacao,
            emailAdministrador
        });

        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();

            return;
        }

        this.service
            .convidar({
                nomeOrganizacao,
                emailAdministrador
            })
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    this.cancelar();
                    this.carregarLista();

                    this.toastr.success(
                        'Convite criado com sucesso'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel criar o convite'
                    );
                }
            });
    }

    botaoRevogar(
        convite: ConviteOrganizacao
    ): void {
        if (
            !convite.id ||
            !this.podeRevogar(convite)
        ) {
            return;
        }

        this.confirmar(
            {
                titulo: 'Revogar convite',
                mensagem:
                    'Deseja realmente revogar este convite?',
                textoConfirmar: 'Revogar',
                tipo: 'perigo'
            },
            () => {
                this.service
                    .revogar(convite.id!)
                    .pipe(
                        takeUntilDestroyed(
                            this.destroyRef
                        )
                    )
                    .subscribe({
                        next: () => {
                            this.carregarLista();

                            this.toastr.info(
                                'Convite revogado com sucesso'
                            );
                        },
                        error: () => {
                            this.toastr.error(
                                'Nao foi possivel revogar o convite'
                            );
                        }
                    });
            }
        );
    }

    botaoReenviar(
        convite: ConviteOrganizacao
    ): void {
        if (
            !convite.id ||
            !this.podeReenviar(convite)
        ) {
            return;
        }

        this.confirmar(
            {
                titulo: 'Reenviar convite',
                mensagem:
                    'Deseja realmente reenviar este convite?',
                textoConfirmar: 'Reenviar',
                tipo: 'padrao'
            },
            () => {
                this.service
                    .reenviar(convite.id!)
                    .pipe(
                        takeUntilDestroyed(
                            this.destroyRef
                        )
                    )
                    .subscribe({
                        next: () => {
                            this.carregarLista();

                            this.toastr.success(
                                'Convite reenviado com sucesso'
                            );
                        },
                        error: () => {
                            this.toastr.error(
                                'Nao foi possivel reenviar o convite'
                            );
                        }
                    });
            }
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

    podeRevogar(
        convite: ConviteOrganizacao
    ): boolean {
        return (
            this.podeCriar &&
            convite.status === 'PENDENTE'
        );
    }

    podeReenviar(
        convite: ConviteOrganizacao
    ): boolean {
        return (
            this.podeCriar &&
            convite.status === 'PENDENTE'
        );
    }

    textoStatus(
        status?: StatusConviteOrganizacao
    ): string {
        if (!status) {
            return '';
        }

        const texto =
            status.toLowerCase();

        return (
            texto.charAt(0).toUpperCase() +
            texto.slice(1)
        );
    }

    classeStatus(
        status?: StatusConviteOrganizacao
    ): string {
        if (!status) {
            return '';
        }

        return (
            'convite-status--' +
            status.toLowerCase()
        );
    }

    private confirmar(
        dados: DadosConfirmacao,
        aoConfirmar: () => void
    ): void {
        const referencia =
            this.dialog.open(
                AppSharedConfirmacaoComponent,
                {
                    data: dados
                }
            );

        referencia
            .afterClosed()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((confirmou) => {
                if (confirmou) {
                    aoConfirmar();
                }
            });
    }
}
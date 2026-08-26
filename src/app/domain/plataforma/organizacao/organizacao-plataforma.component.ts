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
    OrganizacaoPlataforma,
    Status
} from '@/interfaces/interfaces';

import {
    AppSharedConfirmacaoComponent,
    DadosConfirmacao
} from '@components/shared/app-shared-confirmacao/app-shared-confirmacao.component';

import {
    ItemBreadcrumbPagina
} from '@components/cabecalho-pagina/cabecalho-pagina.component';

import {
    OrganizacaoPlataformaService
} from './services/organizacao-plataforma.service';

@Component({
    selector: 'app-organizacao-plataforma',
    templateUrl:
        './organizacao-plataforma.component.html',
    styleUrls: [
        './organizacao-plataforma.component.scss'
    ],
    standalone: false
})
export class OrganizacaoPlataformaComponent
    implements OnInit {

    private readonly service =
        inject(
            OrganizacaoPlataformaService
        );

    private readonly autorizacaoService =
        inject(
            AutorizacaoService
        );

    private readonly builder =
        inject(
            FormBuilder
        );

    private readonly dialog =
        inject(
            MatDialog
        );

    private readonly toastr =
        inject(
            ToastrService
        );

    private readonly destroyRef =
        inject(
            DestroyRef
        );

    pagina =
        'Organizacoes';

    descricao =
        'Administre as organizacoes cadastradas na plataforma';

    breadcrumb: ItemBreadcrumbPagina[] = [
        {
            titulo: 'Plataforma'
        }
    ];

    lista: OrganizacaoPlataforma[] = [];

    totalRegistros = 0;

    paginaAtual = 0;

    tamanhoPagina = 10;

    filtro = '';

    isLista = true;

    isFormulario = false;

    isVisualizacao = false;

    formulario!: FormGroup;

    get podeEditar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .PlataformaOrganizacaoEditar
            );
    }

    get podeDetalhar(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .PlataformaOrganizacaoDetalhar
            );
    }

    get podeAlterarStatus(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .PlataformaOrganizacaoStatus
            );
    }

    get podeExcluir(): boolean {
        return this.autorizacaoService
            .possuiPermissao(
                ChavePermissao
                    .PlataformaOrganizacaoExcluir
            );
    }

    get podeSalvar(): boolean {
        return (
            !this.isVisualizacao &&
            this.podeEditar &&
            !!this.formulario
                ?.get('id')
                ?.value
        );
    }

    ngOnInit(): void {
        this.carregarLista();
    }

    carregarLista(
        page = this.paginaAtual,
        size = this.tamanhoPagina
    ): void {
        const filtroNormalizado =
            this.filtro.trim();

        this.service
            .listar(
                page,
                size,
                'id,desc',
                filtroNormalizado || undefined
            )
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: (pagina) => {
                    this.lista =
                        pagina.content;

                    this.totalRegistros =
                        pagina.totalElements;

                    this.paginaAtual = page;
                    this.tamanhoPagina = size;
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel carregar as organizacoes'
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

    botaoVisualizar(
        id: number
    ): void {
        if (!this.podeDetalhar) {
            return;
        }

        this.carregarFormulario(
            id,
            true
        );
    }

    botaoEditar(
        id: number
    ): void {
        if (!this.podeEditar) {
            return;
        }

        this.carregarFormulario(
            id,
            false
        );
    }

    salvar(): void {
        if (!this.podeSalvar) {
            return;
        }

        const id =
            Number(
                this.formulario
                    .get('id')
                    ?.value
            );

        const nome =
            String(
                this.formulario
                    .get('nome')
                    ?.value ?? ''
            ).trim();

        this.formulario
            .get('nome')
            ?.setValue(nome);

        if (
            !id ||
            this.formulario.invalid
        ) {
            this.formulario
                .markAllAsTouched();

            return;
        }

        this.service
            .editar(
                id,
                {
                    nome
                }
            )
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: () => {
                    this.cancelar();
                    this.carregarLista();

                    this.toastr.success(
                        'Organizacao atualizada com sucesso'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel atualizar a organizacao'
                    );
                }
            });
    }

    botaoInativar(
        organizacao: OrganizacaoPlataforma
    ): void {
        if (
            !organizacao.id ||
            !this.podeInativar(organizacao)
        ) {
            return;
        }

        this.confirmar(
            {
                titulo: 'Inativar organizacao',
                mensagem:
                    'Deseja realmente inativar esta organizacao?',
                textoConfirmar: 'Inativar',
                tipo: 'atencao'
            },
            () => {
                this.service
                    .inativar(organizacao.id!)
                    .pipe(
                        takeUntilDestroyed(
                            this.destroyRef
                        )
                    )
                    .subscribe({
                        next: () => {
                            this.carregarLista();

                            this.toastr.info(
                                'Organizacao inativada com sucesso'
                            );
                        },
                        error: () => {
                            this.toastr.error(
                                'Nao foi possivel inativar a organizacao'
                            );
                        }
                    });
            }
        );
    }

    botaoReativar(
        organizacao: OrganizacaoPlataforma
    ): void {
        if (
            !organizacao.id ||
            !this.podeReativar(organizacao)
        ) {
            return;
        }

        this.confirmar(
            {
                titulo: 'Reativar organizacao',
                mensagem:
                    'Deseja realmente reativar esta organizacao?',
                textoConfirmar: 'Reativar',
                tipo: 'padrao'
            },
            () => {
                this.service
                    .reativar(organizacao.id!)
                    .pipe(
                        takeUntilDestroyed(
                            this.destroyRef
                        )
                    )
                    .subscribe({
                        next: () => {
                            this.carregarLista();

                            this.toastr.success(
                                'Organizacao reativada com sucesso'
                            );
                        },
                        error: () => {
                            this.toastr.error(
                                'Nao foi possivel reativar a organizacao'
                            );
                        }
                    });
            }
        );
    }

    botaoExcluir(
        organizacao: OrganizacaoPlataforma
    ): void {
        if (
            !organizacao.id ||
            !this.podeRemover(organizacao)
        ) {
            return;
        }

        this.confirmar(
            {
                titulo: 'Remover organizacao',
                mensagem:
                    'Deseja realmente remover esta organizacao?',
                textoConfirmar: 'Remover',
                tipo: 'perigo'
            },
            () => {
                this.service
                    .remover(organizacao.id!)
                    .pipe(
                        takeUntilDestroyed(
                            this.destroyRef
                        )
                    )
                    .subscribe({
                        next: () => {
                            this.carregarLista();

                            this.toastr.info(
                                'Organizacao removida com sucesso'
                            );
                        },
                        error: () => {
                            this.toastr.error(
                                'Nao foi possivel remover a organizacao'
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

    podeEditarOrganizacao(
        organizacao: OrganizacaoPlataforma
    ): boolean {
        return (
            this.podeEditar &&
            organizacao.status !== 'REMOVIDO'
        );
    }

    podeInativar(
        organizacao: OrganizacaoPlataforma
    ): boolean {
        return (
            this.podeAlterarStatus &&
            organizacao.status === 'ATIVO'
        );
    }

    podeReativar(
        organizacao: OrganizacaoPlataforma
    ): boolean {
        return (
            this.podeAlterarStatus &&
            organizacao.status === 'INATIVO'
        );
    }

    podeRemover(
        organizacao: OrganizacaoPlataforma
    ): boolean {
        return (
            this.podeExcluir &&
            organizacao.status !== 'REMOVIDO'
        );
    }

    textoStatus(
        status?: Status
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
        status?: Status
    ): string {
        if (!status) {
            return '';
        }

        return (
            'grid-status--' +
            status.toLowerCase()
        );
    }

    private carregarFormulario(
        id: number,
        visualizacao: boolean
    ): void {
        this.service
            .detalhar(id)
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: (dados) => {
                    if (
                        !visualizacao &&
                        dados.status === 'REMOVIDO'
                    ) {
                        this.toastr.info(
                            'Organizacao removida nao pode ser editada'
                        );

                        return;
                    }

                    this.isLista = false;
                    this.isFormulario = true;
                    this.isVisualizacao =
                        visualizacao;

                    this.formulario =
                        this.builder.group({
                            id: [
                                dados.id
                            ],
                            nome: [
                                dados.nome,
                                [
                                    Validators.required,
                                    Validators.maxLength(
                                        100
                                    )
                                ]
                            ],
                            status: [
                                dados.status
                            ]
                        });

                    if (visualizacao) {
                        this.formulario
                            .disable();
                    }
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel detalhar a organizacao'
                    );
                }
            });
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
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe((confirmou) => {
                if (confirmou) {
                    aoConfirmar();
                }
            });
    }
}
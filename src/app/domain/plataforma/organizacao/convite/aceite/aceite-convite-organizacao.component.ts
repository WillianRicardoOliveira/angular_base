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
    catchError,
    finalize,
    map,
    Observable,
    of,
    switchMap
} from 'rxjs';

import {
    UsuarioAutenticadoService
} from '@/core/autenticacao/services/usuario-autenticado.service';

import {
    PermissoesUsuarioService
} from '@/core/autorizacao/services/permissoes-usuario.service';

import {
    OrganizacaoDisponivel
} from '@/core/organizacao/models/organizacao-disponivel.model';

import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

import {
    ConsultaConviteOrganizacao
} from '@/interfaces/interfaces';

import {
    ConviteOrganizacaoService
} from '../services/convite-organizacao.service';

@Component({
    selector: 'app-aceite-convite-organizacao',
    templateUrl:
        './aceite-convite-organizacao.component.html',
    styleUrls: [
        './aceite-convite-organizacao.component.scss'
    ],
    standalone: false
})
export class AceiteConviteOrganizacaoComponent
    implements OnInit {

    private readonly route =
        inject(ActivatedRoute);

    private readonly router =
        inject(Router);

    private readonly builder =
        inject(FormBuilder);

    private readonly service =
        inject(ConviteOrganizacaoService);

    private readonly usuarioAutenticadoService =
        inject(UsuarioAutenticadoService);

    private readonly contextoOrganizacaoService =
        inject(ContextoOrganizacaoService);

    private readonly permissoesUsuarioService =
        inject(PermissoesUsuarioService);

    private readonly toastr =
        inject(ToastrService);

    token = '';

    convite:
        ConsultaConviteOrganizacao | null = null;

    formulario!: FormGroup;

    carregando = false;

    processando = false;

    erro = '';

    concluido = false;

    nomeOrganizacaoAceita = '';

    ngOnInit(): void {
        this.token =
            this.route.snapshot
                .queryParamMap
                .get('token')
                ?.trim() ?? '';

        this.formulario =
            this.builder.group({
                senha: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8)
                    ]
                ],
                confirmarSenha: [
                    '',
                    Validators.required
                ]
            });

        if (!this.token) {
            this.erro =
                'Convite invalido ou expirado.';
            return;
        }

        this.consultarConvite();
    }

    get usuarioLogado(): boolean {
        return this.usuarioAutenticadoService
            .estaLogado();
    }

    get deveCriarUsuario(): boolean {
        return !!this.convite &&
            !this.convite.usuarioExistente;
    }

    get deveAceitarComUsuarioExistente(): boolean {
        return !!this.convite &&
            this.convite.usuarioExistente;
    }

    consultarConvite(): void {
        this.carregando = true;
        this.erro = '';

        this.service
            .consultar(this.token)
            .pipe(
                finalize(() => {
                    this.carregando = false;
                })
            )
            .subscribe({
                next: (convite) => {
                    this.convite = convite;
                },
                error: () => {
                    this.erro =
                        'Convite invalido ou expirado.';
                }
            });
    }

    aceitarNovoUsuario(): void {
        if (
            !this.deveCriarUsuario ||
            this.processando
        ) {
            return;
        }

        const senha =
            String(
                this.formulario
                    .get('senha')
                    ?.value ?? ''
            );

        const confirmarSenha =
            String(
                this.formulario
                    .get('confirmarSenha')
                    ?.value ?? ''
            );

        if (senha !== confirmarSenha) {
            this.formulario
                .get('confirmarSenha')
                ?.setErrors({
                    senhasDiferentes: true
                });
        }

        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        this.processando = true;

        this.service
            .aceitarNovoUsuario({
                token: this.token,
                senha
            })
            .pipe(
                finalize(() => {
                    this.processando = false;
                })
            )
            .subscribe({
                next: (resultado) => {
                    this.concluirAceite(
                        resultado.nomeOrganizacao
                    );

                    this.toastr.success(
                        'Organizacao criada com sucesso'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel aceitar o convite'
                    );
                }
            });
    }

    aceitarUsuarioExistente(): void {
        if (
            !this.deveAceitarComUsuarioExistente ||
            this.processando
        ) {
            return;
        }

        if (!this.usuarioLogado) {
            this.irParaLoginMantendoConvite();
            return;
        }

        this.processando = true;

        this.service
            .aceitarUsuarioExistente(this.token)
            .pipe(
                switchMap((resultado) =>
                    this.atualizarContextoAposAceite(
                        resultado.idOrganizacao
                    ).pipe(
                        map(() => resultado)
                    )
                ),
                finalize(() => {
                    this.processando = false;
                })
            )
            .subscribe({
                next: (resultado) => {
                    this.concluirAceite(
                        resultado.nomeOrganizacao
                    );

                    this.toastr.success(
                        'Convite aceito com sucesso'
                    );
                },
                error: () => {
                    this.toastr.error(
                        'Nao foi possivel aceitar o convite'
                    );
                }
            });
    }

    irParaLoginMantendoConvite(): void {
        this.redirecionarParaLoginComRetorno();
    }

    irParaSistema(): void {
        if (this.usuarioLogado) {
            this.irParaInicio();
            return;
        }

        this.irParaLogin();
    }

    irParaLogin(): void {
        this.router.navigate(['/login']);
    }

    irParaInicio(): void {
        this.router.navigate(['/']);
    }

    private atualizarContextoAposAceite(
        idOrganizacao: number
    ): Observable<void> {
        const organizacaoAnterior =
            this.contextoOrganizacaoService
                .retornarOrganizacaoAtiva();

        return this.contextoOrganizacaoService
            .carregarESelecionarPadrao()
            .pipe(
                switchMap(() => {
                    this.contextoOrganizacaoService
                        .definirOrganizacaoAtiva(
                            idOrganizacao
                        );

                    return this.permissoesUsuarioService
                        .carregarPermissoes();
                }),
                map(() => undefined),
                catchError(() => {
                    this.reverterOrganizacaoAtiva(
                        organizacaoAnterior
                    );

                    return of(undefined);
                })
            );
    }

    private reverterOrganizacaoAtiva(
        organizacaoAnterior:
            OrganizacaoDisponivel | null
    ): void {
        if (!organizacaoAnterior) {
            return;
        }

        try {
            this.contextoOrganizacaoService
                .definirOrganizacaoAtiva(
                    organizacaoAnterior.id
                );
        } catch {
            return;
        }
    }

    private redirecionarParaLoginComRetorno(): void {
        this.router.navigate(
            ['/login'],
            {
                queryParams: {
                    returnUrl:
                        this.obterUrlRetornoConvite()
                }
            }
        );
    }

    private obterUrlRetornoConvite(): string {
        return '/convites/organizacao/aceitar' +
            `?token=${encodeURIComponent(this.token)}`;
    }

    private concluirAceite(
        nomeOrganizacao: string
    ): void {
        this.concluido = true;
        this.convite = null;
        this.erro = '';
        this.nomeOrganizacaoAceita =
            nomeOrganizacao;
    }
}
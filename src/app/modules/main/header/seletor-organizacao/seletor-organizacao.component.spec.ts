import {
    CommonModule
} from '@angular/common';

import {
    ComponentFixture,
    TestBed,
    waitForAsync
} from '@angular/core/testing';

import {
    FormsModule
} from '@angular/forms';

import {
    Router
} from '@angular/router';

import {
    ToastrService
} from 'ngx-toastr';

import {
    BehaviorSubject,
    of,
    Subject,
    throwError
} from 'rxjs';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

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
    ProximaEtapaConfiguracao
} from '@/domain/configuracao/configuracao-inicial/models/estado-configuracao-inicial.model';

import {
    ConfiguracaoInicialService
} from '@/domain/configuracao/configuracao-inicial/services/configuracao-inicial.service';

import {
    SeletorOrganizacaoComponent
} from './seletor-organizacao.component';

describe('SeletorOrganizacaoComponent', () => {

    let component:
        SeletorOrganizacaoComponent;

    let fixture:
        ComponentFixture<
            SeletorOrganizacaoComponent
        >;

    let organizacoesSubject:
        BehaviorSubject<
            OrganizacaoDisponivel[]
        >;

    let organizacaoAtivaSubject:
        BehaviorSubject<
            OrganizacaoDisponivel | null
        >;

    let contextoOrganizacaoService:
        jasmine.SpyObj<
            ContextoOrganizacaoService
        >;

    let permissoesUsuarioService:
        jasmine.SpyObj<
            PermissoesUsuarioService
        >;

    let autorizacaoService:
        jasmine.SpyObj<
            AutorizacaoService
        >;

    let configuracaoInicialService:
        jasmine.SpyObj<
            ConfiguracaoInicialService
        >;

    let toastr:
        jasmine.SpyObj<
            ToastrService
        >;

    const organizacaoPrincipal:
        OrganizacaoDisponivel = {
            id: 1,
            nome:
                'Organização Principal'
        };

    const organizacaoFilial:
        OrganizacaoDisponivel = {
            id: 2,
            nome:
                'Organização Filial'
        };

    const routerMock = {
        navigate:
            jasmine.createSpy(
                'navigate'
            ),
        url:
            '/configuracao/empresas',
        routerState: {
            snapshot: {
                root: {
                    data: {},
                    firstChild:
                        null as unknown
                }
            }
        }
    };

    beforeEach(
        waitForAsync(() => {
            organizacoesSubject =
                new BehaviorSubject<
                    OrganizacaoDisponivel[]
                >([
                    organizacaoPrincipal,
                    organizacaoFilial
                ]);

            organizacaoAtivaSubject =
                new BehaviorSubject<
                    OrganizacaoDisponivel | null
                >(
                    organizacaoPrincipal
                );

            contextoOrganizacaoService =
                jasmine.createSpyObj<
                    ContextoOrganizacaoService
                >(
                    'ContextoOrganizacaoService',
                    [
                        'retornarOrganizacoesDisponiveis',
                        'retornarOrganizacaoAtivaObservable',
                        'foiCarregado',
                        'carregarESelecionarPadrao',
                        'definirOrganizacaoAtiva',
                        'iniciarTrocaOrganizacao',
                        'finalizarTrocaOrganizacao'
                    ]
                );

            permissoesUsuarioService =
                jasmine.createSpyObj<
                    PermissoesUsuarioService
                >(
                    'PermissoesUsuarioService',
                    [
                        'carregarPermissoes'
                    ]
                );

            autorizacaoService =
                jasmine.createSpyObj<
                    AutorizacaoService
                >(
                    'AutorizacaoService',
                    [
                        'possuiPermissao',
                        'possuiAlgumaPermissao'
                    ]
                );

            configuracaoInicialService =
                jasmine.createSpyObj<
                    ConfiguracaoInicialService
                >(
                    'ConfiguracaoInicialService',
                    [
                        'consultar',
                        'limparEstado'
                    ]
                );

            toastr =
                jasmine.createSpyObj<
                    ToastrService
                >(
                    'ToastrService',
                    [
                        'error',
                        'success',
                        'warning'
                    ]
                );

            contextoOrganizacaoService
                .retornarOrganizacoesDisponiveis
                .and
                .returnValue(
                    organizacoesSubject
                        .asObservable()
                );

            contextoOrganizacaoService
                .retornarOrganizacaoAtivaObservable
                .and
                .returnValue(
                    organizacaoAtivaSubject
                        .asObservable()
                );

            contextoOrganizacaoService
                .foiCarregado
                .and
                .returnValue(true);

            contextoOrganizacaoService
                .carregarESelecionarPadrao
                .and
                .returnValue(
                    of(
                        organizacaoPrincipal
                    )
                );

            contextoOrganizacaoService
                .definirOrganizacaoAtiva
                .and
                .callFake(
                    (
                        idOrganizacao:
                            number
                    ) => {
                        const organizacao =
                            [
                                organizacaoPrincipal,
                                organizacaoFilial
                            ].find(
                                (item) =>
                                    item.id ===
                                    idOrganizacao
                            );

                        if (!organizacao) {
                            throw new Error(
                                'Organização indisponível.'
                            );
                        }

                        organizacaoAtivaSubject
                            .next(
                                organizacao
                            );

                        return organizacao;
                    }
                );

            permissoesUsuarioService
                .carregarPermissoes
                .and
                .returnValue(
                    of(undefined)
                );

            autorizacaoService
                .possuiPermissao
                .and
                .returnValue(true);

            autorizacaoService
                .possuiAlgumaPermissao
                .and
                .returnValue(true);

            configuracaoInicialService
                .consultar
                .and
                .returnValue(
                    of({
                        empresaCadastrada:
                            true,
                        proximaEtapa:
                            null
                    })
                );

            routerMock.navigate
                .calls
                .reset();

            routerMock.navigate
                .and
                .returnValue(
                    Promise.resolve(true)
                );

            routerMock.url =
                '/configuracao/empresas';

            definirDadosRota({});

            TestBed
                .configureTestingModule({
                    declarations: [
                        SeletorOrganizacaoComponent
                    ],
                    imports: [
                        CommonModule,
                        FormsModule
                    ],
                    providers: [
                        {
                            provide:
                                ContextoOrganizacaoService,
                            useValue:
                                contextoOrganizacaoService
                        },
                        {
                            provide:
                                PermissoesUsuarioService,
                            useValue:
                                permissoesUsuarioService
                        },
                        {
                            provide:
                                AutorizacaoService,
                            useValue:
                                autorizacaoService
                        },
                        {
                            provide:
                                ConfiguracaoInicialService,
                            useValue:
                                configuracaoInicialService
                        },
                        {
                            provide:
                                ToastrService,
                            useValue:
                                toastr
                        },
                        {
                            provide:
                                Router,
                            useValue:
                                routerMock
                        }
                    ]
                })
                .compileComponents();
        })
    );

    it(
        'deve ser criado',
        () => {

            criarComponente();

            expect(component)
                .toBeTruthy();
        }
    );

    it(
        'deve exibir a organizacao ativa',
        () => {

            criarComponente();

            expect(
                component.organizacoes
            ).toEqual([
                organizacaoPrincipal,
                organizacaoFilial
            ]);

            expect(
                component.organizacaoAtiva
            ).toEqual(
                organizacaoPrincipal
            );

            expect(
                component
                    .idOrganizacaoSelecionada
            ).toBe(1);
        }
    );

    it(
        'deve carregar organizacoes quando o contexto ainda nao foi carregado',
        () => {

            contextoOrganizacaoService
                .foiCarregado
                .and
                .returnValue(false);

            criarComponente();

            expect(
                contextoOrganizacaoService
                    .carregarESelecionarPadrao
            ).toHaveBeenCalledTimes(1);
        }
    );

    it(
        'deve trocar a organizacao, carregar permissoes e consultar a configuracao',
        () => {

            criarComponente();

            component
                .trocarOrganizacao(2);

            expect(
                contextoOrganizacaoService
                    .iniciarTrocaOrganizacao
            ).toHaveBeenCalledTimes(1);

            expect(
                contextoOrganizacaoService
                    .definirOrganizacaoAtiva
            ).toHaveBeenCalledOnceWith(
                2
            );

            expect(
                permissoesUsuarioService
                    .carregarPermissoes
            ).toHaveBeenCalledTimes(1);

            expect(
                configuracaoInicialService
                    .consultar
            ).toHaveBeenCalledTimes(1);

            expect(
                contextoOrganizacaoService
                    .finalizarTrocaOrganizacao
            ).toHaveBeenCalledTimes(1);

            expect(
                component.organizacaoAtiva
            ).toEqual(
                organizacaoFilial
            );

            expect(
                toastr.success
            ).toHaveBeenCalledOnceWith(
                'Organização ativa alterada.'
            );
        }
    );

    it(
        'deve manter o bloqueio enquanto a troca estiver em andamento',
        () => {

            const respostaPermissoes =
                new Subject<void>();

            permissoesUsuarioService
                .carregarPermissoes
                .and
                .returnValue(
                    respostaPermissoes
                        .asObservable()
                );

            criarComponente();

            component
                .trocarOrganizacao(2);

            expect(component.trocando)
                .toBeTrue();

            expect(
                component
                    .exibindoCarregamento
            ).toBeTrue();

            expect(
                component
                    .controleDesabilitado
            ).toBeTrue();

            expect(
                contextoOrganizacaoService
                    .finalizarTrocaOrganizacao
            ).not.toHaveBeenCalled();

            respostaPermissoes.next();
            respostaPermissoes.complete();

            expect(component.trocando)
                .toBeFalse();

            expect(
                contextoOrganizacaoService
                    .finalizarTrocaOrganizacao
            ).toHaveBeenCalledTimes(1);
        }
    );

    it(
        'deve ignorar troca para a organizacao ativa',
        () => {

            criarComponente();

            component
                .trocarOrganizacao(1);

            expect(
                contextoOrganizacaoService
                    .definirOrganizacaoAtiva
            ).not.toHaveBeenCalled();

            expect(
                permissoesUsuarioService
                    .carregarPermissoes
            ).not.toHaveBeenCalled();

            expect(
                contextoOrganizacaoService
                    .iniciarTrocaOrganizacao
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve informar quando a organizacao nao estiver disponivel',
        () => {

            criarComponente();

            component
                .trocarOrganizacao(99);

            expect(
                permissoesUsuarioService
                    .carregarPermissoes
            ).not.toHaveBeenCalled();

            expect(
                contextoOrganizacaoService
                    .finalizarTrocaOrganizacao
            ).toHaveBeenCalledTimes(1);

            expect(
                component
                    .idOrganizacaoSelecionada
            ).toBe(1);

            expect(
                toastr.error
            ).toHaveBeenCalledOnceWith(
                'Organização indisponível para o usuário.'
            );
        }
    );

    it(
        'deve reverter a organizacao quando as permissoes falharem',
        () => {

            permissoesUsuarioService
                .carregarPermissoes
                .and
                .returnValue(
                    throwError(
                        () =>
                            new Error(
                                'Falha nas permissões'
                            )
                    )
                );

            criarComponente();

            component
                .trocarOrganizacao(2);

            expect(
                contextoOrganizacaoService
                    .definirOrganizacaoAtiva
            ).toHaveBeenCalledWith(2);

            expect(
                contextoOrganizacaoService
                    .definirOrganizacaoAtiva
            ).toHaveBeenCalledWith(1);

            expect(
                component
                    .idOrganizacaoSelecionada
            ).toBe(1);

            expect(
                toastr.error
            ).toHaveBeenCalledOnceWith(
                'Não foi possível atualizar as permissões da organização.'
            );
        }
    );

    it(
        'deve abrir configuracao inicial quando a organizacao estiver pendente',
        () => {

            configuracaoInicialService
                .consultar
                .and
                .returnValue(
                    of({
                        empresaCadastrada:
                            false,
                        proximaEtapa:
                            ProximaEtapaConfiguracao
                                .Empresa
                    })
                );

            criarComponente();

            component
                .trocarOrganizacao(2);

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith(
                [
                    '/configuracao-inicial'
                ],
                {
                    replaceUrl: true
                }
            );
        }
    );

    it(
        'deve manter a rota de plataforma quando a organizacao estiver pendente',
        () => {

            routerMock.url =
                '/plataforma/organizacoes';

            configuracaoInicialService
                .consultar
                .and
                .returnValue(
                    of({
                        empresaCadastrada:
                            false,
                        proximaEtapa:
                            ProximaEtapaConfiguracao
                                .Empresa
                    })
                );

            criarComponente();

            component
                .trocarOrganizacao(2);

            expect(
                routerMock.navigate
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve sair da configuracao inicial quando a organizacao estiver concluida',
        () => {

            routerMock.url =
                '/configuracao-inicial';

            criarComponente();

            component
                .trocarOrganizacao(2);

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith(
                [
                    '/configuracao/empresas'
                ],
                {
                    replaceUrl: true
                }
            );
        }
    );

    it(
        'deve redirecionar quando perder a permissao unica da rota atual',
        () => {

            definirDadosRota({
                permissao:
                    ChavePermissao
                        .UsuarioListar
            });

            autorizacaoService
                .possuiPermissao
                .and
                .returnValue(false);

            criarComponente();

            component
                .trocarOrganizacao(2);

            expect(
                autorizacaoService
                    .possuiPermissao
            ).toHaveBeenCalledOnceWith(
                ChavePermissao
                    .UsuarioListar
            );

            expect(
                toastr.warning
            ).toHaveBeenCalledOnceWith(
                'Seu acesso a esta tela não está disponível na organização selecionada.'
            );

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith(
                [
                    '/'
                ],
                {
                    replaceUrl: true
                }
            );
        }
    );

    it(
        'deve manter a rota quando possuir uma permissao alternativa',
        () => {

            const permissoes = [
                ChavePermissao
                    .EmpresaCriar,
                ChavePermissao
                    .EmpresaListar
            ];

            definirDadosRota({
                permissoes
            });

            autorizacaoService
                .possuiAlgumaPermissao
                .and
                .returnValue(true);

            criarComponente();

            component
                .trocarOrganizacao(2);

            expect(
                autorizacaoService
                    .possuiAlgumaPermissao
            ).toHaveBeenCalledOnceWith(
                permissoes
            );

            expect(
                routerMock.navigate
            ).not.toHaveBeenCalled();

            expect(
                toastr.warning
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve redirecionar quando nao possuir nenhuma permissao alternativa',
        () => {

            const permissoes = [
                ChavePermissao
                    .EmpresaCriar,
                ChavePermissao
                    .EmpresaListar
            ];

            definirDadosRota({
                permissoes
            });

            autorizacaoService
                .possuiAlgumaPermissao
                .and
                .returnValue(false);

            criarComponente();

            component
                .trocarOrganizacao(2);

            expect(
                autorizacaoService
                    .possuiAlgumaPermissao
            ).toHaveBeenCalledOnceWith(
                permissoes
            );

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith(
                [
                    '/'
                ],
                {
                    replaceUrl: true
                }
            );

            expect(
                toastr.warning
            ).toHaveBeenCalledTimes(1);
        }
    );

    it(
        'deve abrir configuracao inicial quando falhar a consulta apos carregar permissoes',
        () => {

            configuracaoInicialService
                .consultar
                .and
                .returnValue(
                    throwError(
                        () =>
                            new Error(
                                'Falha na configuração'
                            )
                    )
                );

            criarComponente();

            component
                .trocarOrganizacao(2);

            expect(
                contextoOrganizacaoService
                    .definirOrganizacaoAtiva
            ).toHaveBeenCalledTimes(1);

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith(
                [
                    '/configuracao-inicial'
                ],
                {
                    replaceUrl: true
                }
            );

            expect(
                toastr.error
            ).toHaveBeenCalledOnceWith(
                'Não foi possível verificar a configuração da organização.'
            );
        }
    );

    it(
        'deve sair da configuracao inicial para inicio quando nao possuir acesso a empresas',
        () => {

            routerMock.url =
                '/configuracao-inicial';

            autorizacaoService
                .possuiAlgumaPermissao
                .and
                .returnValue(false);

            criarComponente();

            component
                .trocarOrganizacao(2);

            expect(
                autorizacaoService
                    .possuiAlgumaPermissao
            ).toHaveBeenCalledOnceWith([
                ChavePermissao
                    .EmpresaCriar,
                ChavePermissao
                    .EmpresaListar
            ]);

            expect(
                routerMock.navigate
            ).toHaveBeenCalledOnceWith(
                [
                    '/'
                ],
                {
                    replaceUrl: true
                }
            );

            expect(
                toastr.warning
            ).not.toHaveBeenCalled();

            expect(
                toastr.success
            ).toHaveBeenCalledOnceWith(
                'Organização ativa alterada.'
            );
        }
    );

    function criarComponente(): void {
        fixture =
            TestBed.createComponent(
                SeletorOrganizacaoComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    }

    function definirDadosRota(
        data:
            Record<string, unknown>
    ): void {

        routerMock
            .routerState
            .snapshot
            .root
            .firstChild = {
                data,
                firstChild: null
            };
    }
});
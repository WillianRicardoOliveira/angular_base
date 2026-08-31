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
    throwError
} from 'rxjs';

import {
    OrganizacaoDisponivel
} from '@/core/organizacao/models/organizacao-disponivel.model';
import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';
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
    SeletorOrganizacaoComponent
} from './seletor-organizacao.component';

describe('SeletorOrganizacaoComponent', () => {
    let component:
        SeletorOrganizacaoComponent;

    let fixture:
        ComponentFixture<SeletorOrganizacaoComponent>;

    let organizacoesSubject:
        BehaviorSubject<OrganizacaoDisponivel[]>;

    let organizacaoAtivaSubject:
        BehaviorSubject<OrganizacaoDisponivel | null>;

    let contextoOrganizacaoServiceMock:
        jasmine.SpyObj<ContextoOrganizacaoService>;

    let permissoesUsuarioServiceMock:
        jasmine.SpyObj<PermissoesUsuarioService>;

    let autorizacaoServiceMock:
        jasmine.SpyObj<AutorizacaoService>;

    let toastrMock:
        jasmine.SpyObj<ToastrService>;

    let routerMock:
        jasmine.SpyObj<Router>;

    const organizacaoPrincipal:
        OrganizacaoDisponivel = {
            id: 1,
            nome: 'Organização Principal'
        };

    const organizacaoFilial:
        OrganizacaoDisponivel = {
            id: 2,
            nome: 'Organização Filial'
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

            contextoOrganizacaoServiceMock =
                jasmine.createSpyObj<
                    ContextoOrganizacaoService
                >(
                    'ContextoOrganizacaoService',
                    [
                        'retornarOrganizacoesDisponiveis',
                        'retornarOrganizacaoAtivaObservable',
                        'foiCarregado',
                        'carregarESelecionarPadrao',
                        'definirOrganizacaoAtiva'
                    ]
                );

            permissoesUsuarioServiceMock =
                jasmine.createSpyObj<
                    PermissoesUsuarioService
                >(
                    'PermissoesUsuarioService',
                    ['carregarPermissoes']
                );

            autorizacaoServiceMock =
                jasmine.createSpyObj<
                    AutorizacaoService
                >(
                    'AutorizacaoService',
                    ['possuiPermissao']
                );

            toastrMock =
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

            routerMock = {
                navigate:
                    jasmine
                        .createSpy('navigate')
                        .and.returnValue(
                            Promise.resolve(true)
                        ),
                routerState: {
                    snapshot: {
                        root: {
                            data: {},
                            firstChild: null
                        }
                    }
                }
            } as unknown as jasmine.SpyObj<Router>;

            contextoOrganizacaoServiceMock
                .retornarOrganizacoesDisponiveis
                .and.returnValue(
                    organizacoesSubject
                        .asObservable()
                );

            contextoOrganizacaoServiceMock
                .retornarOrganizacaoAtivaObservable
                .and.returnValue(
                    organizacaoAtivaSubject
                        .asObservable()
                );

            contextoOrganizacaoServiceMock
                .foiCarregado
                .and.returnValue(true);

            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
                .and.returnValue(
                    of(organizacaoPrincipal)
                );

            contextoOrganizacaoServiceMock
                .definirOrganizacaoAtiva
                .and.callFake(
                    (idOrganizacao: number) => {
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
                                'Organizacao indisponivel.'
                            );
                        }

                        organizacaoAtivaSubject
                            .next(organizacao);

                        return organizacao;
                    }
                );

            permissoesUsuarioServiceMock
                .carregarPermissoes
                .and.returnValue(
                    of(undefined)
                );

            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            TestBed.configureTestingModule({
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
                            contextoOrganizacaoServiceMock
                    },
                    {
                        provide:
                            PermissoesUsuarioService,
                        useValue:
                            permissoesUsuarioServiceMock
                    },
                    {
                        provide:
                            AutorizacaoService,
                        useValue:
                            autorizacaoServiceMock
                    },
                    {
                        provide:
                            ToastrService,
                        useValue:
                            toastrMock
                    },
                    {
                        provide: Router,
                        useValue: routerMock
                    }
                ]
            }).compileComponents();
        })
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

    it('deve ser criado', () => {
        criarComponente();

        expect(component).toBeTruthy();
    });

    it('deve exibir a organizacao ativa', () => {
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
            component.idOrganizacaoSelecionada
        ).toBe(1);
    });

    it('deve carregar organizacoes quando o contexto ainda nao foi carregado', () => {
        contextoOrganizacaoServiceMock
            .foiCarregado
            .and.returnValue(false);

        criarComponente();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);
    });

    it('deve trocar a organizacao ativa e recarregar permissoes', () => {
        criarComponente();

        component.trocarOrganizacao(2);

        expect(
            contextoOrganizacaoServiceMock
                .definirOrganizacaoAtiva
        ).toHaveBeenCalledOnceWith(2);

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(
            component.organizacaoAtiva
        ).toEqual(
            organizacaoFilial
        );

        expect(
            toastrMock.success
        ).toHaveBeenCalledOnceWith(
            'Organização ativa alterada.'
        );
    });

    it('deve ignorar troca para a organizacao ja ativa', () => {
        criarComponente();

        component.trocarOrganizacao(1);

        expect(
            contextoOrganizacaoServiceMock
                .definirOrganizacaoAtiva
        ).not.toHaveBeenCalled();

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();
    });

    it('deve informar quando a organizacao nao estiver disponivel', () => {
        criarComponente();

        component.trocarOrganizacao(99);

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();

        expect(
            component.idOrganizacaoSelecionada
        ).toBe(1);

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Organização indisponível para o usuário.'
        );
    });

    it('deve reverter a organizacao quando as permissoes falharem', () => {
        permissoesUsuarioServiceMock
            .carregarPermissoes
            .and.returnValue(
                throwError(
                    () =>
                        new Error(
                            'Falha ao carregar permissoes'
                        )
                )
            );

        criarComponente();

        component.trocarOrganizacao(2);

        expect(
            contextoOrganizacaoServiceMock
                .definirOrganizacaoAtiva
        ).toHaveBeenCalledWith(2);

        expect(
            contextoOrganizacaoServiceMock
                .definirOrganizacaoAtiva
        ).toHaveBeenCalledWith(1);

        expect(
            component.idOrganizacaoSelecionada
        ).toBe(1);

        expect(
            toastrMock.error
        ).toHaveBeenCalledOnceWith(
            'Não foi possível atualizar as permissões da organização.'
        );
    });

    it('deve redirecionar quando a tela atual nao continuar autorizada', () => {
        Object.defineProperty(
            routerMock.routerState.snapshot,
            'root',
            {
                configurable: true,
                writable: true,
                value: {
                    data: {},
                    firstChild: {
                        data: {
                            permissao:
                                ChavePermissao
                                    .UsuarioListar
                        },
                        firstChild: null
                    }
                }
            }
        );

        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(false);

        criarComponente();

        component.trocarOrganizacao(2);

        expect(
            autorizacaoServiceMock
                .possuiPermissao
        ).toHaveBeenCalledOnceWith(
            ChavePermissao.UsuarioListar
        );

        expect(
            toastrMock.warning
        ).toHaveBeenCalledOnceWith(
            'Seu acesso a esta tela não está disponível na organização selecionada.'
        );

        expect(
            routerMock.navigate
        ).toHaveBeenCalledOnceWith(['/']);
    });
});
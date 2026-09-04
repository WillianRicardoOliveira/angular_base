import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick
} from '@angular/core/testing';

import {
    FormBuilder
} from '@angular/forms';

import {
    ActivatedRoute,
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
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    OrganizacaoDisponivel
} from '@/core/organizacao/models/organizacao-disponivel.model';

import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

import {
    Estabelecimento,
    UsuarioEmpresa,
    UsuarioEstabelecimento
} from '@/interfaces/interfaces';

import {
    UsuarioEmpresaService
} from '@/domain/acesso/usuario-empresa/services/usuario-empresa.service';

import {
    EstabelecimentoService
} from '@/domain/configuracao/estabelecimento/services/estabelecimento.service';

import {
    UsuarioEstabelecimentoService
} from './services/usuario-estabelecimento.service';

import {
    UsuarioEstabelecimentoComponent
} from './usuario-estabelecimento.component';

describe('UsuarioEstabelecimentoComponent', () => {
    let component: UsuarioEstabelecimentoComponent;
    let fixture: ComponentFixture<UsuarioEstabelecimentoComponent>;

    let serviceMock: jasmine.SpyObj<UsuarioEstabelecimentoService>;
    let usuarioEmpresaServiceMock: jasmine.SpyObj<UsuarioEmpresaService>;
    let estabelecimentoServiceMock: jasmine.SpyObj<EstabelecimentoService>;

    let organizacaoProntaSubject:
        BehaviorSubject<OrganizacaoDisponivel | null>;

    const contextoOrganizacaoServiceMock = {
        retornarOrganizacaoProntaObservable:
            jasmine.createSpy('retornarOrganizacaoProntaObservable')
    };

    const autorizacaoServiceMock = {
        possuiPermissao:
            jasmine.createSpy('possuiPermissao')
    };

    const routerMock = {
        navigate:
            jasmine.createSpy('navigate')
    };

    const paramMapGetMock =
        jasmine.createSpy('get');

    const activatedRouteMock = {
        snapshot: {
            paramMap: {
                get: paramMapGetMock
            }
        }
    };

    const toastrMock = {
        success: jasmine.createSpy('success'),
        error: jasmine.createSpy('error'),
        info: jasmine.createSpy('info')
    };

    const usuarioEmpresa: UsuarioEmpresa = {
        id: 5,
        idUsuario: 2,
        usuario: 'usuario@empresa.com',
        idEmpresa: 3,
        empresa: 'Empresa Exemplo',
        todosEstabelecimentos: false,
        status: 'ATIVO'
    };

    const estabelecimento: Estabelecimento = {
        id: 11,
        idEmpresa: 3,
        empresa: 'Empresa Exemplo',
        nome: 'Estabelecimento Centro',
        status: 'ATIVO'
    };

    const vinculo: UsuarioEstabelecimento = {
        id: 7,
        idUsuarioEmpresa: 5,
        idUsuario: 2,
        usuario: 'usuario@empresa.com',
        idEmpresa: 3,
        empresa: 'Empresa Exemplo',
        idEstabelecimento: 11,
        estabelecimento: 'Estabelecimento Centro',
        status: 'ATIVO'
    };

    beforeEach(async () => {
        organizacaoProntaSubject =
            new BehaviorSubject<OrganizacaoDisponivel | null>({
                id: 1,
                nome: 'Organizacao 1'
            });

        contextoOrganizacaoServiceMock
            .retornarOrganizacaoProntaObservable
            .calls
            .reset();

        contextoOrganizacaoServiceMock
            .retornarOrganizacaoProntaObservable
            .and.returnValue(
                organizacaoProntaSubject.asObservable()
            );

        autorizacaoServiceMock
            .possuiPermissao
            .calls
            .reset();

        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(false);

        routerMock.navigate.calls.reset();
        toastrMock.success.calls.reset();
        toastrMock.error.calls.reset();
        toastrMock.info.calls.reset();

        paramMapGetMock.calls.reset();
        paramMapGetMock.and.callFake(
            (parametro: string) => {
                if (parametro === 'idUsuario') {
                    return '2';
                }

                if (parametro === 'idUsuarioEmpresa') {
                    return '5';
                }

                return null;
            }
        );

        serviceMock =
            jasmine.createSpyObj<UsuarioEstabelecimentoService>(
                'UsuarioEstabelecimentoService',
                [
                    'listar',
                    'cadastrar',
                    'detalhar',
                    'excluir'
                ]
            );

        serviceMock.listar.and.returnValue(
            of({
                content: [],
                totalElements: 0
            })
        );

        serviceMock.cadastrar.and.returnValue(
            of(vinculo)
        );

        serviceMock.detalhar.and.returnValue(
            of(vinculo)
        );

        serviceMock.excluir.and.returnValue(
            of(undefined)
        );

        usuarioEmpresaServiceMock =
            jasmine.createSpyObj<UsuarioEmpresaService>(
                'UsuarioEmpresaService',
                [
                    'detalhar'
                ]
            );

        usuarioEmpresaServiceMock
            .detalhar
            .and.returnValue(
                of(usuarioEmpresa)
            );

        estabelecimentoServiceMock =
            jasmine.createSpyObj<EstabelecimentoService>(
                'EstabelecimentoService',
                [
                    'listar'
                ]
            );

        estabelecimentoServiceMock
            .listar
            .and.returnValue(
                of({
                    content: [],
                    totalElements: 0
                })
            );

        await TestBed
            .configureTestingModule({
                declarations: [
                    UsuarioEstabelecimentoComponent
                ],
                providers: [
                    FormBuilder,
                    {
                        provide: UsuarioEstabelecimentoService,
                        useValue: serviceMock
                    },
                    {
                        provide: UsuarioEmpresaService,
                        useValue: usuarioEmpresaServiceMock
                    },
                    {
                        provide: EstabelecimentoService,
                        useValue: estabelecimentoServiceMock
                    },
                    {
                        provide: AutorizacaoService,
                        useValue: autorizacaoServiceMock
                    },
                    {
                        provide: ContextoOrganizacaoService,
                        useValue: contextoOrganizacaoServiceMock
                    },
                    {
                        provide: ActivatedRoute,
                        useValue: activatedRouteMock
                    },
                    {
                        provide: Router,
                        useValue: routerMock
                    },
                    {
                        provide: ToastrService,
                        useValue: toastrMock
                    }
                ]
            })
            .overrideComponent(
                UsuarioEstabelecimentoComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                UsuarioEstabelecimentoComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it('deve carregar o contexto e a lista ao inicializar', () => {
        expect(component.idUsuario).toBe(2);
        expect(component.idUsuarioEmpresa).toBe(5);
        expect(component.idEmpresa).toBe(3);
        expect(component.usuarioNome).toBe('usuario@empresa.com');
        expect(component.empresaNome).toBe('Empresa Exemplo');

        expect(usuarioEmpresaServiceMock.detalhar)
            .toHaveBeenCalledOnceWith(5);

        expect(serviceMock.listar)
            .toHaveBeenCalledOnceWith(
                0,
                10,
                'id,desc',
                5
            );
    });

    it('deve redirecionar quando os parametros forem invalidos', () => {
        serviceMock.listar.calls.reset();
        usuarioEmpresaServiceMock.detalhar.calls.reset();
        routerMock.navigate.calls.reset();

        paramMapGetMock.and.returnValue(null);

        component.ngOnInit();

        expect(routerMock.navigate)
            .toHaveBeenCalledOnceWith([
                '/acesso/usuarios'
            ]);

        expect(usuarioEmpresaServiceMock.detalhar)
            .not.toHaveBeenCalled();

        expect(serviceMock.listar)
            .not.toHaveBeenCalled();
    });

    it('deve voltar quando o vinculo nao pertencer ao usuario', () => {
        serviceMock.listar.calls.reset();
        routerMock.navigate.calls.reset();

        usuarioEmpresaServiceMock
            .detalhar
            .and.returnValue(
                of({
                    ...usuarioEmpresa,
                    idUsuario: 99
                })
            );

        component.ngOnInit();

        expect(toastrMock.error)
            .toHaveBeenCalledWith(
                'Vinculo nao pertence ao usuario informado'
            );

        expect(routerMock.navigate)
            .toHaveBeenCalledWith([
                '/acesso/usuarios',
                2,
                'empresas'
            ]);

        expect(serviceMock.listar)
            .not.toHaveBeenCalled();
    });

    it('deve voltar quando o usuario possuir todos os estabelecimentos', () => {
        serviceMock.listar.calls.reset();
        routerMock.navigate.calls.reset();

        usuarioEmpresaServiceMock
            .detalhar
            .and.returnValue(
                of({
                    ...usuarioEmpresa,
                    todosEstabelecimentos: true
                })
            );

        component.ngOnInit();

        expect(toastrMock.info)
            .toHaveBeenCalledWith(
                'Usuario ja possui acesso a todos os estabelecimentos da empresa'
            );

        expect(routerMock.navigate)
            .toHaveBeenCalledWith([
                '/acesso/usuarios',
                2,
                'empresas'
            ]);

        expect(serviceMock.listar)
            .not.toHaveBeenCalled();
    });

    it('deve preencher a lista paginada', () => {
        serviceMock.listar.calls.reset();

        serviceMock.listar.and.returnValue(
            of({
                content: [
                    vinculo
                ],
                totalElements: 1
            })
        );

        component.carregarLista(
            1,
            20
        );

        expect(serviceMock.listar)
            .toHaveBeenCalledOnceWith(
                1,
                20,
                'id,desc',
                5
            );

        expect(component.lista)
            .toEqual([
                {
                    id: 7,
                    idUsuarioEmpresa: 5,
                    usuario: 'usuario@empresa.com',
                    empresa: 'Empresa Exemplo',
                    idEstabelecimento: 11,
                    estabelecimento: 'Estabelecimento Centro',
                    status: 'ATIVO'
                }
            ]);

        expect(component.totalRegistros).toBe(1);
        expect(component.paginaAtual).toBe(1);
        expect(component.tamanhoPagina).toBe(20);
    });

    it('deve controlar permissoes da tela', () => {
        autorizar(
            ChavePermissao.UsuarioEstabelecimentoCriar,
            ChavePermissao.UsuarioEstabelecimentoDetalhar
        );

        expect(component.podeCriar).toBeTrue();
        expect(component.podeExcluir).toBeFalse();
        expect(component.podeDetalhar).toBeTrue();
    });

    it('deve abrir formulario de vinculo quando autorizado', () => {
        autorizar(
            ChavePermissao.UsuarioEstabelecimentoCriar
        );

        estabelecimentoServiceMock.listar.calls.reset();

        component.botaoAdicionar();

        expect(component.isLista).toBeFalse();
        expect(component.isFormulario).toBeTrue();
        expect(component.isVisualizacao).toBeFalse();

        expect(component.formulario.getRawValue())
            .toEqual({
                idUsuarioEmpresa: 5,
                idEstabelecimento: null
            });

        expect(estabelecimentoServiceMock.listar)
            .toHaveBeenCalledOnceWith(
                0,
                10,
                'nome,asc',
                '',
                3
            );
    });

    it('nao deve abrir formulario sem permissao', () => {
        estabelecimentoServiceMock.listar.calls.reset();

        component.botaoAdicionar();

        expect(component.isLista).toBeTrue();
        expect(component.isFormulario).toBeFalse();

        expect(estabelecimentoServiceMock.listar)
            .not.toHaveBeenCalled();
    });

    it('deve selecionar e vincular estabelecimento', () => {
        autorizar(
            ChavePermissao.UsuarioEstabelecimentoCriar
        );

        component.botaoAdicionar();
        component.selecionarEstabelecimento(estabelecimento);

        serviceMock.listar.calls.reset();

        component.salvar();

        expect(serviceMock.cadastrar)
            .toHaveBeenCalledOnceWith({
                idUsuarioEmpresa: 5,
                idEstabelecimento: 11
            });

        expect(serviceMock.listar)
            .toHaveBeenCalledOnceWith(
                0,
                10,
                'id,desc',
                5
            );

        expect(toastrMock.success)
            .toHaveBeenCalledWith(
                'Estabelecimento vinculado com sucesso'
            );

        expect(component.isLista).toBeTrue();
    });

    it('nao deve salvar formulario invalido', () => {
        autorizar(
            ChavePermissao.UsuarioEstabelecimentoCriar
        );

        component.botaoAdicionar();
        component.salvar();

        expect(serviceMock.cadastrar)
            .not.toHaveBeenCalled();
    });

    it('deve pesquisar estabelecimentos por empresa', fakeAsync(() => {
        autorizar(
            ChavePermissao.UsuarioEstabelecimentoCriar
        );

        component.botaoAdicionar();

        estabelecimentoServiceMock.listar.calls.reset();

        component.estabelecimentoPesquisaControl
            .setValue('Centro');

        tick(300);

        expect(estabelecimentoServiceMock.listar)
            .toHaveBeenCalledOnceWith(
                0,
                10,
                'nome,asc',
                'Centro',
                3
            );
    }));

    it('deve detalhar vinculo quando autorizado', () => {
        autorizar(
            ChavePermissao.UsuarioEstabelecimentoDetalhar
        );

        component.botaoVisualizar(7);

        expect(serviceMock.detalhar)
            .toHaveBeenCalledOnceWith(7);

        expect(component.isFormulario).toBeTrue();
        expect(component.isVisualizacao).toBeTrue();
        expect(component.formulario.disabled).toBeTrue();

        expect(component.formulario.getRawValue())
            .toEqual({
                id: 7,
                idUsuarioEmpresa: 5,
                usuario: 'usuario@empresa.com',
                empresa: 'Empresa Exemplo',
                idEstabelecimento: 11,
                estabelecimento: 'Estabelecimento Centro',
                status: 'ATIVO'
            });
    });

    it('deve excluir vinculo quando autorizado', () => {
        autorizar(
            ChavePermissao.UsuarioEstabelecimentoExcluir
        );

        serviceMock.listar.calls.reset();

        component.botaoExcluir(7);

        expect(serviceMock.excluir)
            .toHaveBeenCalledOnceWith(7);

        expect(serviceMock.listar)
            .toHaveBeenCalledOnceWith(
                0,
                10,
                'id,desc',
                5
            );

        expect(toastrMock.info)
            .toHaveBeenCalledWith(
                'Estabelecimento removido do usuario'
            );
    });

    it('deve limpar o estado enquanto troca de organizacao e voltar quando o novo contexto estiver pronto', () => {
        serviceMock.listar.calls.reset();
        routerMock.navigate.calls.reset();

        component.formulario =
            new FormBuilder().group({
                idUsuarioEmpresa: [5],
                idEstabelecimento: [11]
            });

        component.lista = [
            vinculo
        ];

        component.estabelecimentos = [
            estabelecimento
        ];

        component.totalRegistros = 1;
        component.paginaAtual = 2;
        component.tamanhoPagina = 20;
        component.idEmpresa = 3;
        component.usuarioNome =
            'usuario@empresa.com';
        component.empresaNome =
            'Empresa Exemplo';
        component.isLista = false;
        component.isFormulario = true;
        component.isVisualizacao = true;

        organizacaoProntaSubject.next(null);

        expect(component.isLista)
            .toBeTrue();

        expect(component.isFormulario)
            .toBeFalse();

        expect(component.isVisualizacao)
            .toBeFalse();

        expect(component.lista)
            .toEqual([]);

        expect(component.estabelecimentos)
            .toEqual([]);

        expect(component.totalRegistros)
            .toBe(0);

        expect(component.paginaAtual)
            .toBe(0);

        expect(component.tamanhoPagina)
            .toBe(10);

        expect(component.idEmpresa)
            .toBe(0);

        expect(component.usuarioNome)
            .toBe('');

        expect(component.empresaNome)
            .toBe('');

        expect(serviceMock.listar)
            .not.toHaveBeenCalled();

        expect(routerMock.navigate)
            .not.toHaveBeenCalled();

        organizacaoProntaSubject.next({
            id: 2,
            nome: 'Organizacao 2'
        });

        expect(serviceMock.listar)
            .not.toHaveBeenCalled();

        expect(routerMock.navigate)
            .toHaveBeenCalledOnceWith([
                '/acesso/usuarios',
                2,
                'empresas'
            ]);
    });

    it('deve informar erro ao falhar no carregamento', () => {
        serviceMock.listar.and.returnValue(
            throwError(() => new Error())
        );

        component.carregarLista();

        expect(toastrMock.error)
            .toHaveBeenCalledWith(
                'Nao foi possivel carregar os estabelecimentos do usuario'
            );
    });

    function autorizar(
        ...permissoesAutorizadas: ChavePermissao[]
    ): void {
        autorizacaoServiceMock
            .possuiPermissao
            .and.callFake(
                (permissao: ChavePermissao) =>
                    permissoesAutorizadas.includes(
                        permissao
                    )
            );
    }
});
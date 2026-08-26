import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import {
    FormBuilder
} from '@angular/forms';

import {
    ActivatedRoute,
    Router,
    convertToParamMap
} from '@angular/router';

import {
    ToastrService
} from 'ngx-toastr';

import {
    of,
    throwError
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
    ConviteOrganizacaoService
} from '../services/convite-organizacao.service';

import {
    AceiteConviteOrganizacaoComponent
} from './aceite-convite-organizacao.component';

describe('AceiteConviteOrganizacaoComponent', () => {
    let component:
        AceiteConviteOrganizacaoComponent;

    let fixture:
        ComponentFixture<AceiteConviteOrganizacaoComponent>;

    let serviceMock:
        jasmine.SpyObj<ConviteOrganizacaoService>;

    let contextoOrganizacaoServiceMock:
        jasmine.SpyObj<ContextoOrganizacaoService>;

    let permissoesUsuarioServiceMock:
        jasmine.SpyObj<PermissoesUsuarioService>;

    const organizacaoAnterior:
        OrganizacaoDisponivel = {
            id: 1,
            nome: 'Organizacao Atual'
        };

    const usuarioAutenticadoServiceMock = {
        estaLogado:
            jasmine.createSpy('estaLogado')
    };

    const routerMock = {
        navigate:
            jasmine.createSpy('navigate')
    };

    const toastrMock = {
        success:
            jasmine.createSpy('success'),
        error:
            jasmine.createSpy('error')
    };

    const activatedRouteMock = {
        snapshot: {
            queryParamMap:
                convertToParamMap({
                    token: 'token-convite'
                })
        }
    };

    beforeEach(async () => {
        serviceMock =
            jasmine.createSpyObj<
                ConviteOrganizacaoService
            >(
                'ConviteOrganizacaoService',
                [
                    'consultar',
                    'aceitarUsuarioExistente',
                    'aceitarNovoUsuario'
                ]
            );

        contextoOrganizacaoServiceMock =
            jasmine.createSpyObj<
                ContextoOrganizacaoService
            >(
                'ContextoOrganizacaoService',
                [
                    'retornarOrganizacaoAtiva',
                    'carregarESelecionarPadrao',
                    'definirOrganizacaoAtiva'
                ]
            );

        permissoesUsuarioServiceMock =
            jasmine.createSpyObj<
                PermissoesUsuarioService
            >(
                'PermissoesUsuarioService',
                [
                    'carregarPermissoes'
                ]
            );

        serviceMock.consultar.and.returnValue(
            of({
                nomeOrganizacao:
                    'Organizacao Exemplo',
                emailAdministradorMascarado:
                    'a***@empresa.com',
                usuarioExistente: false
            })
        );

        serviceMock.aceitarNovoUsuario
            .and.returnValue(
                of({
                    idOrganizacao: 10,
                    nomeOrganizacao:
                        'Organizacao Exemplo'
                })
            );

        serviceMock.aceitarUsuarioExistente
            .and.returnValue(
                of({
                    idOrganizacao: 10,
                    nomeOrganizacao:
                        'Organizacao Exemplo'
                })
            );

        contextoOrganizacaoServiceMock
            .retornarOrganizacaoAtiva
            .and.returnValue(
                organizacaoAnterior
            );

        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .and.returnValue(
                of({
                    id: 10,
                    nome: 'Organizacao Exemplo'
                })
            );

        contextoOrganizacaoServiceMock
            .definirOrganizacaoAtiva
            .and.returnValue({
                id: 10,
                nome: 'Organizacao Exemplo'
            });

        permissoesUsuarioServiceMock
            .carregarPermissoes
            .and.returnValue(
                of(undefined)
            );

        usuarioAutenticadoServiceMock
            .estaLogado
            .calls
            .reset();

        usuarioAutenticadoServiceMock
            .estaLogado
            .and.returnValue(false);

        routerMock.navigate.calls.reset();
        toastrMock.success.calls.reset();
        toastrMock.error.calls.reset();

        await TestBed
            .configureTestingModule({
                declarations: [
                    AceiteConviteOrganizacaoComponent
                ],
                providers: [
                    FormBuilder,
                    {
                        provide:
                            ConviteOrganizacaoService,
                        useValue:
                            serviceMock
                    },
                    {
                        provide:
                            UsuarioAutenticadoService,
                        useValue:
                            usuarioAutenticadoServiceMock
                    },
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
                            ActivatedRoute,
                        useValue:
                            activatedRouteMock
                    },
                    {
                        provide: Router,
                        useValue: routerMock
                    },
                    {
                        provide:
                            ToastrService,
                        useValue:
                            toastrMock
                    }
                ]
            })
            .overrideComponent(
                AceiteConviteOrganizacaoComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                AceiteConviteOrganizacaoComponent
            );

        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it('deve consultar convite pelo token da URL', () => {
        expect(component.token)
            .toBe('token-convite');

        expect(serviceMock.consultar)
            .toHaveBeenCalledOnceWith(
                'token-convite'
            );

        expect(component.convite)
            .toEqual({
                nomeOrganizacao:
                    'Organizacao Exemplo',
                emailAdministradorMascarado:
                    'a***@empresa.com',
                usuarioExistente: false
            });
    });

    it('deve aceitar convite criando novo usuario', () => {
        component.formulario.patchValue({
            senha: 'SenhaForte@123',
            confirmarSenha: 'SenhaForte@123'
        });

        component.aceitarNovoUsuario();

        expect(serviceMock.aceitarNovoUsuario)
            .toHaveBeenCalledOnceWith({
                token: 'token-convite',
                senha: 'SenhaForte@123'
            });

        expect(component.concluido).toBeTrue();

        expect(component.nomeOrganizacaoAceita)
            .toBe('Organizacao Exemplo');

        expect(toastrMock.success)
            .toHaveBeenCalled();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).not.toHaveBeenCalled();

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();
    });

    it('nao deve aceitar novo usuario com senhas diferentes', () => {
        component.formulario.patchValue({
            senha: 'SenhaForte@123',
            confirmarSenha: 'OutraSenha@123'
        });

        component.aceitarNovoUsuario();

        expect(serviceMock.aceitarNovoUsuario)
            .not.toHaveBeenCalled();

        expect(
            component.formulario
                .get('confirmarSenha')
                ?.hasError('senhasDiferentes')
        ).toBeTrue();
    });

    it('deve redirecionar para login quando usuario existente nao estiver logado', () => {
        component.convite = {
            nomeOrganizacao:
                'Organizacao Exemplo',
            emailAdministradorMascarado:
                'a***@empresa.com',
            usuarioExistente: true
        };

        component.aceitarUsuarioExistente();

        expect(routerMock.navigate)
            .toHaveBeenCalledOnceWith(
                ['/login'],
                {
                    queryParams: {
                        returnUrl:
                            '/convites/organizacao/aceitar?token=token-convite'
                    }
                }
            );

        expect(serviceMock.aceitarUsuarioExistente)
            .not.toHaveBeenCalled();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).not.toHaveBeenCalled();

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();
    });

    it('deve aceitar convite com usuario existente logado e atualizar contexto', () => {
        usuarioAutenticadoServiceMock
            .estaLogado
            .and.returnValue(true);

        component.convite = {
            nomeOrganizacao:
                'Organizacao Exemplo',
            emailAdministradorMascarado:
                'a***@empresa.com',
            usuarioExistente: true
        };

        component.aceitarUsuarioExistente();

        expect(serviceMock.aceitarUsuarioExistente)
            .toHaveBeenCalledOnceWith(
                'token-convite'
            );

        expect(
            contextoOrganizacaoServiceMock
                .retornarOrganizacaoAtiva
        ).toHaveBeenCalledTimes(1);

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);

        expect(
            contextoOrganizacaoServiceMock
                .definirOrganizacaoAtiva
        ).toHaveBeenCalledOnceWith(10);

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(component.concluido).toBeTrue();

        expect(toastrMock.success)
            .toHaveBeenCalled();
    });

    it('deve concluir aceite mesmo quando atualizacao local de contexto falhar', () => {
        usuarioAutenticadoServiceMock
            .estaLogado
            .and.returnValue(true);

        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .and.returnValue(
                throwError(() => new Error())
            );

        contextoOrganizacaoServiceMock
            .definirOrganizacaoAtiva
            .and.returnValue(
                organizacaoAnterior
            );

        component.convite = {
            nomeOrganizacao:
                'Organizacao Exemplo',
            emailAdministradorMascarado:
                'a***@empresa.com',
            usuarioExistente: true
        };

        component.aceitarUsuarioExistente();

        expect(serviceMock.aceitarUsuarioExistente)
            .toHaveBeenCalledOnceWith(
                'token-convite'
            );

        expect(
            contextoOrganizacaoServiceMock
                .definirOrganizacaoAtiva
        ).toHaveBeenCalledOnceWith(1);

        expect(component.concluido).toBeTrue();

        expect(toastrMock.success)
            .toHaveBeenCalled();
    });

    it('deve informar erro quando convite for invalido', () => {
        serviceMock.consultar.and.returnValue(
            throwError(() => new Error())
        );

        component.consultarConvite();

        expect(component.erro)
            .toBe(
                'Convite invalido ou expirado.'
            );
    });

    it('deve navegar para login mantendo retorno do convite para aceitar', () => {
        component.irParaLoginMantendoConvite();

        expect(routerMock.navigate)
            .toHaveBeenCalledWith(
                ['/login'],
                {
                    queryParams: {
                        returnUrl:
                            '/convites/organizacao/aceitar?token=token-convite'
                    }
                }
            );
    });

    it('deve navegar para login sem retorno quando usuario nao estiver logado', () => {
        component.irParaLogin();

        expect(routerMock.navigate)
            .toHaveBeenCalledWith(['/login']);
    });

    it('deve navegar para inicio ao entrar no sistema com usuario logado', () => {
        usuarioAutenticadoServiceMock
            .estaLogado
            .and.returnValue(true);

        component.irParaSistema();

        expect(routerMock.navigate)
            .toHaveBeenCalledWith(['/']);
    });

    it('deve navegar para login ao entrar no sistema sem usuario logado', () => {
        component.irParaSistema();

        expect(routerMock.navigate)
            .toHaveBeenCalledWith(['/login']);
    });

    it('deve navegar para inicio', () => {
        component.irParaInicio();

        expect(routerMock.navigate)
            .toHaveBeenCalledWith(['/']);
    });
});
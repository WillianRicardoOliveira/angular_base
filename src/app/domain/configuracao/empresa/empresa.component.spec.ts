import {
    Location
} from '@angular/common';

import {
    ComponentFixture,
    TestBed
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
    Observable,
    of
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
    EstadoConfiguracaoInicial,
    ProximaEtapaConfiguracao
} from '@/domain/configuracao/configuracao-inicial/models/estado-configuracao-inicial.model';

import {
    ConfiguracaoInicialService
} from '@/domain/configuracao/configuracao-inicial/services/configuracao-inicial.service';

import {
    BaseService
} from '@services/base/base.service';

import {
    PaisService
} from '../pais/services/pais.service';

import {
    EmpresaService as EmpresaConfiguracaoService
} from './services/empresa.service';

import {
    EmpresaComponent
} from './empresa.component';

describe('EmpresaComponent', () => {

    let component:
        EmpresaComponent;

    let fixture:
        ComponentFixture<
            EmpresaComponent
        >;

    let baseService:
        jasmine.SpyObj<
            BaseService
        >;

    let configuracaoInicialService:
        jasmine.SpyObj<
            ConfiguracaoInicialService
        >;

    let paisService:
        jasmine.SpyObj<
            PaisService
        >;

    let empresaService:
        jasmine.SpyObj<
            EmpresaConfiguracaoService
        >;

    let organizacaoProntaSubject:
        BehaviorSubject<
            OrganizacaoDisponivel | null
        >;

    let permissoes:
        Set<ChavePermissao>;

    let acaoRota:
        string | null;

    const contextoOrganizacaoServiceMock = {
        retornarOrganizacaoProntaObservable:
            jasmine.createSpy(
                'retornarOrganizacaoProntaObservable'
            )
    };

    const autorizacaoServiceMock = {
        possuiPermissao:
            jasmine.createSpy(
                'possuiPermissao'
            )
    };

    const routerMock = {
        navigate:
            jasmine.createSpy(
                'navigate'
            ),
        routeReuseStrategy: {
            shouldReuseRoute:
                jasmine.createSpy(
                    'shouldReuseRoute'
                )
        },
        onSameUrlNavigation:
            'ignore'
    };

    const locationMock = {
        replaceState:
            jasmine.createSpy(
                'replaceState'
            )
    };

    const activatedRouteMock = {
        snapshot: {
            paramMap: {
                get:
                    jasmine.createSpy(
                        'paramMapGet'
                    )
            },
            queryParamMap: {
                get:
                    jasmine.createSpy(
                        'queryParamMapGet'
                    )
            }
        }
    };

    const toastrMock = {
        success:
            jasmine.createSpy(
                'success'
            ),
        error:
            jasmine.createSpy(
                'error'
            ),
        info:
            jasmine.createSpy(
                'info'
            )
    };

    beforeEach(async () => {
        permissoes =
            new Set<
                ChavePermissao
            >();

        acaoRota = null;

        organizacaoProntaSubject =
            new BehaviorSubject<
                OrganizacaoDisponivel | null
            >({
                id: 1,
                nome:
                    'Organizacao 1'
            });

        contextoOrganizacaoServiceMock
            .retornarOrganizacaoProntaObservable
            .calls
            .reset();

        contextoOrganizacaoServiceMock
            .retornarOrganizacaoProntaObservable
            .and
            .returnValue(
                organizacaoProntaSubject
                    .asObservable()
            );

        autorizacaoServiceMock
            .possuiPermissao
            .calls
            .reset();

        autorizacaoServiceMock
            .possuiPermissao
            .and
            .callFake(
                (
                    permissao:
                        ChavePermissao
                ) =>
                    permissoes.has(
                        permissao
                    )
            );

        routerMock.navigate
            .calls
            .reset();

        routerMock.navigate
            .and
            .returnValue(
                Promise.resolve(true)
            );

        locationMock.replaceState
            .calls
            .reset();

        activatedRouteMock
            .snapshot
            .paramMap
            .get
            .calls
            .reset();

        activatedRouteMock
            .snapshot
            .paramMap
            .get
            .and
            .returnValue(null);

        activatedRouteMock
            .snapshot
            .queryParamMap
            .get
            .calls
            .reset();

        activatedRouteMock
            .snapshot
            .queryParamMap
            .get
            .and
            .callFake(
                (parametro: string) =>
                    parametro === 'acao'
                        ? acaoRota
                        : null
            );

        toastrMock.success
            .calls
            .reset();

        toastrMock.error
            .calls
            .reset();

        toastrMock.info
            .calls
            .reset();

        baseService =
            jasmine.createSpyObj<
                BaseService
            >(
                'BaseService',
                [
                    'listar',
                    'detalhar',
                    'salvar',
                    'inativar'
                ]
            );

        baseService.listar
            .and
            .returnValue(
                of({
                    content: [],
                    totalElements: 0
                }) as never
            );

        baseService.salvar
            .and
            .returnValue(
                of({}) as never
            );

        baseService.inativar
            .and
            .returnValue(
                of(undefined) as never
            );

        configuracaoInicialService =
            jasmine.createSpyObj<
                ConfiguracaoInicialService
            >(
                'ConfiguracaoInicialService',
                [
                    'recarregar'
                ]
            );

        configuracaoInicialService
            .recarregar
            .and
            .returnValue(
                configuracaoConcluida()
            );

        paisService =
            jasmine.createSpyObj<
                PaisService
            >(
                'PaisService',
                [
                    'listar',
                    'listarTiposDocumentoFiscal'
                ]
            );

        paisService.listar
            .and
            .returnValue(
                of([
                    {
                        codigo: 'BR',
                        nome: 'Brasil'
                    },
                    {
                        codigo: 'PY',
                        nome: 'Paraguai'
                    }
                ])
            );

        paisService.listarTiposDocumentoFiscal
            .and
            .returnValue(
                of([
                    {
                        codigo: 'CNPJ',
                        nome: 'CNPJ'
                    }
                ])
            );

        empresaService =
            jasmine.createSpyObj<
                EmpresaConfiguracaoService
            >(
                'EmpresaService',
                [
                    'listar'
                ]
            );

        empresaService.listar
            .and
            .returnValue(
                of({
                    content: [],
                    totalElements: 0
                })
            );

        await TestBed
            .configureTestingModule({
                declarations: [
                    EmpresaComponent
                ],
                providers: [
                    FormBuilder,
                    {
                        provide:
                            BaseService,
                        useValue:
                            baseService
                    },
                    {
                        provide:
                            AutorizacaoService,
                        useValue:
                            autorizacaoServiceMock
                    },
                    {
                        provide:
                            ContextoOrganizacaoService,
                        useValue:
                            contextoOrganizacaoServiceMock
                    },
                    {
                        provide:
                            ConfiguracaoInicialService,
                        useValue:
                            configuracaoInicialService
                    },
                    {
                        provide:
                            PaisService,
                        useValue:
                            paisService
                    },
                    {
                        provide:
                            EmpresaConfiguracaoService,
                        useValue:
                            empresaService
                    },
                    {
                        provide:
                            Router,
                        useValue:
                            routerMock
                    },
                    {
                        provide:
                            ActivatedRoute,
                        useValue:
                            activatedRouteMock
                    },
                    {
                        provide:
                            Location,
                        useValue:
                            locationMock
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
                EmpresaComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();
    });

    it(
        'deve ser criado',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaListar
            ]);

            expect(component)
                .toBeTruthy();
        }
    );

    it(
        'deve configurar endpoint e colunas',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaListar
            ]);

            expect(component.endPoint)
                .toBe(
                    'configuracao/empresa'
                );

            expect(component.pagina)
                .toBe('Empresas');

            expect(component.coluna)
                .toEqual([
                    'ID empresa controladora',
                    'Empresa controladora',
                    'Nome',
                    'Razao social',
                    'Pais',
                    'Tipo documento',
                    'Documento fiscal',
                    'Status'
                ]);
        }
    );

    it(
        'deve criar formulario de cadastro',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaCriar
            ]);

            const formulario =
                component.campos();

            expect(
                formulario.contains('id')
            ).toBeFalse();

            expect(
                formulario.getRawValue()
            ).toEqual({
                idEmpresaControladora:
                    null,
                nome:
                    '',
                razaoSocial:
                    '',
                pais:
                    '',
                tipoDocumentoFiscal:
                    '',
                documentoFiscal:
                    '',
                inscricaoEstadual:
                    '',
                inscricaoMunicipal:
                    ''
            });

            expect(
                formulario
                    .get('nome')
                    ?.hasError('required')
            ).toBeTrue();

            expect(
                formulario
                    .get('razaoSocial')
                    ?.hasError('required')
            ).toBeTrue();

            expect(
                formulario
                    .get('documentoFiscal')
                    ?.hasError('required')
            ).toBeTrue();
        }
    );

    it(
        'deve limitar os campos principais',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaCriar
            ]);

            const formulario =
                component.campos();

            formulario
                .get('nome')
                ?.setValue(
                    'A'.repeat(101)
                );

            formulario
                .get('razaoSocial')
                ?.setValue(
                    'A'.repeat(151)
                );

            formulario
                .get('documentoFiscal')
                ?.setValue(
                    'A'.repeat(31)
                );

            formulario
                .get('inscricaoEstadual')
                ?.setValue(
                    'A'.repeat(31)
                );

            formulario
                .get('inscricaoMunicipal')
                ?.setValue(
                    'A'.repeat(31)
                );

            expect(
                formulario
                    .get('nome')
                    ?.hasError('maxlength')
            ).toBeTrue();

            expect(
                formulario
                    .get('razaoSocial')
                    ?.hasError('maxlength')
            ).toBeTrue();

            expect(
                formulario
                    .get('documentoFiscal')
                    ?.hasError('maxlength')
            ).toBeTrue();

            expect(
                formulario
                    .get('inscricaoEstadual')
                    ?.hasError('maxlength')
            ).toBeTrue();

            expect(
                formulario
                    .get('inscricaoMunicipal')
                    ?.hasError('maxlength')
            ).toBeTrue();
        }
    );

    it(
        'deve criar formulario de edicao',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaListar
            ]);

            const formulario =
                component.campos({
                    id: 1,
                    idEmpresaControladora:
                        null,
                    empresaControladora:
                        null,
                    nome:
                        'Empresa Exemplo',
                    razaoSocial:
                        'Empresa Exemplo Ltda',
                    pais:
                        'BR',
                    tipoDocumentoFiscal:
                        'CNPJ',
                    documentoFiscal:
                        '10409614000185',
                    inscricaoEstadual:
                        null,
                    inscricaoMunicipal:
                        null,
                    status:
                        'ATIVO'
                });

            expect(
                formulario.getRawValue()
            ).toEqual({
                id: 1,
                idEmpresaControladora:
                    null,
                nome:
                    'Empresa Exemplo',
                razaoSocial:
                    'Empresa Exemplo Ltda',
                pais:
                    'BR',
                tipoDocumentoFiscal:
                    'CNPJ',
                documentoFiscal:
                    '10409614000185',
                inscricaoEstadual:
                    '',
                inscricaoMunicipal:
                    ''
            });
        }
    );

    it(
        'deve selecionar empresa controladora',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaCriar
            ]);

            component.formulario =
                component.campos();

            component.selecionarEmpresaControladora({
                id: 2,
                idEmpresaControladora:
                    null,
                empresaControladora:
                    null,
                nome:
                    'Empresa Controladora',
                razaoSocial:
                    'Empresa Controladora Ltda',
                pais:
                    'BR',
                tipoDocumentoFiscal:
                    'CNPJ',
                documentoFiscal:
                    '10409614000185',
                inscricaoEstadual:
                    null,
                inscricaoMunicipal:
                    null,
                status:
                    'ATIVO'
            });

            expect(
                component.formulario
                    .get('idEmpresaControladora')
                    ?.value
            ).toBe(2);
        }
    );

    it(
        'deve exibir nome da empresa controladora',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaCriar
            ]);

            expect(
                component.exibirEmpresaControladora({
                    id: 2,
                    idEmpresaControladora:
                        null,
                    empresaControladora:
                        null,
                    nome:
                        'Empresa Controladora',
                    razaoSocial:
                        'Empresa Controladora Ltda',
                    pais:
                        'BR',
                    tipoDocumentoFiscal:
                        'CNPJ',
                    documentoFiscal:
                        '10409614000185',
                    inscricaoEstadual:
                        null,
                    inscricaoMunicipal:
                        null,
                    status:
                        'ATIVO'
                })
            ).toBe('Empresa Controladora');

            expect(
                component.exibirEmpresaControladora(
                    'Empresa digitada'
                )
            ).toBe('Empresa digitada');

            expect(
                component.exibirEmpresaControladora(null)
            ).toBe('');
        }
    );

    it(
        'nao deve listar a propria empresa como controladora',
        () => {

            empresaService.listar
                .and
                .returnValue(
                    of({
                        content: [
                            {
                                id: 1,
                                idEmpresaControladora:
                                    null,
                                empresaControladora:
                                    null,
                                nome:
                                    'Empresa Atual',
                                razaoSocial:
                                    'Empresa Atual Ltda',
                                pais:
                                    'BR',
                                tipoDocumentoFiscal:
                                    'CNPJ',
                                documentoFiscal:
                                    '10409614000185',
                                inscricaoEstadual:
                                    null,
                                inscricaoMunicipal:
                                    null,
                                status:
                                    'ATIVO'
                            },
                            {
                                id: 2,
                                idEmpresaControladora:
                                    null,
                                empresaControladora:
                                    null,
                                nome:
                                    'Empresa Controladora',
                                razaoSocial:
                                    'Empresa Controladora Ltda',
                                pais:
                                    'BR',
                                tipoDocumentoFiscal:
                                    'CNPJ',
                                documentoFiscal:
                                    '10409614000266',
                                inscricaoEstadual:
                                    null,
                                inscricaoMunicipal:
                                    null,
                                status:
                                    'ATIVO'
                            }
                        ],
                        totalElements: 2
                    })
                );

            criarComponente([
                ChavePermissao
                    .EmpresaListar
            ]);

            component.campos({
                id: 1,
                idEmpresaControladora:
                    null,
                empresaControladora:
                    null,
                nome:
                    'Empresa Atual',
                razaoSocial:
                    'Empresa Atual Ltda',
                pais:
                    'BR',
                tipoDocumentoFiscal:
                    'CNPJ',
                documentoFiscal:
                    '10409614000185',
                inscricaoEstadual:
                    null,
                inscricaoMunicipal:
                    null,
                status:
                    'ATIVO'
            });

            expect(
                component.empresasControladoras
                    .map((empresa) => empresa.id)
            ).toEqual([
                2
            ]);
        }
    );

    it(
        'deve carregar lista ao inicializar com permissao de listar',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaListar
            ]);

            expect(
                baseService.listar
            ).toHaveBeenCalledOnceWith(
                'configuracao/empresa',
                undefined,
                undefined,
                undefined,
                undefined,
                NaN
            );

            expect(component.isLista)
                .toBeTrue();
        }
    );

    it(
        'deve abrir formulario sem carregar lista quando possuir somente criar',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaCriar
            ]);

            expect(
                baseService.listar
            ).not.toHaveBeenCalled();

            expect(component.isLista)
                .toBeFalse();

            expect(component.isFormulario)
                .toBeTrue();
        }
    );

    it(
        'deve abrir diretamente o primeiro cadastro',
        () => {

            criarComponente(
                [
                    ChavePermissao
                        .EmpresaCriar
                ],
                'nova'
            );

            expect(
                baseService.listar
            ).not.toHaveBeenCalled();

            expect(component.isLista)
                .toBeFalse();

            expect(component.isFormulario)
                .toBeTrue();
        }
    );

    it(
        'deve voltar para configuracao inicial sem permissao de criar',
        () => {

            criarComponente(
                [
                    ChavePermissao
                        .EmpresaListar
                ],
                'nova'
            );

            expect(
                baseService.listar
            ).not.toHaveBeenCalled();

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
        'deve concluir primeiro cadastro e carregar lista quando permitido',
        () => {

            criarComponente(
                [
                    ChavePermissao
                        .EmpresaCriar,
                    ChavePermissao
                        .EmpresaListar
                ],
                'nova'
            );

            preencherFormularioValido();

            component.salvar();

            expect(
                configuracaoInicialService
                    .recarregar
            ).toHaveBeenCalledTimes(1);

            expect(
                locationMock.replaceState
            ).toHaveBeenCalledOnceWith(
                '/configuracao/empresas'
            );

            expect(
                baseService.listar
            ).toHaveBeenCalledTimes(1);

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();
        }
    );

    it(
        'nao deve carregar lista apos primeiro cadastro sem permissao de listar',
        () => {

            criarComponente(
                [
                    ChavePermissao
                        .EmpresaCriar
                ],
                'nova'
            );

            preencherFormularioValido();

            component.salvar();

            expect(
                configuracaoInicialService
                    .recarregar
            ).toHaveBeenCalledTimes(1);

            expect(
                baseService.listar
            ).not.toHaveBeenCalled();

            expect(
                routerMock.navigate
            ).toHaveBeenCalledWith(
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
        'deve voltar para configuracao inicial quando ainda houver etapa pendente',
        () => {

            configuracaoInicialService
                .recarregar
                .and
                .returnValue(
                    configuracaoPendente()
                );

            criarComponente(
                [
                    ChavePermissao
                        .EmpresaCriar
                ],
                'nova'
            );

            preencherFormularioValido();

            component.salvar();

            expect(
                baseService.listar
            ).not.toHaveBeenCalled();

            expect(
                routerMock.navigate
            ).toHaveBeenCalledWith(
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
        'deve atualizar configuracao ao cadastrar diretamente pela listagem',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaCriar,
                ChavePermissao
                    .EmpresaListar
            ]);

            component.botaoAdicionar();

            preencherFormularioValido();

            baseService.listar
                .calls
                .reset();

            component.salvar();

            expect(
                baseService.salvar
            ).toHaveBeenCalledTimes(1);

            expect(
                configuracaoInicialService
                    .recarregar
            ).toHaveBeenCalledTimes(1);

            expect(
                locationMock.replaceState
            ).toHaveBeenCalledOnceWith(
                '/configuracao/empresas'
            );

            expect(
                baseService.listar
            ).toHaveBeenCalledTimes(1);

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();

            expect(
                routerMock.navigate
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'nao deve recarregar configuracao ao editar empresa existente',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaListar,
                ChavePermissao
                    .EmpresaEditar
            ]);

            component.formulario =
                component.campos({
                    id: 1,
                    idEmpresaControladora:
                        null,
                    empresaControladora:
                        null,
                    nome:
                        'Empresa atualizada',
                    razaoSocial:
                        'Empresa Atualizada Ltda',
                    pais:
                        'BR',
                    tipoDocumentoFiscal:
                        'CNPJ',
                    documentoFiscal:
                        '10409614000185',
                    inscricaoEstadual:
                        null,
                    inscricaoMunicipal:
                        null,
                    status:
                        'ATIVO'
                });

            component.isLista = false;
            component.isFormulario = true;

            baseService.listar
                .calls
                .reset();

            component.salvar();

            expect(
                baseService.salvar
            ).toHaveBeenCalledTimes(1);

            expect(
                configuracaoInicialService
                    .recarregar
            ).not.toHaveBeenCalled();

            expect(
                locationMock.replaceState
            ).not.toHaveBeenCalled();

            expect(
                baseService.listar
            ).toHaveBeenCalledTimes(1);

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();
        }
    );

    it(
        'deve cancelar novo cadastro para lista depois de concluir onboarding',
        () => {

            criarComponente(
                [
                    ChavePermissao
                        .EmpresaCriar,
                    ChavePermissao
                        .EmpresaListar
                ],
                'nova'
            );

            preencherFormularioValido();

            component.salvar();

            expect(
                locationMock.replaceState
            ).toHaveBeenCalledOnceWith(
                '/configuracao/empresas'
            );

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();

            routerMock.navigate
                .calls
                .reset();

            component.botaoAdicionar();

            expect(component.isLista)
                .toBeFalse();

            expect(component.isFormulario)
                .toBeTrue();

            component.cancelarEmpresa();

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();

            expect(
                routerMock.navigate
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve voltar ao fluxo inicial ao excluir a ultima empresa',
        () => {

            configuracaoInicialService
                .recarregar
                .and
                .returnValue(
                    configuracaoPendente()
                );

            criarComponente([
                ChavePermissao
                    .EmpresaListar,
                ChavePermissao
                    .EmpresaExcluir
            ]);

            baseService.listar
                .calls
                .reset();

            component.botaoExcluir(1);

            expect(
                baseService.inativar
            ).toHaveBeenCalledOnceWith(
                'configuracao/empresa',
                1
            );

            expect(
                configuracaoInicialService
                    .recarregar
            ).toHaveBeenCalledTimes(1);

            expect(
                baseService.listar
            ).not.toHaveBeenCalled();

            expect(
                routerMock.navigate
            ).toHaveBeenCalledWith(
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
        'deve recarregar lista ao excluir quando ainda houver empresa ativa',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaListar,
                ChavePermissao
                    .EmpresaExcluir
            ]);

            baseService.listar
                .calls
                .reset();

            component.botaoExcluir(1);

            expect(
                configuracaoInicialService
                    .recarregar
            ).toHaveBeenCalledTimes(1);

            expect(
                baseService.listar
            ).toHaveBeenCalledTimes(1);

            expect(
                routerMock.navigate
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve limpar dados enquanto a organizacao pronta estiver indisponivel',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaListar
            ]);

            baseService.listar
                .calls
                .reset();

            component.lista = [
                {
                    id: 1,
                    nome:
                        'Empresa Exemplo',
                    razaoSocial:
                        'Empresa Exemplo Ltda',
                    pais:
                        'BR',
                    tipoDocumentoFiscal:
                        'CNPJ',
                    documentoFiscal:
                        '10409614000185',
                    status:
                        'ATIVO'
                }
            ];

            component.totalRegistros = 1;
            component.isLista = false;
            component.isFormulario = true;
            component.isVisualizacao = true;

            organizacaoProntaSubject.next(
                null
            );

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();

            expect(component.isVisualizacao)
                .toBeFalse();

            expect(component.lista)
                .toEqual([]);

            expect(component.totalRegistros)
                .toBe(0);

            expect(
                baseService.listar
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve recarregar dados somente quando a nova organizacao estiver pronta',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaListar
            ]);

            baseService.listar
                .calls
                .reset();

            component.lista = [
                {
                    id: 1,
                    nome:
                        'Empresa Exemplo',
                    razaoSocial:
                        'Empresa Exemplo Ltda',
                    pais:
                        'BR',
                    tipoDocumentoFiscal:
                        'CNPJ',
                    documentoFiscal:
                        '10409614000185',
                    status:
                        'ATIVO'
                }
            ];

            component.totalRegistros = 1;

            organizacaoProntaSubject.next(
                null
            );

            expect(
                baseService.listar
            ).not.toHaveBeenCalled();

            permissoes.clear();

            permissoes.add(
                ChavePermissao
                    .EmpresaListar
            );

            organizacaoProntaSubject.next({
                id: 2,
                nome:
                    'Organizacao 2'
            });

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();

            expect(component.isVisualizacao)
                .toBeFalse();

            expect(component.lista)
                .toEqual([]);

            expect(component.totalRegistros)
                .toBe(0);

            expect(
                baseService.listar
            ).toHaveBeenCalledTimes(1);
        }
    );

    it(
        'deve usar novas permissoes ao publicar organizacao pronta',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaListar
            ]);

            baseService.listar
                .calls
                .reset();

            organizacaoProntaSubject.next(
                null
            );

            permissoes.clear();

            permissoes.add(
                ChavePermissao
                    .EmpresaCriar
            );

            organizacaoProntaSubject.next({
                id: 2,
                nome:
                    'Organizacao 2'
            });

            expect(
                baseService.listar
            ).not.toHaveBeenCalled();

            expect(component.isLista)
                .toBeFalse();

            expect(component.isFormulario)
                .toBeTrue();

            expect(
                routerMock.navigate
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve encerrar onboarding ao publicar nova organizacao pronta',
        () => {

            criarComponente(
                [
                    ChavePermissao
                        .EmpresaCriar,
                    ChavePermissao
                        .EmpresaListar
                ],
                'nova'
            );

            organizacaoProntaSubject.next(
                null
            );

            organizacaoProntaSubject.next({
                id: 2,
                nome:
                    'Organizacao 2'
            });

            routerMock.navigate
                .calls
                .reset();

            component.botaoAdicionar();
            component.cancelarEmpresa();

            expect(
                routerMock.navigate
            ).not.toHaveBeenCalled();

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();
        }
    );

    it(
        'deve navegar para inicio quando nova organizacao nao possuir acesso',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaListar
            ]);

            routerMock.navigate
                .calls
                .reset();

            organizacaoProntaSubject.next(
                null
            );

            permissoes.clear();

            organizacaoProntaSubject.next({
                id: 2,
                nome:
                    'Organizacao 2'
            });

            expect(
                baseService.listar
            ).toHaveBeenCalledTimes(1);

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
        'deve abrir detalhamento somente leitura',
        () => {

            baseService.detalhar
                .and
                .returnValue(
                    of({
                        id: 1,
                        idEmpresaControladora:
                            null,
                        empresaControladora:
                            null,
                        nome:
                            'Empresa Exemplo',
                        razaoSocial:
                            'Empresa Exemplo Ltda',
                        pais:
                            'BR',
                        tipoDocumentoFiscal:
                            'CNPJ',
                        documentoFiscal:
                            '10409614000185',
                        inscricaoEstadual:
                            null,
                        inscricaoMunicipal:
                            null,
                        status:
                            'ATIVO'
                    }) as never
                );

            criarComponente([
                ChavePermissao
                    .EmpresaListar,
                ChavePermissao
                    .EmpresaDetalhar
            ]);

            component.botaoVisualizar(1);

            expect(
                baseService.detalhar
            ).toHaveBeenCalledOnceWith(
                'configuracao/empresa',
                1
            );

            expect(component.isVisualizacao)
                .toBeTrue();

            expect(component.isLista)
                .toBeFalse();

            expect(component.isFormulario)
                .toBeTrue();

            expect(component.formulario.disabled)
                .toBeTrue();
        }
    );

    it(
        'deve exigir permissao correspondente para salvar',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaCriar
            ]);

            component.formulario =
                component.campos();

            expect(component.podeSalvar)
                .toBeTrue();

            component.formulario =
                component.campos({
                    id: 1,
                    idEmpresaControladora:
                        null,
                    empresaControladora:
                        null,
                    nome:
                        'Empresa Exemplo',
                    razaoSocial:
                        'Empresa Exemplo Ltda',
                    pais:
                        'BR',
                    tipoDocumentoFiscal:
                        'CNPJ',
                    documentoFiscal:
                        '10409614000185',
                    inscricaoEstadual:
                        null,
                    inscricaoMunicipal:
                        null,
                    status:
                        'ATIVO'
                });

            expect(component.podeSalvar)
                .toBeFalse();

            permissoes.add(
                ChavePermissao
                    .EmpresaEditar
            );

            expect(component.podeSalvar)
                .toBeTrue();
        }
    );

    it(
        'deve controlar acoes por permissao',
        () => {

            criarComponente([
                ChavePermissao
                    .EmpresaCriar,
                ChavePermissao
                    .EmpresaExcluir,
                ChavePermissao
                    .EmpresaDetalhar
            ]);

            expect(component.podeCriar)
                .toBeTrue();

            expect(component.podeListar)
                .toBeFalse();

            expect(component.podeEditar)
                .toBeFalse();

            expect(component.podeExcluir)
                .toBeTrue();

            expect(component.podeDetalhar)
                .toBeTrue();
        }
    );

    function criarComponente(
        permissoesIniciais:
            readonly ChavePermissao[],
        acao:
            string | null = null
    ): void {

        permissoes.clear();

        permissoesIniciais
            .forEach(
                (permissao) =>
                    permissoes.add(
                        permissao
                    )
            );

        acaoRota = acao;

        fixture =
            TestBed.createComponent(
                EmpresaComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    }

    function preencherFormularioValido():
        void {

        component.formulario
            .patchValue({
                nome:
                    'Primeira empresa',
                razaoSocial:
                    'Primeira Empresa Ltda',
                pais:
                    'BR',
                tipoDocumentoFiscal:
                    'CNPJ',
                documentoFiscal:
                    '10409614000185',
                inscricaoEstadual:
                    '',
                inscricaoMunicipal:
                    ''
            });
    }

    function configuracaoConcluida():
        Observable<
            EstadoConfiguracaoInicial
        > {

        return of({
            empresaCadastrada:
                true,
            proximaEtapa:
                null
        });
    }

    function configuracaoPendente():
        Observable<
            EstadoConfiguracaoInicial
        > {

        return of({
            empresaCadastrada:
                false,
            proximaEtapa:
                ProximaEtapaConfiguracao
                    .Empresa
        });
    }
});
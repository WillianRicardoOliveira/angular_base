import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import {
    FormBuilder
} from '@angular/forms';

import {
    MatDialog
} from '@angular/material/dialog';

import {
    ToastrService
} from 'ngx-toastr';

import {
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
    OrganizacaoPlataforma
} from '@/interfaces/interfaces';

import {
    OrganizacaoPlataformaService
} from './services/organizacao-plataforma.service';

import {
    OrganizacaoPlataformaComponent
} from './organizacao-plataforma.component';

describe('OrganizacaoPlataformaComponent', () => {
    let component:
        OrganizacaoPlataformaComponent;

    let fixture:
        ComponentFixture<OrganizacaoPlataformaComponent>;

    let serviceMock:
        jasmine.SpyObj<OrganizacaoPlataformaService>;

    const autorizacaoServiceMock = {
        possuiPermissao:
            jasmine.createSpy(
                'possuiPermissao'
            )
    };

    const dialogMock = {
        open:
            jasmine.createSpy('open')
    };

    const toastrMock = {
        success:
            jasmine.createSpy('success'),
        error:
            jasmine.createSpy('error'),
        info:
            jasmine.createSpy('info')
    };

    const organizacao:
        OrganizacaoPlataforma = {
            id: 3,
            nome: 'Organizacao Exemplo',
            status: 'ATIVO'
        };

    beforeEach(async () => {
        serviceMock =
            jasmine.createSpyObj<
                OrganizacaoPlataformaService
            >(
                'OrganizacaoPlataformaService',
                [
                    'listar',
                    'detalhar',
                    'editar',
                    'inativar',
                    'reativar',
                    'remover'
                ]
            );

        serviceMock.listar.and.returnValue(
            of({
                content: [],
                totalElements: 0
            })
        );

        serviceMock.detalhar.and.returnValue(
            of(organizacao)
        );

        serviceMock.editar.and.returnValue(
            of(organizacao)
        );

        serviceMock.inativar.and.returnValue(
            of({
                ...organizacao,
                status: 'INATIVO'
            })
        );

        serviceMock.reativar.and.returnValue(
            of(organizacao)
        );

        serviceMock.remover.and.returnValue(
            of(void 0)
        );

        autorizacaoServiceMock
            .possuiPermissao
            .calls
            .reset();

        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(false);

        dialogMock.open.calls.reset();

        dialogMock.open.and.returnValue({
            afterClosed: () => of(true)
        });

        toastrMock.success.calls.reset();
        toastrMock.error.calls.reset();
        toastrMock.info.calls.reset();

        await TestBed
            .configureTestingModule({
                declarations: [
                    OrganizacaoPlataformaComponent
                ],
                providers: [
                    FormBuilder,
                    {
                        provide:
                            OrganizacaoPlataformaService,
                        useValue:
                            serviceMock
                    },
                    {
                        provide:
                            AutorizacaoService,
                        useValue:
                            autorizacaoServiceMock
                    },
                    {
                        provide:
                            MatDialog,
                        useValue:
                            dialogMock
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
                OrganizacaoPlataformaComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                OrganizacaoPlataformaComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it(
        'deve carregar organizacoes ao inicializar',
        () => {
            expect(serviceMock.listar)
                .toHaveBeenCalledOnceWith(
                    0,
                    10,
                    'id,desc',
                    undefined
                );
        }
    );

    it(
        'deve pesquisar a partir da primeira pagina',
        () => {
            serviceMock.listar.calls.reset();

            component.filtro =
                ' Organizacao ';

            component.pesquisar();

            expect(serviceMock.listar)
                .toHaveBeenCalledOnceWith(
                    0,
                    10,
                    'id,desc',
                    'Organizacao'
                );
        }
    );

    it(
        'deve alterar a paginacao',
        () => {
            serviceMock.listar.calls.reset();

            component.quantidadePorPagina({
                pageIndex: 2,
                pageSize: 20,
                length: 50
            } as never);

            expect(serviceMock.listar)
                .toHaveBeenCalledOnceWith(
                    2,
                    20,
                    'id,desc',
                    undefined
                );
        }
    );

    it(
        'deve controlar permissoes da plataforma',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        [
                            ChavePermissao
                                .PlataformaOrganizacaoEditar,
                            ChavePermissao
                                .PlataformaOrganizacaoStatus,
                            ChavePermissao
                                .PlataformaOrganizacaoExcluir
                        ].includes(permissao)
                );

            expect(component.podeEditar)
                .toBeTrue();

            expect(component.podeDetalhar)
                .toBeFalse();

            expect(component.podeAlterarStatus)
                .toBeTrue();

            expect(component.podeExcluir)
                .toBeTrue();
        }
    );

    it(
        'deve abrir visualizacao somente leitura',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .PlataformaOrganizacaoDetalhar
                );

            component.botaoVisualizar(3);

            expect(serviceMock.detalhar)
                .toHaveBeenCalledOnceWith(3);

            expect(component.isLista)
                .toBeFalse();

            expect(component.isFormulario)
                .toBeTrue();

            expect(component.isVisualizacao)
                .toBeTrue();

            expect(component.formulario.disabled)
                .toBeTrue();
        }
    );

    it(
        'deve abrir edicao',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .PlataformaOrganizacaoEditar
                );

            component.botaoEditar(3);

            expect(serviceMock.detalhar)
                .toHaveBeenCalledOnceWith(3);

            expect(component.isLista)
                .toBeFalse();

            expect(component.isFormulario)
                .toBeTrue();

            expect(component.isVisualizacao)
                .toBeFalse();

            expect(
                component.formulario
                    .getRawValue()
            ).toEqual({
                id: 3,
                nome: 'Organizacao Exemplo',
                status: 'ATIVO'
            });
        }
    );

    it(
        'nao deve abrir edicao sem permissao',
        () => {
            component.botaoEditar(3);

            expect(serviceMock.detalhar)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'deve salvar edicao',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .PlataformaOrganizacaoEditar
                );

            serviceMock.listar.calls.reset();

            component.botaoEditar(3);

            component.formulario
                .get('nome')
                ?.setValue(
                    ' Organizacao Atualizada '
                );

            component.salvar();

            expect(serviceMock.editar)
                .toHaveBeenCalledOnceWith(
                    3,
                    {
                        nome:
                            'Organizacao Atualizada'
                    }
                );

            expect(serviceMock.listar)
                .toHaveBeenCalled();

            expect(toastrMock.success)
                .toHaveBeenCalled();
        }
    );

    it(
        'nao deve salvar formulario invalido',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .PlataformaOrganizacaoEditar
                );

            component.botaoEditar(3);

            component.formulario
                .get('nome')
                ?.setValue('');

            component.salvar();

            expect(serviceMock.editar)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'deve inativar organizacao ativa',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .PlataformaOrganizacaoStatus
                );

            serviceMock.listar.calls.reset();

            component.botaoInativar(
                organizacao
            );

            expect(dialogMock.open)
                .toHaveBeenCalled();

            expect(serviceMock.inativar)
                .toHaveBeenCalledOnceWith(3);

            expect(serviceMock.listar)
                .toHaveBeenCalled();

            expect(toastrMock.info)
                .toHaveBeenCalled();
        }
    );

    it(
        'deve reativar organizacao inativa',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .PlataformaOrganizacaoStatus
                );

            serviceMock.listar.calls.reset();

            component.botaoReativar({
                ...organizacao,
                status: 'INATIVO'
            });

            expect(serviceMock.reativar)
                .toHaveBeenCalledOnceWith(3);

            expect(serviceMock.listar)
                .toHaveBeenCalled();

            expect(toastrMock.success)
                .toHaveBeenCalled();
        }
    );

    it(
        'deve remover organizacao nao removida',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .PlataformaOrganizacaoExcluir
                );

            serviceMock.listar.calls.reset();

            component.botaoExcluir(
                organizacao
            );

            expect(serviceMock.remover)
                .toHaveBeenCalledOnceWith(3);

            expect(serviceMock.listar)
                .toHaveBeenCalled();

            expect(toastrMock.info)
                .toHaveBeenCalled();
        }
    );

    it(
        'nao deve executar acao quando confirmacao for cancelada',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.callFake(
                    (
                        permissao:
                            ChavePermissao
                    ) =>
                        permissao ===
                        ChavePermissao
                            .PlataformaOrganizacaoExcluir
                );

            dialogMock.open.and.returnValue({
                afterClosed: () => of(false)
            });

            component.botaoExcluir(
                organizacao
            );

            expect(serviceMock.remover)
                .not.toHaveBeenCalled();
        }
    );

    it(
        'nao deve alterar status de organizacao removida',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            const removida:
                OrganizacaoPlataforma = {
                    ...organizacao,
                    status: 'REMOVIDO'
                };

            expect(
                component.podeInativar(removida)
            ).toBeFalse();

            expect(
                component.podeReativar(removida)
            ).toBeFalse();

            expect(
                component.podeRemover(removida)
            ).toBeFalse();
        }
    );

    it(
        'deve cancelar e voltar para lista',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            component.botaoEditar(3);
            component.cancelar();

            expect(component.isLista)
                .toBeTrue();

            expect(component.isFormulario)
                .toBeFalse();

            expect(component.isVisualizacao)
                .toBeFalse();
        }
    );

    it(
        'deve informar erro ao carregar lista',
        () => {
            serviceMock.listar.and.returnValue(
                throwError(
                    () => new Error()
                )
            );

            component.carregarLista();

            expect(toastrMock.error)
                .toHaveBeenCalled();
        }
    );

    it(
        'deve informar erro ao salvar',
        () => {
            autorizacaoServiceMock
                .possuiPermissao
                .and.returnValue(true);

            serviceMock.editar.and.returnValue(
                throwError(
                    () => new Error()
                )
            );

            component.botaoEditar(3);
            component.salvar();

            expect(toastrMock.error)
                .toHaveBeenCalled();
        }
    );
});
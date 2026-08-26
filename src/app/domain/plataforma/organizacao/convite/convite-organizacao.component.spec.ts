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
    ConviteOrganizacao
} from '@/interfaces/interfaces';

import {
    ConviteOrganizacaoService
} from './services/convite-organizacao.service';

import {
    ConviteOrganizacaoComponent
} from './convite-organizacao.component';

describe('ConviteOrganizacaoComponent', () => {
    let component: ConviteOrganizacaoComponent;
    let fixture: ComponentFixture<ConviteOrganizacaoComponent>;

    let serviceMock:
        jasmine.SpyObj<ConviteOrganizacaoService>;

    const autorizacaoServiceMock = {
        possuiPermissao:
            jasmine.createSpy('possuiPermissao')
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

    const convite: ConviteOrganizacao = {
        id: 4,
        nomeOrganizacao: 'Organizacao Exemplo',
        emailAdministrador: 'admin@empresa.com',
        criadoEm: '2026-08-26T10:00:00',
        expiraEm: '2026-08-28T10:00:00',
        aceitoEm: null,
        status: 'PENDENTE',
        expirado: false
    };

    beforeEach(async () => {
        serviceMock =
            jasmine.createSpyObj<
                ConviteOrganizacaoService
            >(
                'ConviteOrganizacaoService',
                [
                    'convidar',
                    'listar',
                    'detalhar',
                    'revogar',
                    'reenviar'
                ]
            );

        serviceMock.listar.and.returnValue(
            of({
                content: [],
                totalElements: 0
            })
        );

        serviceMock.convidar.and.returnValue(
            of(convite)
        );

        serviceMock.detalhar.and.returnValue(
            of(convite)
        );

        serviceMock.revogar.and.returnValue(
            of(void 0)
        );

        serviceMock.reenviar.and.returnValue(
            of(convite)
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
                    ConviteOrganizacaoComponent
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
                            AutorizacaoService,
                        useValue:
                            autorizacaoServiceMock
                    },
                    {
                        provide: MatDialog,
                        useValue: dialogMock
                    },
                    {
                        provide: ToastrService,
                        useValue: toastrMock
                    }
                ]
            })
            .overrideComponent(
                ConviteOrganizacaoComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                ConviteOrganizacaoComponent
            );

        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it('deve carregar convites ao inicializar', () => {
        expect(serviceMock.listar)
            .toHaveBeenCalledOnceWith(
                0,
                10,
                'id,desc',
                undefined,
                undefined
            );
    });

    it('deve pesquisar com filtro e status', () => {
        serviceMock.listar.calls.reset();

        component.filtro = ' admin ';
        component.statusFiltro = 'PENDENTE';

        component.pesquisar();

        expect(serviceMock.listar)
            .toHaveBeenCalledOnceWith(
                0,
                10,
                'id,desc',
                'admin',
                'PENDENTE'
            );
    });

    it('deve alterar paginacao', () => {
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
                undefined,
                undefined
            );
    });

    it('deve abrir cadastro com permissao', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.callFake(
                (permissao: ChavePermissao) =>
                    permissao ===
                    ChavePermissao
                        .PlataformaOrganizacaoCriar
            );

        component.botaoAdicionar();

        expect(component.isLista).toBeFalse();
        expect(component.isFormulario).toBeTrue();
        expect(component.isVisualizacao).toBeFalse();

        expect(
            component.formulario.getRawValue()
        ).toEqual({
            nomeOrganizacao: '',
            emailAdministrador: ''
        });
    });

    it('nao deve abrir cadastro sem permissao', () => {
        component.botaoAdicionar();

        expect(component.isLista).toBeTrue();
        expect(component.isFormulario).toBeFalse();
    });

    it('deve criar convite', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(true);

        serviceMock.listar.calls.reset();

        component.botaoAdicionar();

        component.formulario.patchValue({
            nomeOrganizacao:
                ' Organizacao Exemplo ',
            emailAdministrador:
                ' admin@empresa.com '
        });

        component.salvar();

        expect(serviceMock.convidar)
            .toHaveBeenCalledOnceWith({
                nomeOrganizacao:
                    'Organizacao Exemplo',
                emailAdministrador:
                    'admin@empresa.com'
            });

        expect(serviceMock.listar)
            .toHaveBeenCalled();

        expect(toastrMock.success)
            .toHaveBeenCalled();
    });

    it('nao deve salvar formulario invalido', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(true);

        component.botaoAdicionar();
        component.salvar();

        expect(serviceMock.convidar)
            .not.toHaveBeenCalled();
    });

    it('deve abrir detalhe somente leitura', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.callFake(
                (permissao: ChavePermissao) =>
                    permissao ===
                    ChavePermissao
                        .PlataformaOrganizacaoDetalhar
            );

        component.botaoVisualizar(4);

        expect(serviceMock.detalhar)
            .toHaveBeenCalledOnceWith(4);

        expect(component.isLista).toBeFalse();
        expect(component.isFormulario).toBeTrue();
        expect(component.isVisualizacao).toBeTrue();
        expect(component.formulario.disabled).toBeTrue();
    });

    it('deve revogar convite pendente', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.callFake(
                (permissao: ChavePermissao) =>
                    permissao ===
                    ChavePermissao
                        .PlataformaOrganizacaoCriar
            );

        serviceMock.listar.calls.reset();

        component.botaoRevogar(convite);

        expect(dialogMock.open).toHaveBeenCalled();

        expect(serviceMock.revogar)
            .toHaveBeenCalledOnceWith(4);

        expect(serviceMock.listar)
            .toHaveBeenCalled();

        expect(toastrMock.info)
            .toHaveBeenCalled();
    });

    it('deve reenviar convite pendente', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.callFake(
                (permissao: ChavePermissao) =>
                    permissao ===
                    ChavePermissao
                        .PlataformaOrganizacaoCriar
            );

        serviceMock.listar.calls.reset();

        component.botaoReenviar(convite);

        expect(serviceMock.reenviar)
            .toHaveBeenCalledOnceWith(4);

        expect(serviceMock.listar)
            .toHaveBeenCalled();

        expect(toastrMock.success)
            .toHaveBeenCalled();
    });

    it('nao deve executar acao quando confirmacao for cancelada', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(true);

        dialogMock.open.and.returnValue({
            afterClosed: () => of(false)
        });

        component.botaoRevogar(convite);

        expect(serviceMock.revogar)
            .not.toHaveBeenCalled();
    });

    it('nao deve revogar convite aceito', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(true);

        component.botaoRevogar({
            ...convite,
            status: 'ACEITO'
        });

        expect(serviceMock.revogar)
            .not.toHaveBeenCalled();
    });

    it('deve cancelar e voltar para lista', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(true);

        component.botaoAdicionar();
        component.cancelar();

        expect(component.isLista).toBeTrue();
        expect(component.isFormulario).toBeFalse();
        expect(component.isVisualizacao).toBeFalse();
    });

    it('deve informar erro ao carregar lista', () => {
        serviceMock.listar.and.returnValue(
            throwError(() => new Error())
        );

        component.carregarLista();

        expect(toastrMock.error)
            .toHaveBeenCalled();
    });

    it('deve informar erro ao criar convite', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(true);

        serviceMock.convidar.and.returnValue(
            throwError(() => new Error())
        );

        component.botaoAdicionar();

        component.formulario.patchValue({
            nomeOrganizacao:
                'Organizacao Exemplo',
            emailAdministrador:
                'admin@empresa.com'
        });

        component.salvar();

        expect(toastrMock.error)
            .toHaveBeenCalled();
    });
});
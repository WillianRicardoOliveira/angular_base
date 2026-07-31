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
    of
} from 'rxjs';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';
import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';
import {
    BaseService
} from '@services/base/base.service';

import {
    UsuarioComponent
} from './usuario.component';

describe('UsuarioComponent', () => {
    let component: UsuarioComponent;

    let fixture:
        ComponentFixture<UsuarioComponent>;

    let baseServiceMock:
        jasmine.SpyObj<BaseService>;

    const autorizacaoServiceMock = {
        possuiPermissao: jasmine.createSpy(
            'possuiPermissao'
        )
    };

    const routerMock = {
        navigate: jasmine.createSpy(
            'navigate'
        ),
        routeReuseStrategy: {
            shouldReuseRoute:
                jasmine.createSpy(
                    'shouldReuseRoute'
                )
        },
        onSameUrlNavigation: 'ignore'
    };

    const activatedRouteMock = {
        snapshot: {
            paramMap: {
                get: jasmine
                    .createSpy('get')
                    .and.returnValue(null)
            }
        }
    };

    const toastrMock = {
        success: jasmine.createSpy(
            'success'
        ),
        error: jasmine.createSpy(
            'error'
        ),
        info: jasmine.createSpy(
            'info'
        )
    };

    beforeEach(async () => {
        autorizacaoServiceMock
            .possuiPermissao
            .calls
            .reset();

        autorizacaoServiceMock
            .possuiPermissao
            .and.returnValue(false);

        baseServiceMock =
            jasmine.createSpyObj<BaseService>(
                'BaseService',
                [
                    'listar',
                    'detalhar',
                    'salvar',
                    'inativar'
                ]
            );

        baseServiceMock
            .listar
            .and.returnValue(
                of({
                    content: [],
                    totalElements: 0
                }) as never
            );

        await TestBed
            .configureTestingModule({
                declarations: [
                    UsuarioComponent
                ],
                providers: [
                    FormBuilder,
                    {
                        provide: BaseService,
                        useValue:
                            baseServiceMock
                    },
                    {
                        provide:
                            AutorizacaoService,
                        useValue:
                            autorizacaoServiceMock
                    },
                    {
                        provide: Router,
                        useValue: routerMock
                    },
                    {
                        provide: ActivatedRoute,
                        useValue:
                            activatedRouteMock
                    },
                    {
                        provide: ToastrService,
                        useValue: toastrMock
                    }
                ]
            })
            .overrideComponent(
                UsuarioComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                UsuarioComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it('deve configurar o endpoint e as colunas de usuário', () => {
        expect(
            component.endPoint
        ).toBe('usuario');

        expect(
            component.pagina
        ).toBe('Usuários');

        expect(
            component.coluna
        ).toEqual([
            'E-mail',
            'Status'
        ]);
    });

    it('deve criar formulário de cadastro com e-mail e senha', () => {
        const formulario =
            component.campos();

        expect(
            formulario.contains('id')
        ).toBeFalse();

        expect(
            formulario.contains('email')
        ).toBeTrue();

        expect(
            formulario.contains('senha')
        ).toBeTrue();

        expect(
            formulario.get('email')
                ?.hasError('required')
        ).toBeTrue();

        expect(
            formulario.get('senha')
                ?.hasError('required')
        ).toBeTrue();
    });

    it('deve criar formulário de edição sem senha', () => {
        const formulario =
            component.campos({
                id: 10,
                email:
                    'usuario@teste.com',
                status: 'ATIVO'
            });

        expect(
            formulario.value
        ).toEqual({
            id: 10,
            email:
                'usuario@teste.com'
        });

        expect(
            formulario.contains('senha')
        ).toBeFalse();
    });

    it('deve carregar a lista ao inicializar', () => {
        expect(
            baseServiceMock.listar
        ).toHaveBeenCalledWith(
            'usuario',
            undefined,
            undefined,
            undefined,
            undefined,
            NaN
        );
    });

    it('deve abrir o detalhamento em modo somente leitura', () => {
        baseServiceMock
            .detalhar
            .and.returnValue(
                of({
                    id: 10,
                    email:
                        'usuario@teste.com',
                    status: 'ATIVO'
                }) as never
            );

        component.botaoVisualizar(10);

        expect(
            baseServiceMock.detalhar
        ).toHaveBeenCalledOnceWith(
            'usuario',
            10
        );

        expect(
            component.isVisualizacao
        ).toBeTrue();

        expect(
            component.isLista
        ).toBeFalse();

        expect(
            component.isFormulario
        ).toBeTrue();

        expect(
            component.formulario.disabled
        ).toBeTrue();

        expect(
            component.formulario
                .getRawValue()
        ).toEqual({
            id: 10,
            email:
                'usuario@teste.com'
        });

        expect(
            component.formulario
                .contains('senha')
        ).toBeFalse();
    });

    it('deve exigir a permissão correspondente para salvar', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.callFake(
                (permissao: ChavePermissao) =>
                    permissao ===
                    ChavePermissao.UsuarioCriar
            );

        component.formulario =
            component.campos();

        expect(
            component.podeSalvar
        ).toBeTrue();

        component.formulario =
            component.campos({
                id: 10,
                email:
                    'usuario@teste.com',
                status: 'ATIVO'
            });

        expect(
            component.podeSalvar
        ).toBeFalse();

        autorizacaoServiceMock
            .possuiPermissao
            .and.callFake(
                (permissao: ChavePermissao) =>
                    permissao ===
                    ChavePermissao.UsuarioEditar
            );

        expect(
            component.podeSalvar
        ).toBeTrue();
    });

    it('deve controlar as ações conforme as permissões do usuário', () => {
        autorizacaoServiceMock
            .possuiPermissao
            .and.callFake(
                (
                    permissao:
                        ChavePermissao
                ) =>
                    [
                        ChavePermissao
                            .UsuarioCriar,
                        ChavePermissao
                            .UsuarioExcluir,
                        ChavePermissao
                            .UsuarioDetalhar
                    ].includes(
                        permissao
                    )
            );

        expect(
            component.podeCriar
        ).toBeTrue();

        expect(
            component.podeEditar
        ).toBeFalse();

        expect(
            component.podeExcluir
        ).toBeTrue();

        expect(
            component.podeDetalhar
        ).toBeTrue();

        expect(
            autorizacaoServiceMock
                .possuiPermissao
        ).toHaveBeenCalledWith(
            ChavePermissao.UsuarioCriar
        );

        expect(
            autorizacaoServiceMock
                .possuiPermissao
        ).toHaveBeenCalledWith(
            ChavePermissao.UsuarioEditar
        );

        expect(
            autorizacaoServiceMock
                .possuiPermissao
        ).toHaveBeenCalledWith(
            ChavePermissao.UsuarioExcluir
        );

        expect(
            autorizacaoServiceMock
                .possuiPermissao
        ).toHaveBeenCalledWith(
            ChavePermissao.UsuarioDetalhar
        );
    });
});
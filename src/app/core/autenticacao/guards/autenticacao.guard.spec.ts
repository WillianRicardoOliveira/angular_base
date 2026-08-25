import {
    TestBed
} from '@angular/core/testing';
import {
    Router
} from '@angular/router';
import {
    firstValueFrom,
    Observable,
    of,
    throwError
} from 'rxjs';

import {
    AutenticacaoGuard
} from './autenticacao.guard';
import {
    UsuarioAutenticadoService
} from '@/core/autenticacao/services/usuario-autenticado.service';
import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';
import {
    PermissoesUsuarioService
} from '@/core/autorizacao/services/permissoes-usuario.service';
import {
    ContextoOrganizacaoService
} from '@/core/organizacao/services/contexto-organizacao.service';

describe('AutenticacaoGuard', () => {
    const routerMock = {
        navigate: jasmine.createSpy('navigate')
    };

    const usuarioAutenticadoServiceMock = {
        estaLogado: jasmine.createSpy(
            'estaLogado'
        )
    };

    const autorizacaoServiceMock = {
        permissoesCarregadas: jasmine.createSpy(
            'permissoesCarregadas'
        )
    };

    const permissoesUsuarioServiceMock = {
        carregarPermissoes: jasmine
            .createSpy('carregarPermissoes')
            .and.returnValue(
                of(undefined)
            )
    };

    const contextoOrganizacaoServiceMock = {
        carregarESelecionarPadrao: jasmine
            .createSpy('carregarESelecionarPadrao')
            .and.returnValue(
                of({
                    id: 1,
                    nome: 'Matriz'
                })
            )
    };

    beforeEach(() => {
        routerMock.navigate.calls.reset();

        usuarioAutenticadoServiceMock
            .estaLogado
            .calls
            .reset();

        autorizacaoServiceMock
            .permissoesCarregadas
            .calls
            .reset();

        permissoesUsuarioServiceMock
            .carregarPermissoes
            .calls
            .reset();

        permissoesUsuarioServiceMock
            .carregarPermissoes
            .and.returnValue(
                of(undefined)
            );

        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .calls
            .reset();

        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .and.returnValue(
                of({
                    id: 1,
                    nome: 'Matriz'
                })
            );

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Router,
                    useValue: routerMock
                },
                {
                    provide:
                        UsuarioAutenticadoService,
                    useValue:
                        usuarioAutenticadoServiceMock
                },
                {
                    provide: AutorizacaoService,
                    useValue: autorizacaoServiceMock
                },
                {
                    provide:
                        PermissoesUsuarioService,
                    useValue:
                        permissoesUsuarioServiceMock
                },
                {
                    provide:
                        ContextoOrganizacaoService,
                    useValue:
                        contextoOrganizacaoServiceMock
                }
            ]
        });
    });

    it('deve permitir acesso quando usuario estiver logado e as permissoes estiverem carregadas', () => {
        usuarioAutenticadoServiceMock
            .estaLogado
            .and.returnValue(true);

        autorizacaoServiceMock
            .permissoesCarregadas
            .and.returnValue(true);

        const resultado =
            executarGuard();

        expect(resultado).toBeTrue();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).not.toHaveBeenCalled();

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });

    it('deve carregar contexto antes das permissoes antes de permitir acesso', async () => {
        const ordemExecucao: string[] = [];

        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .and.callFake(() => {
                ordemExecucao.push('contexto');

                return of({
                    id: 1,
                    nome: 'Matriz'
                });
            });

        permissoesUsuarioServiceMock
            .carregarPermissoes
            .and.callFake(() => {
                ordemExecucao.push('permissoes');

                return of(undefined);
            });

        usuarioAutenticadoServiceMock
            .estaLogado
            .and.returnValue(true);

        autorizacaoServiceMock
            .permissoesCarregadas
            .and.returnValue(false);

        const resultado =
            executarGuard();

        const permitido =
            await firstValueFrom(
                resultado as Observable<boolean>
            );

        expect(permitido).toBeTrue();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(ordemExecucao).toEqual([
            'contexto',
            'permissoes'
        ]);

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });

    it('deve carregar permissoes mesmo quando nao houver organizacao disponivel', async () => {
        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .and.returnValue(
                of(null)
            );

        usuarioAutenticadoServiceMock
            .estaLogado
            .and.returnValue(true);

        autorizacaoServiceMock
            .permissoesCarregadas
            .and.returnValue(false);

        const resultado =
            executarGuard();

        const permitido =
            await firstValueFrom(
                resultado as Observable<boolean>
            );

        expect(permitido).toBeTrue();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });

    it('nao deve permitir acesso quando o carregamento do contexto falhar', async () => {
        const erro =
            new Error(
                'Falha ao carregar contexto'
            );

        contextoOrganizacaoServiceMock
            .carregarESelecionarPadrao
            .and.returnValue(
                throwError(() => erro)
            );

        usuarioAutenticadoServiceMock
            .estaLogado
            .and.returnValue(true);

        autorizacaoServiceMock
            .permissoesCarregadas
            .and.returnValue(false);

        const resultado =
            executarGuard();

        const permitido =
            await firstValueFrom(
                resultado as Observable<boolean>
            );

        expect(permitido).toBeFalse();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });

    it('nao deve permitir acesso quando o carregamento das permissoes falhar', async () => {
        const erro =
            new Error(
                'Falha ao carregar permissoes'
            );

        usuarioAutenticadoServiceMock
            .estaLogado
            .and.returnValue(true);

        autorizacaoServiceMock
            .permissoesCarregadas
            .and.returnValue(false);

        permissoesUsuarioServiceMock
            .carregarPermissoes
            .and.returnValue(
                throwError(() => erro)
            );

        const resultado =
            executarGuard();

        const permitido =
            await firstValueFrom(
                resultado as Observable<boolean>
            );

        expect(permitido).toBeFalse();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).toHaveBeenCalledTimes(1);

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });

    it('deve redirecionar para login quando usuario nao estiver logado', () => {
        usuarioAutenticadoServiceMock
            .estaLogado
            .and.returnValue(false);

        const resultado =
            executarGuard();

        expect(resultado).toBeFalse();

        expect(
            routerMock.navigate
        ).toHaveBeenCalledOnceWith(
            ['/login']
        );

        expect(
            autorizacaoServiceMock
                .permissoesCarregadas
        ).not.toHaveBeenCalled();

        expect(
            contextoOrganizacaoServiceMock
                .carregarESelecionarPadrao
        ).not.toHaveBeenCalled();

        expect(
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();
    });

    function executarGuard() {
        return TestBed.runInInjectionContext(
            () => AutenticacaoGuard()
        );
    }
});
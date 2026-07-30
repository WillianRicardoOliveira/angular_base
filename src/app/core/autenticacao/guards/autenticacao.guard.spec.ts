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
                }
            ]
        });
    });

    it('deve permitir acesso quando usuário estiver logado e as permissões estiverem carregadas', () => {
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
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).not.toHaveBeenCalled();

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });

    it('deve carregar permissões antes de permitir acesso', async () => {
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
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });

    it('não deve permitir acesso quando o carregamento das permissões falhar', async () => {
        const erro =
            new Error(
                'Falha ao carregar permissões'
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
            permissoesUsuarioServiceMock
                .carregarPermissoes
        ).toHaveBeenCalledTimes(1);

        expect(
            routerMock.navigate
        ).not.toHaveBeenCalled();
    });

    it('deve redirecionar para login quando usuário não estiver logado', () => {
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
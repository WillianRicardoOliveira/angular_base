import {
    inject
} from '@angular/core';
import {
    Router
} from '@angular/router';
import {
    catchError,
    map,
    of,
    switchMap
} from 'rxjs';

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

export const AutenticacaoGuard = () => {
    const usuarioAutenticadoService =
        inject(
            UsuarioAutenticadoService
        );

    const autorizacaoService =
        inject(
            AutorizacaoService
        );

    const permissoesUsuarioService =
        inject(
            PermissoesUsuarioService
        );

    const contextoOrganizacaoService =
        inject(
            ContextoOrganizacaoService
        );

    const router =
        inject(Router);

    if (
        !usuarioAutenticadoService
            .estaLogado()
    ) {
        router.navigate(['/login']);
        return false;
    }

    if (
        autorizacaoService
            .permissoesCarregadas()
    ) {
        return true;
    }

    return contextoOrganizacaoService
        .carregarESelecionarPadrao()
        .pipe(
            switchMap(() =>
                permissoesUsuarioService
                    .carregarPermissoes()
            ),
            map(() => true),
            catchError(() => of(false))
        );
};
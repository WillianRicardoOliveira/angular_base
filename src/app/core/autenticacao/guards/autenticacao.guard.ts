import {
    inject
} from '@angular/core';
import {
    Router
} from '@angular/router';
import {
    catchError,
    map,
    of
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

    return permissoesUsuarioService
        .carregarPermissoes()
        .pipe(
            map(() => true),
            catchError(() => of(false))
        );
};
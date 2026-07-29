import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {UsuarioAutenticadoService} from '@/core/autenticacao/services/usuario-autenticado.service';

export const AutenticacaoGuard = () => {
    const usuarioAutenticadoService = inject(UsuarioAutenticadoService);
    const router = inject(Router);

    if (usuarioAutenticadoService.estaLogado()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};
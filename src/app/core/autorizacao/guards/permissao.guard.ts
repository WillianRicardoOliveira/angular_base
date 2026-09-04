import {
    inject
} from '@angular/core';

import {
    ActivatedRouteSnapshot,
    Router
} from '@angular/router';

import {
    ToastrService
} from 'ngx-toastr';

import {
    MensagemAutenticacaoService
} from '@/core/autenticacao/services/mensagem-autenticacao.service';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

export const PermissaoGuard = (
    route: ActivatedRouteSnapshot
) => {
    const autorizacaoService =
        inject(
            AutorizacaoService
        );

    const mensagemAutenticacaoService =
        inject(
            MensagemAutenticacaoService
        );

    const toastr =
        inject(
            ToastrService
        );

    const router =
        inject(
            Router
        );

    const permissao =
        route.data[
            'permissao'
        ] as ChavePermissao | undefined;

    const permissoes =
        route.data[
            'permissoes'
        ] as
            readonly ChavePermissao[] |
            undefined;

    const possuiPermissaoUnica =
        permissao !==
            undefined &&
        autorizacaoService
            .possuiPermissao(
                permissao
            );

    const possuiAlgumaPermissao =
        !!permissoes?.length &&
        autorizacaoService
            .possuiAlgumaPermissao(
                permissoes
            );

    if (
        possuiPermissaoUnica ||
        possuiAlgumaPermissao
    ) {
        return true;
    }

    toastr.error(
        mensagemAutenticacaoService
            .obterMensagemAcessoNegado()
    );

    return router.createUrlTree([
        '/'
    ]);
};
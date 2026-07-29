import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CodigoErroAutenticacao } from '@/core/autenticacao/models/codigo-erro-autenticacao';
import { ErroApi } from '@/core/autenticacao/models/erro-api.model';

@Injectable({
    providedIn: 'root'
})
export class MensagemAutenticacaoService {
    obterMensagemLogin(erro: unknown): string {
        if (this.ehFalhaDeConexao(erro)) {
            return (
                'Serviço de autenticação indisponível. ' +
                'Tente novamente mais tarde.'
            );
        }

        const erroApi = this.extrairErroApi(erro);

        if (this.ehLoginBloqueado(erroApi)) {
            return (
                'Login temporariamente bloqueado. ' +
                'Tente novamente mais tarde.'
            );
        }

        return (
            'Não foi possível acessar o sistema. ' +
            'Verifique suas credenciais.'
        );
    }

    obterMensagemSso(erro: unknown): string {
        if (this.ehFalhaDeConexao(erro)) {
            return (
                'Serviço de autenticação indisponível. ' +
                'Tente novamente mais tarde.'
            );
        }

        const erroApi = this.extrairErroApi(erro);

        if (
            erroApi?.erro ===
            CodigoErroAutenticacao.SsoInvalido
        ) {
            return (
                'Não foi possível autenticar com o ' +
                'provedor corporativo.'
            );
        }

        return (
            'Não foi possível concluir o login corporativo.'
        );
    }

    obterMensagemSessaoExpirada(): string {
        return 'Sua sessão expirou. Entre novamente.';
    }

    obterMensagemAcessoNegado(): string {
        return (
            'Você não possui permissão para executar ' +
            'esta ação.'
        );
    }

    private ehLoginBloqueado(
        erroApi: ErroApi | null
    ): boolean {
        if (
            erroApi?.erro !==
            CodigoErroAutenticacao.RegraDeNegocio
        ) {
            return false;
        }

        return erroApi.mensagem
            .toLocaleLowerCase('pt-BR')
            .includes('temporariamente bloqueado');
    }

    private ehFalhaDeConexao(
        erro: unknown
    ): boolean {
        return (
            erro instanceof HttpErrorResponse &&
            erro.status === 0
        );
    }

    private extrairErroApi(
        erro: unknown
    ): ErroApi | null {
        if (!(erro instanceof HttpErrorResponse)) {
            return null;
        }

        const resposta = erro.error;

        if (
            !resposta ||
            typeof resposta !== 'object'
        ) {
            return null;
        }

        const candidato = resposta as Partial<ErroApi>;

        if (
            typeof candidato.status !== 'number' ||
            typeof candidato.erro !== 'string' ||
            typeof candidato.mensagem !== 'string'
        ) {
            return null;
        }

        return candidato as ErroApi;
    }
}
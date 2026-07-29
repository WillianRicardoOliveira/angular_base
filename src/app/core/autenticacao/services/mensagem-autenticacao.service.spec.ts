import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CodigoErroAutenticacao } from '@/core/autenticacao/models/codigo-erro-autenticacao';

import { MensagemAutenticacaoService } from './mensagem-autenticacao.service';

describe('MensagemAutenticacaoService', () => {
    let service: MensagemAutenticacaoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(
            MensagemAutenticacaoService
        );
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    it('deve retornar mensagem genérica para credenciais inválidas', () => {
        const erro = criarErroHttp(
            401,
            CodigoErroAutenticacao.NaoAutenticado,
            'Credenciais invalidas'
        );

        const mensagem =
            service.obterMensagemLogin(erro);

        expect(mensagem).toBe(
            'Não foi possível acessar o sistema. ' +
            'Verifique suas credenciais.'
        );
    });

    it('deve informar bloqueio temporário do login', () => {
        const erro = criarErroHttp(
            400,
            CodigoErroAutenticacao.RegraDeNegocio,
            'Login temporariamente bloqueado. ' +
            'Tente novamente mais tarde.'
        );

        const mensagem =
            service.obterMensagemLogin(erro);

        expect(mensagem).toBe(
            'Login temporariamente bloqueado. ' +
            'Tente novamente mais tarde.'
        );
    });

    it('não deve expor outra mensagem de regra de negócio no login', () => {
        const erro = criarErroHttp(
            400,
            CodigoErroAutenticacao.RegraDeNegocio,
            'Informação interna que não deve ser exibida'
        );

        const mensagem =
            service.obterMensagemLogin(erro);

        expect(mensagem).toBe(
            'Não foi possível acessar o sistema. ' +
            'Verifique suas credenciais.'
        );

        expect(mensagem).not.toContain(
            'Informação interna'
        );
    });

    it('deve informar indisponibilidade na falha de conexão', () => {
        const erro = new HttpErrorResponse({
            status: 0,
            statusText: 'Unknown Error'
        });

        const mensagem =
            service.obterMensagemLogin(erro);

        expect(mensagem).toBe(
            'Serviço de autenticação indisponível. ' +
            'Tente novamente mais tarde.'
        );
    });

    it('deve usar mensagem genérica para erro desconhecido', () => {
        const mensagem =
            service.obterMensagemLogin(
                new Error('Erro desconhecido')
            );

        expect(mensagem).toBe(
            'Não foi possível acessar o sistema. ' +
            'Verifique suas credenciais.'
        );
    });

    it('deve informar token SSO inválido sem expor detalhes', () => {
        const erro = criarErroHttp(
            401,
            CodigoErroAutenticacao.SsoInvalido,
            'Issuer ou audience inválidos'
        );

        const mensagem =
            service.obterMensagemSso(erro);

        expect(mensagem).toBe(
            'Não foi possível autenticar com o ' +
            'provedor corporativo.'
        );

        expect(mensagem).not.toContain(
            'Issuer'
        );
    });

    it('deve informar indisponibilidade no login SSO', () => {
        const erro = new HttpErrorResponse({
            status: 0,
            statusText: 'Unknown Error'
        });

        const mensagem =
            service.obterMensagemSso(erro);

        expect(mensagem).toBe(
            'Serviço de autenticação indisponível. ' +
            'Tente novamente mais tarde.'
        );
    });

    it('deve retornar mensagem de sessão expirada', () => {
        expect(
            service.obterMensagemSessaoExpirada()
        ).toBe(
            'Sua sessão expirou. Entre novamente.'
        );
    });

    it('deve retornar mensagem de acesso negado', () => {
        expect(
            service.obterMensagemAcessoNegado()
        ).toBe(
            'Você não possui permissão para executar ' +
            'esta ação.'
        );
    });

    function criarErroHttp(
        status: number,
        erro: CodigoErroAutenticacao,
        mensagem: string
    ): HttpErrorResponse {
        return new HttpErrorResponse({
            status,
            statusText: 'Erro',
            error: {
                status,
                erro,
                mensagem
            }
        });
    }
});
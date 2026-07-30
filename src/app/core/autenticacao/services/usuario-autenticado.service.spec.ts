import {TestBed} from '@angular/core/testing';
import {take} from 'rxjs';

import {TokenJwt} from '@/core/autenticacao/models/token-jwt.model';
import {TokenPayload} from '@/core/autenticacao/models/token-payload.model';
import {TokenService} from '@/core/autenticacao/services/token.service';
import {AutorizacaoService} from '@/core/autorizacao/services/autorizacao.service';

import {
    UsuarioAutenticadoService
} from './usuario-autenticado.service';

describe('UsuarioAutenticadoService', () => {
    let tokenServiceMock:
        jasmine.SpyObj<TokenService>;

    let autorizacaoServiceMock:
        jasmine.SpyObj<AutorizacaoService>;

    beforeEach(() => {
        tokenServiceMock =
            jasmine.createSpyObj<TokenService>(
                'TokenService',
                [
                    'possuiToken',
                    'retornarToken',
                    'salvarToken',
                    'salvarRefreshToken',
                    'excluirTokens'
                ]
            );

        autorizacaoServiceMock =
            jasmine.createSpyObj<AutorizacaoService>(
                'AutorizacaoService',
                ['limpar']
            );

        tokenServiceMock
            .possuiToken
            .and.returnValue(false);

        tokenServiceMock
            .retornarToken
            .and.returnValue('');

        TestBed.configureTestingModule({
            providers: [
                UsuarioAutenticadoService,
                {
                    provide: TokenService,
                    useValue: tokenServiceMock
                },
                {
                    provide: AutorizacaoService,
                    useValue: autorizacaoServiceMock
                }
            ]
        });
    });

    it('deve ser criado', () => {
        const service = criarService();

        expect(service).toBeTruthy();
    });

    it('deve decodificar o token existente ao iniciar', () => {
        const payload = criarPayload();
        const token = criarToken(payload);

        tokenServiceMock
            .possuiToken
            .and.returnValue(true);

        tokenServiceMock
            .retornarToken
            .and.returnValue(token);

        const service = criarService();

        service
            .retornarUser()
            .pipe(take(1))
            .subscribe((usuario) => {
                expect(usuario).toEqual(payload);
            });

        expect(
            autorizacaoServiceMock.limpar
        ).not.toHaveBeenCalled();
    });

    it('deve salvar e decodificar os tokens recebidos', () => {
        const payload = criarPayload();
        const accessToken = criarToken(payload);

        const tokens: TokenJwt = {
            token: accessToken,
            refreshToken: 'refresh-token'
        };

        tokenServiceMock
            .retornarToken
            .and.returnValue(accessToken);

        const service = criarService();

        service.salvarTokens(tokens);

        expect(
            tokenServiceMock.salvarToken
        ).toHaveBeenCalledOnceWith(
            accessToken
        );

        expect(
            tokenServiceMock.salvarRefreshToken
        ).toHaveBeenCalledOnceWith(
            'refresh-token'
        );

        service
            .retornarUser()
            .pipe(take(1))
            .subscribe((usuario) => {
                expect(usuario).toEqual(payload);
            });
    });

    it('deve limpar a sessão e as permissões quando o token for inválido', () => {
        tokenServiceMock
            .possuiToken
            .and.returnValue(true);

        tokenServiceMock
            .retornarToken
            .and.returnValue(
                'token-invalido'
            );

        const service = criarService();

        expect(
            tokenServiceMock.excluirTokens
        ).toHaveBeenCalledTimes(1);

        expect(
            autorizacaoServiceMock.limpar
        ).toHaveBeenCalledTimes(1);

        service
            .retornarUser()
            .pipe(take(1))
            .subscribe((usuario) => {
                expect(usuario).toBeNull();
            });
    });

    it('deve limpar tokens, permissões e usuário no logout', () => {
        const service = criarService();

        service.logout();

        expect(
            tokenServiceMock.excluirTokens
        ).toHaveBeenCalledTimes(1);

        expect(
            autorizacaoServiceMock.limpar
        ).toHaveBeenCalledTimes(1);

        service
            .retornarUser()
            .pipe(take(1))
            .subscribe((usuario) => {
                expect(usuario).toBeNull();
            });
    });

    it('deve informar se existe token', () => {
        tokenServiceMock
            .possuiToken
            .and.returnValue(true);

        const service = criarService();

        expect(
            service.estaLogado()
        ).toBeTrue();

        expect(
            tokenServiceMock.possuiToken
        ).toHaveBeenCalled();
    });

    function criarService():
        UsuarioAutenticadoService {
        return TestBed.inject(
            UsuarioAutenticadoService
        );
    }

    function criarPayload(): TokenPayload {
        return {
            id: 1,
            sub: 'usuario@teste.com',
            jti: 'jti-token',
            iss: 'erp-api-test',
            exp: 4102444800
        };
    }

    function criarToken(
        payload: TokenPayload
    ): string {
        const cabecalho =
            codificarBase64Url({
                alg: 'HS256',
                typ: 'JWT'
            });

        const conteudo =
            codificarBase64Url(payload);

        return (
            `${cabecalho}.` +
            `${conteudo}.` +
            'assinatura'
        );
    }

    function codificarBase64Url(
        valor: unknown
    ): string {
        return btoa(
            JSON.stringify(valor)
        )
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
});
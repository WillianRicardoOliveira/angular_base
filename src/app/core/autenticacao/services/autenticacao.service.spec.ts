import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TokenJwt } from '@/core/autenticacao/models/token-jwt.model';
import { TokenService } from '@/core/autenticacao/services/token.service';
import { UsuarioAutenticadoService } from '@/core/autenticacao/services/usuario-autenticado.service';
import { environment } from 'environments/environment';

import { AutenticacaoService } from './autenticacao.service';

describe('AutenticacaoService', () => {
    let service: AutenticacaoService;
    let httpTestingController: HttpTestingController;

    let usuarioAutenticadoServiceMock:
        jasmine.SpyObj<UsuarioAutenticadoService>;

    let tokenServiceMock:
        jasmine.SpyObj<TokenService>;

    beforeEach(() => {
        usuarioAutenticadoServiceMock =
            jasmine.createSpyObj<UsuarioAutenticadoService>(
                'UsuarioAutenticadoService',
                ['salvarTokens']
            );

        tokenServiceMock =
            jasmine.createSpyObj<TokenService>(
                'TokenService',
                ['retornarRefreshToken']
            );

        tokenServiceMock.retornarRefreshToken.and.returnValue(
            'refresh-token-atual'
        );

        TestBed.configureTestingModule({
            providers: [
                AutenticacaoService,
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: UsuarioAutenticadoService,
                    useValue: usuarioAutenticadoServiceMock
                },
                {
                    provide: TokenService,
                    useValue: tokenServiceMock
                }
            ]
        });

        service = TestBed.inject(AutenticacaoService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    it('deve autenticar e salvar os tokens recebidos', () => {
        const tokens: TokenJwt = {
            token: 'access-token',
            refreshToken: 'refresh-token'
        };

        service
            .login('usuario@empresa.com', 'senha')
            .subscribe((response) => {
                expect(response).toEqual(tokens);
            });

        const request = httpTestingController.expectOne(
            `${environment.api}/login`
        );

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual({
            email: 'usuario@empresa.com',
            senha: 'senha'
        });

        request.flush(tokens);

        expect(
            usuarioAutenticadoServiceMock.salvarTokens
        ).toHaveBeenCalledOnceWith(tokens);
    });

    it('deve renovar e rotacionar os tokens', () => {
        const novosTokens: TokenJwt = {
            token: 'novo-access-token',
            refreshToken: 'novo-refresh-token'
        };

        service.renovarToken().subscribe((response) => {
            expect(response).toEqual(novosTokens);
        });

        const request = httpTestingController.expectOne(
            `${environment.api}/login/refresh`
        );

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual({
            refreshToken: 'refresh-token-atual'
        });

        request.flush(novosTokens);

        expect(
            tokenServiceMock.retornarRefreshToken
        ).toHaveBeenCalled();

        expect(
            usuarioAutenticadoServiceMock.salvarTokens
        ).toHaveBeenCalledOnceWith(novosTokens);
    });
});
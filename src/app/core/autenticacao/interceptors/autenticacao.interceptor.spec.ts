import {
    HttpHandler,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TokenService } from '@/core/autenticacao/services/token.service';
import { environment } from 'environments/environment';

import { AutenticacaoInterceptor } from './autenticacao.interceptor';

describe('AutenticacaoInterceptor', () => {
    let interceptor: AutenticacaoInterceptor;
    let tokenServiceMock: jasmine.SpyObj<TokenService>;
    let httpHandlerMock: jasmine.SpyObj<HttpHandler>;

    beforeEach(() => {
        tokenServiceMock = jasmine.createSpyObj<TokenService>(
            'TokenService',
            [
                'possuiToken',
                'retornarToken'
            ]
        );

        httpHandlerMock = jasmine.createSpyObj<HttpHandler>(
            'HttpHandler',
            ['handle']
        );

        tokenServiceMock.possuiToken.and.returnValue(true);

        tokenServiceMock.retornarToken.and.returnValue(
            'access-token'
        );

        httpHandlerMock.handle.and.returnValue(
            of(
                new HttpResponse({
                    status: 200
                })
            )
        );

        TestBed.configureTestingModule({
            providers: [
                AutenticacaoInterceptor,
                {
                    provide: TokenService,
                    useValue: tokenServiceMock
                }
            ]
        });

        interceptor = TestBed.inject(
            AutenticacaoInterceptor
        );
    });

    it('deve ser criado', () => {
        expect(interceptor).toBeTruthy();
    });

    it('deve adicionar bearer em requisição protegida da API', () => {
        const request = new HttpRequest(
            'GET',
            `${environment.api}/perfil`
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe();

        const requestEncaminhada =
            httpHandlerMock.handle.calls.mostRecent()
                .args[0] as HttpRequest<unknown>;

        expect(
            requestEncaminhada.headers.get('Authorization')
        ).toBe('Bearer access-token');

        expect(
            tokenServiceMock.possuiToken
        ).toHaveBeenCalled();

        expect(
            tokenServiceMock.retornarToken
        ).toHaveBeenCalled();
    });

    it('não deve adicionar bearer quando não houver token', () => {
        tokenServiceMock.possuiToken.and.returnValue(false);

        const request = new HttpRequest(
            'GET',
            `${environment.api}/perfil`
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe();

        const requestEncaminhada =
            httpHandlerMock.handle.calls.mostRecent()
                .args[0] as HttpRequest<unknown>;

        expect(
            requestEncaminhada.headers.has('Authorization')
        ).toBeFalse();

        expect(
            tokenServiceMock.retornarToken
        ).not.toHaveBeenCalled();
    });

    [
        '/login',
        '/login/refresh',
        '/login/logout',
        '/login/sso'
    ].forEach((rota) => {
        it(`não deve adicionar bearer em ${rota}`, () => {
            const request = new HttpRequest(
                'POST',
                `${environment.api}${rota}`,
                null
            );

            interceptor
                .intercept(request, httpHandlerMock)
                .subscribe();

            const requestEncaminhada =
                httpHandlerMock.handle.calls.mostRecent()
                    .args[0] as HttpRequest<unknown>;

            expect(
                requestEncaminhada.headers.has(
                    'Authorization'
                )
            ).toBeFalse();

            expect(
                tokenServiceMock.retornarToken
            ).not.toHaveBeenCalled();
        });
    });

    it('não deve adicionar bearer em endereço externo', () => {
        const request = new HttpRequest(
            'GET',
            'https://api.externa.com/dados'
        );

        interceptor
            .intercept(request, httpHandlerMock)
            .subscribe();

        const requestEncaminhada =
            httpHandlerMock.handle.calls.mostRecent()
                .args[0] as HttpRequest<unknown>;

        expect(
            requestEncaminhada.headers.has('Authorization')
        ).toBeFalse();

        expect(
            tokenServiceMock.retornarToken
        ).not.toHaveBeenCalled();
    });
});
import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
    let service: TokenService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TokenService);
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('deve salvar e retornar o access token', () => {
        service.salvarToken('access-token');

        expect(service.retornarToken()).toBe('access-token');
        expect(service.possuiToken()).toBeTrue();
    });

    it('deve salvar e retornar o refresh token', () => {
        service.salvarRefreshToken('refresh-token');

        expect(service.retornarRefreshToken()).toBe('refresh-token');
        expect(service.possuiRefreshToken()).toBeTrue();
    });

    it('deve excluir o access token', () => {
        service.salvarToken('access-token');

        service.excluirToken();

        expect(service.retornarToken()).toBe('');
        expect(service.possuiToken()).toBeFalse();
    });

    it('deve excluir o refresh token', () => {
        service.salvarRefreshToken('refresh-token');

        service.excluirRefreshToken();

        expect(service.retornarRefreshToken()).toBe('');
        expect(service.possuiRefreshToken()).toBeFalse();
    });

    it('deve excluir todos os tokens', () => {
        service.salvarToken('access-token');
        service.salvarRefreshToken('refresh-token');

        service.excluirTokens();

        expect(service.possuiToken()).toBeFalse();
        expect(service.possuiRefreshToken()).toBeFalse();
    });
});
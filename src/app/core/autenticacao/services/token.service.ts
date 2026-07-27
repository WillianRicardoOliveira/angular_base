import { Injectable } from '@angular/core';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    salvarToken(token: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }

    salvarRefreshToken(refreshToken: string): void {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    retornarToken(): string {
        return localStorage.getItem(ACCESS_TOKEN_KEY) ?? '';
    }

    retornarRefreshToken(): string {
        return localStorage.getItem(REFRESH_TOKEN_KEY) ?? '';
    }

    possuiToken(): boolean {
        return !!this.retornarToken();
    }

    possuiRefreshToken(): boolean {
        return !!this.retornarRefreshToken();
    }

    excluirToken(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    }

    excluirRefreshToken(): void {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

    excluirTokens(): void {
        this.excluirToken();
        this.excluirRefreshToken();
    }
}
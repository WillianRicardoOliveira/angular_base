import {
    provideHttpClient
} from '@angular/common/http';

import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';

import {
    TestBed
} from '@angular/core/testing';

import {
    environment
} from 'environments/environment';

import {
    UsuarioService
} from './usuario.service';

describe('UsuarioService', () => {
    let service: UsuarioService;

    let httpTestingController:
        HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UsuarioService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service =
            TestBed.inject(
                UsuarioService
            );

        httpTestingController =
            TestBed.inject(
                HttpTestingController
            );
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    it('deve alterar a senha do usuário', () => {
        const dados = {
            id: 10,
            senha: 'Senha@123'
        };

        const resposta = {
            id: 10,
            email: 'usuario@teste.com',
            status: 'ATIVO' as const
        };

        service
            .alterarSenha(dados)
            .subscribe((usuario) => {
                expect(usuario).toEqual(
                    resposta
                );
            });

        const request =
            httpTestingController.expectOne(
                `${environment.api}/usuario/senha`
            );

        expect(
            request.request.method
        ).toBe('PUT');

        expect(
            request.request.body
        ).toEqual(dados);

        request.flush(resposta);
    });
});
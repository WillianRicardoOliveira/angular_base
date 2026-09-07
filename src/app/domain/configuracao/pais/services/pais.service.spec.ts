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
    PaisService
} from './pais.service';

describe('PaisService', () => {
    let service:
        PaisService;

    let httpTestingController:
        HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PaisService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service =
            TestBed.inject(
                PaisService
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
        expect(service)
            .toBeTruthy();
    });

    it(
        'deve listar paises',
        () => {
            const resposta = [
                {
                    codigo: 'BR',
                    nome: 'Brasil'
                },
                {
                    codigo: 'PY',
                    nome: 'Paraguai'
                }
            ];

            service.listar()
                .subscribe((resultado) => {
                    expect(resultado)
                        .toEqual(resposta);
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/configuracao/pais`
                    );

            expect(request.request.method)
                .toBe('GET');

            request.flush(resposta);
        }
    );

    it(
        'deve listar tipos de documento fiscal por pais',
        () => {
            const resposta = [
                {
                    codigo: 'CNPJ',
                    nome: 'CNPJ'
                }
            ];

            service.listarTiposDocumentoFiscal('BR')
                .subscribe((resultado) => {
                    expect(resultado)
                        .toEqual(resposta);
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/configuracao/pais/BR/tipos-documento-fiscal`
                    );

            expect(request.request.method)
                .toBe('GET');

            request.flush(resposta);
        }
    );
});
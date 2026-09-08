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
    EmpresaService
} from './empresa.service';

describe('EmpresaService', () => {
    let service:
        EmpresaService;

    let httpTestingController:
        HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EmpresaService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service =
            TestBed.inject(
                EmpresaService
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
        'deve listar empresas ordenadas por nome',
        () => {
            const resposta = {
                content: [
                    {
                        id: 1,
                        nome: 'Agrihold Management Corp',
                        razaoSocial:
                            'Agrihold Management Corp',
                        pais: 'BR',
                        tipoDocumentoFiscal: 'CNPJ',
                        documentoFiscal:
                            '10409614000185',
                        status: 'ATIVO' as const
                    }
                ],
                totalElements: 1
            };

            service.listar()
                .subscribe((resultado) => {
                    expect(resultado)
                        .toEqual(resposta);
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/configuracao/empresa?page=0&size=20&sort=nome,asc`
                    );

            expect(request.request.method)
                .toBe('GET');

            request.flush(resposta);
        }
    );

    it(
        'deve listar empresas com filtro',
        () => {
            const resposta = {
                content: [],
                totalElements: 0
            };

            service.listar(
                'Agrihold',
                0,
                10
            )
                .subscribe((resultado) => {
                    expect(resultado)
                        .toEqual(resposta);
                });

            const request =
                httpTestingController
                    .expectOne(
                        `${environment.api}/configuracao/empresa?page=0&size=10&sort=nome,asc&filtro=Agrihold`
                    );

            expect(request.request.method)
                .toBe('GET');

            request.flush(resposta);
        }
    );
});
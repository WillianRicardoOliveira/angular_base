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
    OrganizacaoPlataformaService
} from './organizacao-plataforma.service';

describe('OrganizacaoPlataformaService', () => {
    let service:
        OrganizacaoPlataformaService;

    let httpTestingController:
        HttpTestingController;

    const url =
        `${environment.api}/plataforma/organizacao`;

    const organizacao = {
        id: 3,
        nome: 'Organizacao Exemplo',
        status: 'ATIVO' as const
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                OrganizacaoPlataformaService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(
            OrganizacaoPlataformaService
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

    it('deve listar com parametros', () => {
        service
            .listar(
                1,
                20,
                ' nome,asc ',
                ' Exemplo '
            )
            .subscribe();

        const request =
            httpTestingController.expectOne(
                (requisicao) =>
                    requisicao.url === url
            );

        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('page')).toBe('1');
        expect(request.request.params.get('size')).toBe('20');
        expect(request.request.params.get('sort')).toBe('nome,asc');
        expect(request.request.params.get('filtro')).toBe('Exemplo');

        request.flush({
            content: [
                organizacao
            ],
            totalElements: 1
        });
    });

    it('deve listar sem parametros opcionais', () => {
        service
            .listar()
            .subscribe();

        const request =
            httpTestingController.expectOne(url);

        expect(request.request.method).toBe('GET');
        expect(request.request.params.keys()).toEqual([]);

        request.flush({
            content: [],
            totalElements: 0
        });
    });

    it('deve detalhar por id', () => {
        service
            .detalhar(3)
            .subscribe();

        const request =
            httpTestingController.expectOne(
                `${url}/3`
            );

        expect(request.request.method).toBe('GET');

        request.flush(organizacao);
    });

    it('deve editar nome', () => {
        const dados = {
            nome: 'Organizacao Atualizada'
        };

        service
            .editar(
                3,
                dados
            )
            .subscribe();

        const request =
            httpTestingController.expectOne(
                `${url}/3`
            );

        expect(request.request.method).toBe('PUT');
        expect(request.request.body).toEqual(dados);

        request.flush({
            ...organizacao,
            nome: dados.nome
        });
    });

    it('deve inativar', () => {
        service
            .inativar(3)
            .subscribe();

        const request =
            httpTestingController.expectOne(
                `${url}/3/inativar`
            );

        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toBeNull();

        request.flush({
            ...organizacao,
            status: 'INATIVO' as const
        });
    });

    it('deve reativar', () => {
        service
            .reativar(3)
            .subscribe();

        const request =
            httpTestingController.expectOne(
                `${url}/3/reativar`
            );

        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toBeNull();

        request.flush(organizacao);
    });

    it('deve remover', () => {
        service
            .remover(3)
            .subscribe((resultado) => {
                expect(resultado)
                    .toBeNull();
            });

        const request =
            httpTestingController.expectOne(
                `${url}/3`
            );

        expect(request.request.method).toBe('DELETE');
        expect(request.request.body).toBeNull();

        request.flush(null);
    });
});
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
    ConviteOrganizacaoService
} from './convite-organizacao.service';

describe('ConviteOrganizacaoService', () => {
    let service: ConviteOrganizacaoService;
    let httpTestingController: HttpTestingController;

    const url =
        `${environment.api}/plataforma/organizacao/convite`;

    const convite = {
        id: 4,
        nomeOrganizacao: 'Organizacao Exemplo',
        emailAdministrador: 'admin@empresa.com',
        criadoEm: '2026-08-26T10:00:00',
        expiraEm: '2026-08-28T10:00:00',
        aceitoEm: null,
        status: 'PENDENTE' as const,
        expirado: false
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ConviteOrganizacaoService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(
            ConviteOrganizacaoService
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

    it('deve criar convite', () => {
        const dados = {
            nomeOrganizacao: 'Organizacao Exemplo',
            emailAdministrador: 'admin@empresa.com'
        };

        service.convidar(dados).subscribe();

        const request =
            httpTestingController.expectOne(url);

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(dados);

        request.flush(convite);
    });

    it('deve listar com parametros', () => {
        service
            .listar(
                1,
                20,
                ' id,desc ',
                ' admin ',
                'PENDENTE'
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
        expect(request.request.params.get('sort')).toBe('id,desc');
        expect(request.request.params.get('filtro')).toBe('admin');
        expect(request.request.params.get('status')).toBe('PENDENTE');

        request.flush({
            content: [
                convite
            ],
            totalElements: 1
        });
    });

    it('deve listar sem parametros opcionais', () => {
        service.listar().subscribe();

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
        service.detalhar(4).subscribe();

        const request =
            httpTestingController.expectOne(
                `${url}/4`
            );

        expect(request.request.method).toBe('GET');

        request.flush(convite);
    });

    it('deve revogar', () => {
        service.revogar(4).subscribe();

        const request =
            httpTestingController.expectOne(
                `${url}/4`
            );

        expect(request.request.method).toBe('DELETE');

        request.flush(null);
    });

    it('deve reenviar', () => {
        service.reenviar(4).subscribe();

        const request =
            httpTestingController.expectOne(
                `${url}/4/reenvio`
            );

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toBeNull();

        request.flush(convite);
    });

    it('deve consultar convite', () => {
        service.consultar(' token ').subscribe();

        const request =
            httpTestingController.expectOne(
                `${url}/consulta`
            );

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual({
            token: 'token'
        });

        request.flush({
            nomeOrganizacao: 'Organizacao Exemplo',
            emailAdministradorMascarado: 'a***@empresa.com',
            usuarioExistente: false
        });
    });

    it('deve aceitar com usuario existente', () => {
        service
            .aceitarUsuarioExistente(' token ')
            .subscribe();

        const request =
            httpTestingController.expectOne(
                `${url}/aceite/usuario-existente`
            );

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual({
            token: 'token'
        });

        request.flush({
            idOrganizacao: 10,
            nomeOrganizacao: 'Organizacao Exemplo'
        });
    });

    it('deve aceitar com novo usuario', () => {
        service
            .aceitarNovoUsuario({
                token: ' token ',
                senha: 'SenhaForte@123'
            })
            .subscribe();

        const request =
            httpTestingController.expectOne(
                `${url}/aceite/novo-usuario`
            );

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual({
            token: 'token',
            senha: 'SenhaForte@123'
        });

        request.flush({
            idOrganizacao: 10,
            nomeOrganizacao: 'Organizacao Exemplo'
        });
    });
});
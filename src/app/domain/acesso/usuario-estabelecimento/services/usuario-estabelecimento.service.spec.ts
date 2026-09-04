import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'environments/environment';

import { UsuarioEstabelecimentoService } from './usuario-estabelecimento.service';

describe('UsuarioEstabelecimentoService', () => {
    let service: UsuarioEstabelecimentoService;
    let httpTestingController: HttpTestingController;

    const url =
        `${environment.api}/acesso/usuario-estabelecimento`;

    const resposta = {
        id: 7,
        idUsuarioEmpresa: 5,
        idUsuario: 2,
        usuario: 'usuario@empresa.com',
        idEmpresa: 3,
        empresa: 'Empresa Exemplo',
        idEstabelecimento: 11,
        estabelecimento: 'Estabelecimento Centro',
        status: 'ATIVO' as const
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UsuarioEstabelecimentoService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(UsuarioEstabelecimentoService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('deve listar vinculos com todos os parametros', () => {
        service.listar(1, 20, ' id,asc ', 5).subscribe();

        const request = httpTestingController.expectOne(
            (requisicao) => requisicao.url === url
        );

        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('page')).toBe('1');
        expect(request.request.params.get('size')).toBe('20');
        expect(request.request.params.get('sort')).toBe('id,asc');
        expect(request.request.params.get('idUsuarioEmpresa')).toBe('5');

        request.flush({
            content: [resposta],
            totalElements: 1
        });
    });

    it('deve listar vinculos sem parametros opcionais', () => {
        service.listar().subscribe();

        const request = httpTestingController.expectOne(url);

        expect(request.request.method).toBe('GET');
        expect(request.request.params.keys()).toEqual([]);

        request.flush({
            content: [],
            totalElements: 0
        });
    });

    it('deve cadastrar vinculo', () => {
        const dados = {
            idUsuarioEmpresa: 5,
            idEstabelecimento: 11
        };

        service.cadastrar(dados).subscribe();

        const request = httpTestingController.expectOne(url);

        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(dados);

        request.flush(resposta);
    });

    it('deve detalhar vinculo', () => {
        service.detalhar(7).subscribe();

        const request = httpTestingController.expectOne(`${url}/7`);

        expect(request.request.method).toBe('GET');

        request.flush(resposta);
    });

    it('deve excluir vinculo', () => {
        service.excluir(7).subscribe();

        const request = httpTestingController.expectOne(`${url}/7`);

        expect(request.request.method).toBe('DELETE');

        request.flush(null);
    });
});
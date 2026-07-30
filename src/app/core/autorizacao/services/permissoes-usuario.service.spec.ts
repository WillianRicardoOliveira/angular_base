import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import {
    TestBed
} from '@angular/core/testing';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';
import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';
import {
    environment
} from 'environments/environment';

import {
    PermissoesUsuarioService
} from './permissoes-usuario.service';

describe('PermissoesUsuarioService', () => {
    let service: PermissoesUsuarioService;

    let httpTestingController:
        HttpTestingController;

    let autorizacaoServiceMock:
        jasmine.SpyObj<AutorizacaoService>;

    beforeEach(() => {
        autorizacaoServiceMock =
            jasmine.createSpyObj<AutorizacaoService>(
                'AutorizacaoService',
                ['definirPermissoes']
            );

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                PermissoesUsuarioService,
                {
                    provide: AutorizacaoService,
                    useValue: autorizacaoServiceMock
                }
            ]
        });

        service =
            TestBed.inject(
                PermissoesUsuarioService
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

    it('deve consultar e armazenar as permissões do usuário', () => {
        const permissoes = [
            ChavePermissao.UsuarioListar,
            ChavePermissao.PerfilDetalhar
        ];

        let resultado: void | undefined;

        service
            .carregarPermissoes()
            .subscribe((resposta) => {
                resultado = resposta;
            });

        const request =
            httpTestingController.expectOne(
                `${environment.api}/login/permissoes`
            );

        expect(
            request.request.method
        ).toBe('GET');

        request.flush({
            permissoes
        });

        expect(
            autorizacaoServiceMock
                .definirPermissoes
        ).toHaveBeenCalledOnceWith(
            permissoes
        );

        expect(
            resultado
        ).toBeUndefined();
    });
});
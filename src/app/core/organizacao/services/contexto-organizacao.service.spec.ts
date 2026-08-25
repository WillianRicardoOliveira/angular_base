import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {take} from 'rxjs';

import {
    OrganizacaoDisponivel
} from '@/core/organizacao/models/organizacao-disponivel.model';
import {environment} from 'environments/environment';

import {
    ContextoOrganizacaoService
} from './contexto-organizacao.service';

describe('ContextoOrganizacaoService', () => {
    const storageKey =
        'erp.organizacao.ativa.id';

    let service: ContextoOrganizacaoService;

    let httpTestingController:
        HttpTestingController;

    beforeEach(() => {
        localStorage.removeItem(storageKey);

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                ContextoOrganizacaoService
            ]
        });

        service =
            TestBed.inject(
                ContextoOrganizacaoService
            );

        httpTestingController =
            TestBed.inject(
                HttpTestingController
            );
    });

    afterEach(() => {
        httpTestingController.verify();
        localStorage.removeItem(storageKey);
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    it('deve carregar organizacoes e selecionar a primeira como padrao', () => {
        const organizacoes =
            criarOrganizacoes();

        let resultado:
            OrganizacaoDisponivel | null | undefined;

        service
            .carregarESelecionarPadrao()
            .subscribe((organizacao) => {
                resultado = organizacao;
            });

        const request =
            httpTestingController.expectOne(
                `${environment.api}/organizacao/disponiveis`
            );

        expect(request.request.method)
            .toBe('GET');

        request.flush(organizacoes);

        expect(resultado)
            .toEqual(organizacoes[0]);

        expect(
            localStorage.getItem(storageKey)
        ).toBe('1');

        service
            .retornarOrganizacaoAtivaObservable()
            .pipe(take(1))
            .subscribe((organizacao) => {
                expect(organizacao)
                    .toEqual(organizacoes[0]);
            });

        expect(service.foiCarregado())
            .toBeTrue();
    });

    it('deve manter organizacao salva quando ela ainda estiver disponivel', () => {
        localStorage.setItem(
            storageKey,
            '2'
        );

        const organizacoes =
            criarOrganizacoes();

        let resultado:
            OrganizacaoDisponivel | null | undefined;

        service
            .carregarESelecionarPadrao()
            .subscribe((organizacao) => {
                resultado = organizacao;
            });

        httpTestingController
            .expectOne(
                `${environment.api}/organizacao/disponiveis`
            )
            .flush(organizacoes);

        expect(resultado)
            .toEqual(organizacoes[1]);

        expect(
            localStorage.getItem(storageKey)
        ).toBe('2');
    });

    it('deve selecionar a primeira quando a organizacao salva nao estiver disponivel', () => {
        localStorage.setItem(
            storageKey,
            '99'
        );

        const organizacoes =
            criarOrganizacoes();

        let resultado:
            OrganizacaoDisponivel | null | undefined;

        service
            .carregarESelecionarPadrao()
            .subscribe((organizacao) => {
                resultado = organizacao;
            });

        httpTestingController
            .expectOne(
                `${environment.api}/organizacao/disponiveis`
            )
            .flush(organizacoes);

        expect(resultado)
            .toEqual(organizacoes[0]);

        expect(
            localStorage.getItem(storageKey)
        ).toBe('1');
    });

    it('deve retornar null e limpar storage quando nao houver organizacoes', () => {
        localStorage.setItem(
            storageKey,
            '1'
        );

        let resultado:
            OrganizacaoDisponivel | null | undefined;

        service
            .carregarESelecionarPadrao()
            .subscribe((organizacao) => {
                resultado = organizacao;
            });

        httpTestingController
            .expectOne(
                `${environment.api}/organizacao/disponiveis`
            )
            .flush([]);

        expect(resultado)
            .toBeNull();

        expect(
            localStorage.getItem(storageKey)
        ).toBeNull();

        expect(
            service.possuiOrganizacaoAtiva()
        ).toBeFalse();
    });

    it('deve trocar a organizacao ativa', () => {
        const organizacoes =
            criarOrganizacoes();

        service
            .carregarESelecionarPadrao()
            .subscribe();

        httpTestingController
            .expectOne(
                `${environment.api}/organizacao/disponiveis`
            )
            .flush(organizacoes);

        const selecionada =
            service.definirOrganizacaoAtiva(2);

        expect(selecionada)
            .toEqual(organizacoes[1]);

        expect(
            service.retornarIdOrganizacaoAtiva()
        ).toBe(2);

        expect(
            localStorage.getItem(storageKey)
        ).toBe('2');
    });

    it('deve rejeitar troca para organizacao indisponivel', () => {
        const organizacoes =
            criarOrganizacoes();

        service
            .carregarESelecionarPadrao()
            .subscribe();

        httpTestingController
            .expectOne(
                `${environment.api}/organizacao/disponiveis`
            )
            .flush(organizacoes);

        expect(() =>
            service.definirOrganizacaoAtiva(99)
        ).toThrowError(
            'Organizacao nao disponivel.'
        );

        expect(
            service.retornarIdOrganizacaoAtiva()
        ).toBe(1);
    });

    it('deve limpar contexto local', () => {
        const organizacoes =
            criarOrganizacoes();

        service
            .carregarESelecionarPadrao()
            .subscribe();

        httpTestingController
            .expectOne(
                `${environment.api}/organizacao/disponiveis`
            )
            .flush(organizacoes);

        service.limpar();

        expect(
            localStorage.getItem(storageKey)
        ).toBeNull();

        expect(
            service.retornarOrganizacaoAtiva()
        ).toBeNull();

        expect(
            service.foiCarregado()
        ).toBeFalse();

        service
            .retornarOrganizacoesDisponiveis()
            .pipe(take(1))
            .subscribe((lista) => {
                expect(lista)
                    .toEqual([]);
            });
    });

    function criarOrganizacoes():
        OrganizacaoDisponivel[] {
        return [
            {
                id: 1,
                nome: 'Organizacao A'
            },
            {
                id: 2,
                nome: 'Organizacao B'
            }
        ];
    }
});
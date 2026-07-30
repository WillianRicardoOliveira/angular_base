import {Component} from '@angular/core';
import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';
import {
    AutorizacaoService
} from '@/core/autorizacao/services/autorizacao.service';

import {
    TemPermissaoDirective
} from './tem-permissao.directive';

@Component({
    template: `
        <button
            *appTemPermissao="permissao"
            data-testid="acao"
        >
            Executar ação
        </button>
    `,
    imports: [
        TemPermissaoDirective
    ]
})
class ComponenteTeste {
    permissao =
        ChavePermissao.UsuarioCriar;
}

describe('TemPermissaoDirective', () => {
    let fixture:
        ComponentFixture<ComponenteTeste>;

    let autorizacaoService:
        AutorizacaoService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ComponenteTeste
            ]
        }).compileComponents();

        autorizacaoService =
            TestBed.inject(
                AutorizacaoService
            );

        fixture =
            TestBed.createComponent(
                ComponenteTeste
            );

        fixture.detectChanges();
    });

    it('deve ocultar o elemento antes de carregar permissões', () => {
        expect(
            buscarAcao()
        ).toBeNull();
    });

    it('deve exibir o elemento quando houver permissão', () => {
        autorizacaoService
            .definirPermissoes([
                ChavePermissao.UsuarioCriar
            ]);

        fixture.detectChanges();

        expect(
            buscarAcao()
        ).not.toBeNull();
    });

    it('deve manter o elemento oculto sem a permissão exigida', () => {
        autorizacaoService
            .definirPermissoes([
                ChavePermissao.UsuarioListar
            ]);

        fixture.detectChanges();

        expect(
            buscarAcao()
        ).toBeNull();
    });

    it('deve remover o elemento após limpar as permissões', () => {
        autorizacaoService
            .definirPermissoes([
                ChavePermissao.UsuarioCriar
            ]);

        fixture.detectChanges();

        expect(
            buscarAcao()
        ).not.toBeNull();

        autorizacaoService.limpar();

        fixture.detectChanges();

        expect(
            buscarAcao()
        ).toBeNull();
    });

    function buscarAcao():
        HTMLButtonElement | null {
        return fixture
            .nativeElement
            .querySelector(
                '[data-testid="acao"]'
            );
    }
});
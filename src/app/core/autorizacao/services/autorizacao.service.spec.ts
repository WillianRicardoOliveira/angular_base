import {TestBed} from '@angular/core/testing';
import {take} from 'rxjs';

import {
    ChavePermissao
} from '@/core/autorizacao/models/chave-permissao';

import {
    AutorizacaoService
} from './autorizacao.service';

describe('AutorizacaoService', () => {
    let service: AutorizacaoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(
            AutorizacaoService
        );
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    it('deve iniciar sem permissões carregadas', () => {
        expect(
            service.permissoesCarregadas()
        ).toBeFalse();

        expect(
            service.possuiPermissao(
                ChavePermissao.UsuarioListar
            )
        ).toBeFalse();
    });

    it('deve definir as permissões do usuário', () => {
        service.definirPermissoes([
            ChavePermissao.UsuarioListar,
            ChavePermissao.UsuarioCriar
        ]);

        expect(
            service.permissoesCarregadas()
        ).toBeTrue();

        expect(
            service.possuiPermissao(
                ChavePermissao.UsuarioListar
            )
        ).toBeTrue();

        expect(
            service.possuiPermissao(
                ChavePermissao.UsuarioExcluir
            )
        ).toBeFalse();
    });

    it('deve informar quando houver alguma permissão', () => {
        service.definirPermissoes([
            ChavePermissao.PerfilListar
        ]);

        expect(
            service.possuiAlgumaPermissao([
                ChavePermissao.PerfilCriar,
                ChavePermissao.PerfilListar
            ])
        ).toBeTrue();

        expect(
            service.possuiAlgumaPermissao([
                ChavePermissao.PerfilEditar,
                ChavePermissao.PerfilExcluir
            ])
        ).toBeFalse();
    });

    it('deve exigir todas as permissões informadas', () => {
        service.definirPermissoes([
            ChavePermissao.PermissaoListar,
            ChavePermissao.PermissaoDetalhar
        ]);

        expect(
            service.possuiTodasPermissoes([
                ChavePermissao.PermissaoListar,
                ChavePermissao.PermissaoDetalhar
            ])
        ).toBeTrue();

        expect(
            service.possuiTodasPermissoes([
                ChavePermissao.PermissaoListar,
                ChavePermissao.PermissaoEditar
            ])
        ).toBeFalse();
    });

    it('não deve autorizar uma lista vazia', () => {
        service.definirPermissoes([
            ChavePermissao.UsuarioListar
        ]);

        expect(
            service.possuiTodasPermissoes([])
        ).toBeFalse();

        expect(
            service.possuiAlgumaPermissao([])
        ).toBeFalse();
    });

    it('deve eliminar permissões duplicadas', () => {
        service.definirPermissoes([
            ChavePermissao.UsuarioListar,
            ChavePermissao.UsuarioListar
        ]);

        service
            .retornarEstado()
            .pipe(take(1))
            .subscribe((estado) => {
                expect(
                    estado.permissoes.size
                ).toBe(1);
            });
    });

    it('deve limpar o estado de autorização', () => {
        service.definirPermissoes([
            ChavePermissao.UsuarioListar
        ]);

        service.limpar();

        expect(
            service.permissoesCarregadas()
        ).toBeFalse();

        expect(
            service.possuiPermissao(
                ChavePermissao.UsuarioListar
            )
        ).toBeFalse();

        service
            .retornarEstado()
            .pipe(take(1))
            .subscribe((estado) => {
                expect(estado.carregado).toBeFalse();
                expect(estado.permissoes.size).toBe(0);
            });
    });
});
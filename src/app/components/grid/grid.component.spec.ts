import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import {
    MatDialog
} from '@angular/material/dialog';

import {
    MatPaginatorIntl
} from '@angular/material/paginator';

import {
    of
} from 'rxjs';

import {
    AppSharedConfirmacaoComponent
} from '@components/shared/app-shared-confirmacao/app-shared-confirmacao.component';

import {
    GridComponent
} from './grid.component';

describe('GridComponent', () => {
    let component:
        GridComponent;

    let fixture:
        ComponentFixture<GridComponent>;

    const dialogMock = {
        open:
            jasmine.createSpy(
                'open'
            )
    };

    beforeEach(async () => {
        dialogMock
            .open
            .calls
            .reset();

        dialogMock
            .open
            .and.returnValue({
                afterClosed: () =>
                    of(false)
            } as never);

        await TestBed
            .configureTestingModule({
                declarations: [
                    GridComponent
                ],
                providers: [
                    MatPaginatorIntl,
                    {
                        provide:
                            MatDialog,
                        useValue:
                            dialogMock
                    }
                ]
            })
            .overrideComponent(
                GridComponent,
                {
                    set: {
                        template: ''
                    }
                }
            )
            .compileComponents();

        fixture =
            TestBed.createComponent(
                GridComponent
            );

        component =
            fixture.componentInstance;

        fixture.detectChanges();
    });

    it(
        'deve ser criado',
        () => {
            expect(
                component
            ).toBeTruthy();
        }
    );

    it(
        'deve exibir a ação adicionar por padrão',
        () => {
            expect(
                component.b_adicionar
            ).toBeTrue();
        }
    );

    it(
        'deve permitir ocultar a ação adicionar',
        () => {
            component.b_adicionar = false;

            expect(
                component.b_adicionar
            ).toBeFalse();
        }
    );

    it(
        'deve emitir o evento de adicionar',
        () => {
            const adicionarSpy =
                jasmine.createSpy(
                    'adicionar'
                );

            component.adicionar.subscribe(
                adicionarSpy
            );

            component.botaoAdicionar();

            expect(
                adicionarSpy
            ).toHaveBeenCalledTimes(1);
        }
    );

    it(
        'deve exibir pesquisa e paginação por padrão',
        () => {
            expect(
                component.b_pesquisa
            ).toBeTrue();

            expect(
                component.b_paginacao
            ).toBeTrue();
        }
    );

    it(
        'deve permitir ocultar pesquisa e paginação',
        () => {
            component.b_pesquisa = false;
            component.b_paginacao = false;

            expect(
                component.b_pesquisa
            ).toBeFalse();

            expect(
                component.b_paginacao
            ).toBeFalse();
        }
    );

    it(
        'deve usar os textos e o ícone padrão',
        () => {
            expect(
                component.textoAdicionar
            ).toBe('Adicionar');

            expect(
                component.iconeChamar
            ).toBe(
                'list_alt_add'
            );

            expect(
                component.tooltipChamar
            ).toBe(
                'Abrir opções'
            );
        }
    );

    it(
        'deve permitir configurar os textos e o ícone',
        () => {
            component.textoAdicionar =
                'Novo usuário';

            component.iconeChamar =
                'manage_accounts';

            component.tooltipChamar =
                'Gerenciar perfis';

            expect(
                component.textoAdicionar
            ).toBe('Novo usuário');

            expect(
                component.iconeChamar
            ).toBe(
                'manage_accounts'
            );

            expect(
                component.tooltipChamar
            ).toBe(
                'Gerenciar perfis'
            );
        }
    );

    it(
        'deve emitir o identificador na ação contextual',
        () => {
            const chamarSpy =
                jasmine.createSpy(
                    'chamar'
                );

            component.chamar.subscribe(
                chamarSpy
            );

            component.botaoChamar(10);

            expect(
                chamarSpy
            ).toHaveBeenCalledOnceWith(
                10
            );
        }
    );

    it(
        'deve usar os textos padrão da exclusão',
        () => {
            expect(
                component.tituloExclusao
            ).toBe(
                'Excluir registro'
            );

            expect(
                component.mensagemExclusao
            ).toBe(
                'Deseja realmente excluir este registro?'
            );

            expect(
                component
                    .textoConfirmarExclusao
            ).toBe('Excluir');
        }
    );

    it(
        'deve permitir configurar os textos da exclusão',
        () => {
            component.tituloExclusao =
                'Remover perfil';

            component.mensagemExclusao =
                'Deseja remover este perfil do usuário?';

            component
                .textoConfirmarExclusao =
                    'Remover';

            expect(
                component.tituloExclusao
            ).toBe('Remover perfil');

            expect(
                component.mensagemExclusao
            ).toBe(
                'Deseja remover este perfil do usuário?'
            );

            expect(
                component
                    .textoConfirmarExclusao
            ).toBe('Remover');
        }
    );

    it(
        'deve emitir exclusão após confirmação',
        () => {
            dialogMock
                .open
                .and.returnValue({
                    afterClosed: () =>
                        of(true)
                } as never);

            const excluirSpy =
                jasmine.createSpy(
                    'excluir'
                );

            component.excluir.subscribe(
                excluirSpy
            );

            component.botaoExcluir(10);

            expect(
                dialogMock.open
            ).toHaveBeenCalledOnceWith(
                AppSharedConfirmacaoComponent,
                {
                    data: {
                        titulo:
                            'Excluir registro',
                        mensagem:
                            'Deseja realmente excluir este registro?',
                        textoConfirmar:
                            'Excluir',
                        textoCancelar:
                            'Cancelar',
                        tipo:
                            'perigo'
                    }
                }
            );

            expect(
                excluirSpy
            ).toHaveBeenCalledOnceWith(
                10
            );
        }
    );

    it(
        'não deve emitir exclusão após cancelamento',
        () => {
            const excluirSpy =
                jasmine.createSpy(
                    'excluir'
                );

            component.excluir.subscribe(
                excluirSpy
            );

            component.botaoExcluir(10);

            expect(
                dialogMock.open
            ).toHaveBeenCalledTimes(1);

            expect(
                excluirSpy
            ).not.toHaveBeenCalled();
        }
    );

    it(
        'deve reconhecer os status do sistema',
        () => {
            expect(
                component.ehStatus(
                    'ATIVO'
                )
            ).toBeTrue();

            expect(
                component.ehStatus(
                    'inativo'
                )
            ).toBeTrue();

            expect(
                component.ehStatus(
                    'REMOVIDO'
                )
            ).toBeTrue();

            expect(
                component.ehStatus(
                    'PENDENTE'
                )
            ).toBeFalse();

            expect(
                component.ehStatus(null)
            ).toBeFalse();
        }
    );

    it(
        'deve gerar a classe visual do status',
        () => {
            expect(
                component.classeStatus(
                    'ATIVO'
                )
            ).toBe(
                'grid-status--ativo'
            );

            expect(
                component.classeStatus(
                    'INATIVO'
                )
            ).toBe(
                'grid-status--inativo'
            );

            expect(
                component.classeStatus(
                    'REMOVIDO'
                )
            ).toBe(
                'grid-status--removido'
            );

            expect(
                component.classeStatus(
                    'PENDENTE'
                )
            ).toBe('');
        }
    );

    it(
        'deve formatar o texto do status',
        () => {
            expect(
                component.textoStatus(
                    'ATIVO'
                )
            ).toBe('Ativo');

            expect(
                component.textoStatus(
                    'INATIVO'
                )
            ).toBe('Inativo');

            expect(
                component.textoStatus(
                    'REMOVIDO'
                )
            ).toBe('Removido');

            expect(
                component.textoStatus(
                    'Outro'
                )
            ).toBe('Outro');

            expect(
                component.textoStatus(null)
            ).toBe('');
        }
    );
});
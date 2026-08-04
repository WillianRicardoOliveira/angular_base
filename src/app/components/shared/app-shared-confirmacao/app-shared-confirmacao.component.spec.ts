import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import {
    MAT_DIALOG_DATA,
    MatDialogRef
} from '@angular/material/dialog';

import {
    AppSharedConfirmacaoComponent,
    DadosConfirmacao
} from './app-shared-confirmacao.component';

describe(
    'AppSharedConfirmacaoComponent',
    () => {
        let component:
            AppSharedConfirmacaoComponent;

        let fixture:
            ComponentFixture<
                AppSharedConfirmacaoComponent
            >;

        const dados:
            DadosConfirmacao = {
                mensagem:
                    'Deseja continuar?'
            };

        const dialogRefMock = {
            close:
                jasmine.createSpy(
                    'close'
                )
        };

        beforeEach(async () => {
            dialogRefMock
                .close
                .calls
                .reset();

            dados.titulo = undefined;
            dados.textoConfirmar =
                undefined;
            dados.textoCancelar =
                undefined;
            dados.tipo = undefined;

            await TestBed
                .configureTestingModule({
                    declarations: [
                        AppSharedConfirmacaoComponent
                    ],
                    providers: [
                        {
                            provide:
                                MAT_DIALOG_DATA,
                            useValue:
                                dados
                        },
                        {
                            provide:
                                MatDialogRef,
                            useValue:
                                dialogRefMock
                        }
                    ]
                })
                .overrideComponent(
                    AppSharedConfirmacaoComponent,
                    {
                        set: {
                            template: ''
                        }
                    }
                )
                .compileComponents();

            fixture =
                TestBed.createComponent(
                    AppSharedConfirmacaoComponent
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
            'deve usar os valores padrão',
            () => {
                expect(
                    component.titulo
                ).toBe(
                    'Confirmar ação'
                );

                expect(
                    component
                        .textoConfirmar
                ).toBe('Confirmar');

                expect(
                    component
                        .textoCancelar
                ).toBe('Cancelar');

                expect(
                    component.tipo
                ).toBe('padrao');

                expect(
                    component.dados
                        .mensagem
                ).toBe(
                    'Deseja continuar?'
                );
            }
        );

        it(
            'deve usar os valores personalizados',
            () => {
                dados.titulo =
                    'Excluir registro';

                dados.textoConfirmar =
                    'Excluir';

                dados.textoCancelar =
                    'Voltar';

                dados.tipo =
                    'perigo';

                expect(
                    component.titulo
                ).toBe(
                    'Excluir registro'
                );

                expect(
                    component
                        .textoConfirmar
                ).toBe('Excluir');

                expect(
                    component
                        .textoCancelar
                ).toBe('Voltar');

                expect(
                    component.tipo
                ).toBe('perigo');
            }
        );

        it(
            'deve confirmar a ação',
            () => {
                component.confirmar();

                expect(
                    dialogRefMock.close
                ).toHaveBeenCalledOnceWith(
                    true
                );
            }
        );

        it(
            'deve cancelar a ação',
            () => {
                component.cancelar();

                expect(
                    dialogRefMock.close
                ).toHaveBeenCalledOnceWith(
                    false
                );
            }
        );
    }
);
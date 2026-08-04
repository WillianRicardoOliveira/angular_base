import {
    Component,
    Inject
} from '@angular/core';

import {
    MAT_DIALOG_DATA,
    MatDialogRef
} from '@angular/material/dialog';

export type TipoConfirmacao =
    | 'padrao'
    | 'atencao'
    | 'perigo';

export interface DadosConfirmacao {
    titulo?: string;
    mensagem: string;
    textoConfirmar?: string;
    textoCancelar?: string;
    tipo?: TipoConfirmacao;
}

@Component({
    selector:
        'app-shared-confirmacao',
    templateUrl:
        './app-shared-confirmacao.component.html',
    styleUrls: [
        './app-shared-confirmacao.component.scss'
    ],
    standalone: false
})
export class AppSharedConfirmacaoComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly dados:
            DadosConfirmacao,

        private readonly dialogRef:
            MatDialogRef<
                AppSharedConfirmacaoComponent,
                boolean
            >
    ) {}

    confirmar(): void {
        this.dialogRef.close(true);
    }

    cancelar(): void {
        this.dialogRef.close(false);
    }

    get titulo(): string {
        return (
            this.dados.titulo ??
            'Confirmar ação'
        );
    }

    get textoConfirmar(): string {
        return (
            this.dados.textoConfirmar ??
            'Confirmar'
        );
    }

    get textoCancelar(): string {
        return (
            this.dados.textoCancelar ??
            'Cancelar'
        );
    }

    get tipo(): TipoConfirmacao {
        return (
            this.dados.tipo ??
            'padrao'
        );
    }
}
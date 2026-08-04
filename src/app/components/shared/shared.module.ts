import {
    CommonModule
} from '@angular/common';

import {
    NgModule
} from '@angular/core';

import {
    ReactiveFormsModule
} from '@angular/forms';

import {
    MatButtonModule
} from '@angular/material/button';

import {
    MatDialogModule
} from '@angular/material/dialog';

import {
    MatFormFieldModule
} from '@angular/material/form-field';

import {
    MatIconModule
} from '@angular/material/icon';

import {
    MatSelectModule
} from '@angular/material/select';

import {
    TemPermissaoDirective
} from '@/core/autorizacao/directives/tem-permissao.directive';

import {
    AppSharedConfirmacaoComponent
} from './app-shared-confirmacao/app-shared-confirmacao.component';

import {
    AppSharedSelectComponent
} from './app-shared-select/app-shared-select.component';

@NgModule({
    declarations: [
        AppSharedConfirmacaoComponent,
        AppSharedSelectComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        TemPermissaoDirective
    ],
    exports: [
        AppSharedConfirmacaoComponent,
        AppSharedSelectComponent,
        TemPermissaoDirective
    ]
})
export class SharedModule {}
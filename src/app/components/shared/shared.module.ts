import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

import {
    TemPermissaoDirective
} from '@/core/autorizacao/directives/tem-permissao.directive';

import {
    AppSharedSelectComponent
} from './app-shared-select/app-shared-select.component';

@NgModule({
    declarations: [
        AppSharedSelectComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        TemPermissaoDirective
    ],
    exports: [
        AppSharedSelectComponent,
        TemPermissaoDirective
    ]
})
export class SharedModule {}
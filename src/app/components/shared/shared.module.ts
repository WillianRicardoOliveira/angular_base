import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

import {AppSharedSelectComponent} from './app-shared-select/app-shared-select.component';

@NgModule({
    declarations: [
        AppSharedSelectComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule
    ],
    exports: [
        AppSharedSelectComponent
    ]
})
export class SharedModule {}
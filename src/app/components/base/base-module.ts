import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppButton } from './app-button/app-button';
import { AppImage } from './app-image/app-image';
import { AppCheckbox } from './app-checkbox/app-checkbox';
import { AppSelect } from './app-select/app-select';
import { AppDropdown } from './app-dropdown/app-dropdown';

@NgModule({
  declarations: [
    AppButton,
    AppImage,
    AppCheckbox,
    AppSelect,
    AppDropdown
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AppButton,
    AppImage,
    AppCheckbox,
    AppSelect,
    AppDropdown
  ]
})
export class BaseModule { }
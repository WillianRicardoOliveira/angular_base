import { Component, Input } from '@angular/core';

type BooleanInput = boolean | string | '';

@Component({
  selector: 'app-checkbox',
  standalone: false,
  templateUrl: './app-checkbox.html',
  styleUrl: './app-checkbox.scss',
})
export class AppCheckbox {
  @Input() mode: 'bs4' | 'bs5' = 'bs5';
  @Input() disabled: BooleanInput = false;
  @Input() block: BooleanInput = false;
  @Input() switchable: BooleanInput = false;
  @Input() checked: BooleanInput = false;
  @Input() value: string = '';

  readonly inputId = `app-checkbox-${Math.random().toString(36).slice(2)}`;

  get isDisabled(): boolean {
    return this.toBoolean(this.disabled);
  }

  get isBlock(): boolean {
    return this.toBoolean(this.block);
  }

  get isSwitchable(): boolean {
    return this.toBoolean(this.switchable);
  }

  get isChecked(): boolean {
    return this.toBoolean(this.checked);
  }

  private toBoolean(value: BooleanInput): boolean {
    return value === '' || value === true || value === 'true';
  }
}
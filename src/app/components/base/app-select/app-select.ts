import { Component, Input } from '@angular/core';

type BooleanInput = boolean | string | '';
type SelectSize = 'default' | 'small' | 'large';
type SelectMode = 'bs4' | 'bs5';

export type AppSelectOption = {
  value: string;
  label: string;
};

@Component({
  selector: 'app-select',
  standalone: false,
  templateUrl: './app-select.html',
  styleUrl: './app-select.scss',
})
export class AppSelect {
  @Input() size: SelectSize = 'default';
  @Input() label: string | null = null;
  @Input() type: string | undefined;
  @Input() mode: SelectMode = 'bs5';
  @Input() disabled: BooleanInput = false;
  @Input() block: BooleanInput = false;
  @Input() options: AppSelectOption[] = [];
  @Input() value: string | undefined = undefined;

  readonly selectId = `app-select-${Math.random().toString(36).slice(2)}`;

  get isDisabled(): boolean {
    return this.toBoolean(this.disabled);
  }

  get isBlock(): boolean {
    return this.toBoolean(this.block);
  }

  get selectClasses(): Record<string, boolean> {
    return {
      'form-select': this.mode === 'bs5',
      'form-select-sm': this.mode === 'bs5' && this.size === 'small',
      'form-select-lg': this.mode === 'bs5' && this.size === 'large',
      'form-control': this.mode === 'bs4',
      'form-control-sm': this.mode === 'bs4' && this.size === 'small',
      'form-control-lg': this.mode === 'bs4' && this.size === 'large',
      'custom-select': this.type === 'custom'
    };
  }

  isSelected(optionValue: string): boolean {
    return this.value === optionValue;
  }

  private toBoolean(value: BooleanInput): boolean {
    return value === '' || value === true || value === 'true';
  }
}
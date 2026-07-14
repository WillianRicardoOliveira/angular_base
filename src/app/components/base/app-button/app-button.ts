import { Component, HostBinding, Input } from '@angular/core';

type ButtonMode = 'bs4' | 'bs5';
type ButtonSize = 'default' | 'small' | 'large';
type ButtonType = 'button' | 'submit' | 'reset';
type BooleanInput = boolean | string | '';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './app-button.html',
  styleUrl: './app-button.scss',
})
export class AppButton {
  @Input() theme: string = 'primary';
  @Input() size: ButtonSize = 'default';
  @Input() mode: ButtonMode = 'bs5';
  @Input() type: ButtonType = 'button';
  @Input() loading: BooleanInput = false;
  @Input() disabled: BooleanInput = false;
  @Input() block: BooleanInput = false;

  @HostBinding('style.width')
  get hostWidth(): string {
    return this.isBlock ? '100%' : 'inherit';
  }

  @HostBinding('style.display')
  readonly hostDisplay = 'block';

  @HostBinding('attr.disabled')
  get hostDisabled(): '' | null {
    return this.isDisabled ? '' : null;
  }

  get isLoading(): boolean {
    return this.toBoolean(this.loading);
  }

  get isDisabled(): boolean {
    return this.toBoolean(this.disabled) || this.isLoading;
  }

  get isBlock(): boolean {
    return this.toBoolean(this.block);
  }

  get buttonClasses(): Record<string, boolean> {
    return {
      btn: true,
      [`btn-${this.theme || 'primary'}`]: true,
      'btn-sm': this.size === 'small',
      'btn-lg': this.size === 'large',
      disabled: this.isDisabled
    };
  }

  private toBoolean(value: BooleanInput): boolean {
    return value === '' || value === true || value === 'true';
  }
}
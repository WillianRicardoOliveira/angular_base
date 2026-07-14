import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  ViewChild
} from '@angular/core';

type BooleanInput = boolean | string | '';

@Component({
  selector: 'app-dropdown',
  standalone: false,
  templateUrl: './app-dropdown.html',
  styleUrl: './app-dropdown.scss',
})
export class AppDropdown implements AfterViewInit {
  @Input() mode: 'bs4' | 'bs5' = 'bs5';

  private _hideArrow: BooleanInput = false;
  private _openOnButtonClick: BooleanInput = true;
  private _isOpen = false;

  @Input()
  set hideArrow(value: BooleanInput) {
    this._hideArrow = value;
  }

  get hideArrow(): BooleanInput {
    return this._hideArrow;
  }

  @Input('hide-arrow')
  set hideArrowAlias(value: BooleanInput) {
    this.hideArrow = value;
  }

  @Input()
  set openOnButtonClick(value: BooleanInput) {
    this._openOnButtonClick = value;
  }

  get openOnButtonClick(): BooleanInput {
    return this._openOnButtonClick;
  }

  @Input('open-on-button-click')
  set openOnButtonClickAlias(value: BooleanInput) {
    this.openOnButtonClick = value;
  }

  @Input()
  set isOpen(value: BooleanInput) {
    this._isOpen = this.toBoolean(value);

    if (this._isOpen) {
      this.calculateFixedStyles();
    }
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  @Input('is-open')
  set isOpenAlias(value: BooleanInput) {
    this.isOpen = value;
  }

  @ViewChild('dropdownButton') dropdownButton?: ElementRef<HTMLElement>;
  @ViewChild('dropdownMenu') dropdownMenu?: ElementRef<HTMLElement>;

  fixedStyles: Record<string, string> = {
    left: 'inherit',
    right: '0'
  };

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  @HostBinding('class.dropdown')
  readonly hostDropdownClass = true;

  @HostBinding('style.width')
  get hostWidth(): string {
    return 'var(--pf-dropdown-width, 15rem)';
  }

  @HostBinding('style.border-radius')
  get hostBorderRadius(): string {
    return 'var(--pf-dropdown-border-radius, 0.25rem)';
  }

  @HostBinding('style.border')
  get hostBorder(): string {
    return 'var(--pf-dropdown-border, 1px solid rgba(0, 0, 0, 0.15))';
  }

  @HostBinding('style.display')
  readonly hostDisplay = 'inline-block';

  get shouldHideArrow(): boolean {
    return this.toBoolean(this.hideArrow);
  }

  get shouldOpenOnButtonClick(): boolean {
    return this.toBoolean(this.openOnButtonClick);
  }

  ngAfterViewInit(): void {
    this.calculateFixedStyles();
  }

  handleButtonClick(): void {
    if (this.shouldOpenOnButtonClick) {
      this.toggleDropdown();
    }
  }

  openDropdown(): void {
    this.isOpen = true;
    this.calculateFixedStyles();
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  toggleDropdown(): void {
    if (this.isOpen) {
      this.closeDropdown();
      return;
    }

    this.openDropdown();
  }

  @HostListener('window:click', ['$event'])
  handleWindowClick(event: MouseEvent): void {
    const target = event.target as Node | null;

    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  }

  @HostListener('window:resize')
  handleWindowResize(): void {
    this.calculateFixedStyles();
  }

  private calculateFixedStyles(): void {
    setTimeout(() => {
      const button = this.dropdownButton?.nativeElement;
      const menu = this.dropdownMenu?.nativeElement;

      if (!button || !menu || typeof document === 'undefined') {
        return;
      }

      const windowWidth = document.body.offsetWidth;
      const buttonWidth = button.offsetWidth;
      const menuWidth = menu.offsetWidth;
      const buttonLeftPosition = button.getBoundingClientRect().left;
      const visiblePart = buttonLeftPosition + buttonWidth + 5;

      if (visiblePart < menuWidth) {
        if (windowWidth < menuWidth) {
          this.fixedStyles = {
            left: 'inherit',
            right: `${visiblePart + 5 - windowWidth}px`
          };
          return;
        }

        this.fixedStyles = {
          left: 'inherit',
          right: `${menuWidth - 5 - windowWidth}px`
        };
        return;
      }

      this.fixedStyles = {
        left: 'inherit',
        right: '0'
      };
    }, 0);
  }

  private toBoolean(value: BooleanInput): boolean {
    return value === '' || value === true || value === 'true';
  }
}
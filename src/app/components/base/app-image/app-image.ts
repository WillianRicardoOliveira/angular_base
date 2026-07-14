import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

type BooleanInput = boolean | string | '';

const LOADING_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" style="margin:auto;background:none;display:block;shape-rendering:auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <circle cx="50" cy="50" fill="none" stroke="#adb5bd" stroke-width="8" r="32" stroke-dasharray="150 70">
    <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
  </circle>
</svg>
`;

const NO_IMAGE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490.667 490.667">
  <path d="M245.333 0C110.059 0 0 110.059 0 245.333s110.059 245.334 245.333 245.334 245.334-110.06 245.334-245.334S380.608 0 245.333 0zm0 469.333c-123.52 0-224-100.48-224-224 0-57.92 22.293-110.613 58.496-150.421l315.925 315.925c-39.807 36.203-92.501 58.496-150.421 58.496zm165.504-73.578L94.933 79.851c39.808-36.203 92.501-58.518 150.4-58.518 123.52 0 224 100.48 224 224 0 57.92-22.293 110.614-58.496 150.422z"/>
</svg>
`;

@Component({
  selector: 'app-image',
  standalone: false,
  templateUrl: './app-image.html',
  styleUrl: './app-image.scss',
})
export class AppImage implements OnChanges {
  @Input() src: string = '';
  @Input('fallback-src') fallbackSrc: string = '';
  @Input() alt: string = '';
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() loading: BooleanInput = false;
  @Input() rounded: BooleanInput = false;

  hasSrcFailed = false;
  hasFallbackSrcFailed = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src'] || changes['fallbackSrc']) {
      this.hasSrcFailed = false;
      this.hasFallbackSrcFailed = false;
    }
  }

  get imageSrc(): string {
    if (this.toBoolean(this.loading)) {
      return this.svgToDataUri(LOADING_SVG);
    }

    if (this.src && !this.hasSrcFailed) {
      return this.normalizeUrl(this.src);
    }

    if (this.fallbackSrc && !this.hasFallbackSrcFailed) {
      return this.normalizeUrl(this.fallbackSrc);
    }

    return this.svgToDataUri(NO_IMAGE_SVG);
  }

  get isRounded(): boolean {
    return this.toBoolean(this.rounded);
  }

  get imageWidth(): string | null {
    return this.toPixelValue(this.width);
  }

  get imageHeight(): string | null {
    return this.toPixelValue(this.height);
  }

  handleImageError(): void {
    if (this.src && !this.hasSrcFailed) {
      this.hasSrcFailed = true;
      return;
    }

    if (this.fallbackSrc && !this.hasFallbackSrcFailed) {
      this.hasFallbackSrcFailed = true;
    }
  }

  private toBoolean(value: BooleanInput): boolean {
    return value === '' || value === true || value === 'true';
  }

  private toPixelValue(value?: number | string): string | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    return `${value}px`;
  }

  private normalizeUrl(value: string): string {
    if (!value || this.isAbsoluteUrl(value) || value.charAt(0) === '/') {
      return value;
    }

    return `/${value}`;
  }

  private isAbsoluteUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  private svgToDataUri(svg: string): string {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
}
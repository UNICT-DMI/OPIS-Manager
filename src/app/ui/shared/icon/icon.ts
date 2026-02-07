import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconDimension } from '@c_types/icon-dimension.type';

@Component({
  selector: 'opis-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  private readonly _sanitizer = inject(DomSanitizer);

  readonly iconName = input<string>();
  readonly dimension = input<IconDimension>('1-5rem');
  readonly svgIcon = input<string | undefined>();

  readonly safeSvgIcon = computed<SafeHtml | null>(() =>
    this.svgIcon()
      ? this._sanitizer.bypassSecurityTrustHtml(this.svgIcon()!)
      : null
  );
}

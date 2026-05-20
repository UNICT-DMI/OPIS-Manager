import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { IconRegistryService } from '@services/icon-registry/icon-registry.service';
import { IconComponent } from '@shared-ui/icon/icon';

@Component({
  selector: 'opis-footer',
  imports: [IconComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer implements OnInit {
  private readonly _iconRegistryService = inject(IconRegistryService);

  protected readonly githubIcon = signal<string>('');

  ngOnInit(): void {
    this._iconRegistryService.load('github').subscribe((icon) => {
      this.githubIcon.set(icon);
    });
  }
}

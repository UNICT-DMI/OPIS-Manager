import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { GitHubService } from '@services/github/github.service';
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
  private readonly _githubService = inject(GitHubService);
  private readonly _iconRegistryService = inject(IconRegistryService);

  protected readonly contributorsView = computed(this._githubService.contributors);
  protected githubIcon = signal<string>('');

  ngOnInit(): void {
    this._githubService
      .getRepoContributors()
      .then((res) => this._githubService.contributors.set(res));

    this._iconRegistryService.load('github').subscribe((icon) => {
      this.githubIcon.set(icon);
    });
  }
}

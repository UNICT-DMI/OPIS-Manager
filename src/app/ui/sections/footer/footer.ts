import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { GitHubService } from '@services/github/github.service';
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

  protected readonly contributorsView = computed(this._githubService.contributors);

  ngOnInit(): void {
    this._githubService.getRepoContributors().then(
      res => this._githubService.contributors.set(res)
    );
  }
}

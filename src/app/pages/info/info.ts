import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FeatureCard } from '@interfaces/github.interface';
import { GitHubService } from '@services/github/github.service';
import { IconComponent } from '@shared-ui/icon/icon';

@Component({
  selector: 'opis-info',
  imports: [IconComponent],
  templateUrl: './info.html',
  styleUrl: './info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPageComponent implements OnInit {
  private readonly _githubService = inject(GitHubService);

  protected readonly contributors = this._githubService.contributors;
  protected readonly features: FeatureCard[] = [
    {
      icon: 'group',
      title: 'Creato da studenti',
      description:
        "Realizzato da studenti del Dipartimento di Matematica e Informatica sulla base del modello elaborato dalla Commissione Paritetica del DMI.",
    },
    {
      icon: 'school',
      title: 'Per tutto l\'Ateneo',
      description:
        "Compatibile con tutti i Corsi di Laurea di ogni Dipartimento dell'Università di Catania.",
    },
    {
      icon: 'code',
      title: 'Open Source',
      description:
        'Chiunque può contribuire allo sviluppo. Rilasciato sotto licenza GPLv3.0.',
      link: 'https://github.com/UNICT-DMI/OPIS-Manager',
    },
  ];

  async ngOnInit(): Promise<void> {
    const data = await this._githubService.getRepoContributors();
    this._githubService.contributors.set(data);
  }
}
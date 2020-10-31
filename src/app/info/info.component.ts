import { Component } from '@angular/core';
import { faGithub, faTelegram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faCubes, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  public readonly faGithub = faGithub;
  public readonly faTelegram = faTelegram;
  public readonly faEnvelope = faEnvelope;
  public readonly faLinkedin = faLinkedin;
  public readonly faCubes = faCubes;
  public readonly faUsers = faUsers;
}

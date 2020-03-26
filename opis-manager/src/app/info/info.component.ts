import { Component } from '@angular/core';
import { faGithub, faTelegram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  constructor() { }

  public readonly faGithub = faGithub;
  public readonly faTelegram = faTelegram;
  public readonly faEnvelope = faEnvelope;
  public readonly faLinkedin = faLinkedin;
}

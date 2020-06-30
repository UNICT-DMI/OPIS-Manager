import { Component } from '@angular/core';
import { fadeAnimation } from './animations';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent {
  public readonly faGithub = faGithub;
}

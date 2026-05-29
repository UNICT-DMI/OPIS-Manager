import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Department } from '@interfaces/department.interface';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { IconComponent } from '@shared-ui/icon/icon';

@Component({
  selector: 'opis-dep-card',
  imports: [RouterLink, IconComponent],
  templateUrl: './dep-card.html',
  styleUrl: './dep-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepCard implements OnInit {
  private readonly _analytics = inject(AnalyticsService);

  readonly department = input.required<Department>();
  protected detailUrl: string;

  ngOnInit(): void {
    this.detailUrl = this.createDetailUrl();
  }

  private createDetailUrl(): string {
    const regexRuleFormat = /[^a-zA-Z0-9]+/g;
    const formattedName = this.department().nome.toLowerCase().replace(regexRuleFormat, '_');
    return `/${formattedName}`;
  }

  protected saveInfo(): void {
    const department = this.department();
    localStorage.setItem('department', JSON.stringify(department));
    this._analytics.trackEvent('select_department', {
      department_id: department.unict_id,
      department_name: department.nome,
    });
  }
}

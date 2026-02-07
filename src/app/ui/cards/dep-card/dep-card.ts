import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Department } from '@interfaces/department.interface';
import { IconComponent } from '@shared-ui/icon/icon';

@Component({
  selector: 'opis-dep-card',
  imports: [RouterLink, IconComponent],
  templateUrl: './dep-card.html',
  styleUrl: './dep-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepCard implements OnInit {
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
    const formatToSave = JSON.stringify(this.department());
    localStorage.setItem('department', formatToSave);
  }
}

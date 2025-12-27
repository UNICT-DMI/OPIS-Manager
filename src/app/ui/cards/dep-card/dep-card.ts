import { Component, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '@components/icon/icon';
import { Department } from '@interfaces/department.interface';

@Component({
  selector: 'opis-dep-card',
  imports: [RouterLink, Icon],
  templateUrl: './dep-card.html',
  styleUrl: './dep-card.scss',
})
export class DepCard implements OnInit {
  public department = input.required<Department>();
  public detailUrl: string;

  ngOnInit(): void {
    this.detailUrl = this.createDetailUrl();
  }

  private createDetailUrl() {
    const regexRuleFormat = /[^a-zA-Z0-9]+/g;
    const formattedName = this.department().nome.toLowerCase().replace(regexRuleFormat, '_');
    return `/${formattedName}`;
  }

  public saveInfo() {
    const formatToSave = JSON.stringify(this.department());
    localStorage.setItem('department', formatToSave);
  }
}

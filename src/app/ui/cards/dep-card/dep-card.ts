import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Department } from '@interfaces/department.interface';

@Component({
  selector: 'opis-dep-card',
  imports: [ RouterLink ],
  templateUrl: './dep-card.html',
  styleUrl: './dep-card.scss',
})
export class DepCard {
  public department = input.required<Department>();

  

}

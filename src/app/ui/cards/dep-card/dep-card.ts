import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Department } from '@interfaces/department.interface';

@Component({
  selector: 'opis-dep-card',
  imports: [JsonPipe],
  templateUrl: './dep-card.html',
  styleUrl: './dep-card.scss',
})
export class DepCard {
  public department = input.required<Department>();

  

}

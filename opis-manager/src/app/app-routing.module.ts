import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormulaComponent } from './formula/formula.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'formula',
    component: FormulaComponent
  },
  {
    path: 'info',
    component: InfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';
import { DepartmentPageComponent } from './pages/department/department';
import { InfoPageComponent } from './pages/info/info';
import { HomePageComponent } from './pages/home/home';
import { FormulaComponent } from './pages/formula/formula';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'formula', component: FormulaComponent },
  { path: 'info', component: InfoPageComponent },
  // { path: 'login', }
  // { path: 'signup', },
  { path: 'department/:depsName', component: DepartmentPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

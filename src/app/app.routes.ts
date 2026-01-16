import { Routes } from '@angular/router';
import { DepartmentPageComponent } from './pages/department/department';
import { Info } from './pages/info/info';
import { HomePageComponent } from './pages/home/home';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: ':depsName', component: DepartmentPageComponent },
  { path: 'info', component: Info },
  { path: '**', redirectTo: '/home' },
  // { path: 'formula', },
  // { path: 'signup', },
  // { path: 'login', }
];

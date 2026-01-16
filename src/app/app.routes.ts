import { Routes } from '@angular/router';
import { DepartmentPage } from './pages/department/department';
import { Info } from './pages/info/info';
import { HomepageComponent } from './pages/home/home';

export const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: ':depsName', component: DepartmentPage },
  { path: 'info', component: Info },
  { path: '**', redirectTo: '/home' },
  // { path: 'formula', },
  // { path: 'signup', },
  // { path: 'login', }
];

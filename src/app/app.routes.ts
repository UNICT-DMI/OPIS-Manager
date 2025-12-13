import { Routes } from '@angular/router';
import { Department } from './pages/department/department';
import { Info } from './pages/info/info';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: ':idDipartimento', component: Department },
  { path: 'info', component: Info },
  { path: '**', redirectTo: '/home' },
  // { path: 'formula', },
  // { path: 'signup', },
  // { path: 'login', }
];

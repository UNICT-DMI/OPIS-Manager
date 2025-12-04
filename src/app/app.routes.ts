import { Routes } from '@angular/router';
import { Dipartimento } from './pages/dipartimento/dipartimento';
import { Info } from './pages/info/info';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: ':idDipartimento', component: Dipartimento },
  { path: 'info', component: Info },
  { path: "**", redirectTo:'/home' }
  // { path: 'formula', },
  // { path: 'signup', },
  // { path: 'login', }
];

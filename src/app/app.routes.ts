import { Routes } from '@angular/router';
import { Dipartimento } from './pages/dipartimento/dipartimento';
import { Info } from './pages/info/info';

export const routes: Routes = [
  { path: ':idDipartimento', component: Dipartimento },
  { path: 'info', component: Info },
  // { path: 'formula', },
  // { path: 'signup', },
  // { path: 'login', }
];

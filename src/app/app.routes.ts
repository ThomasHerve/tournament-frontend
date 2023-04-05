import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'Home',
    pathMatch: 'full',
  },
  {
    path: 'Home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'Editor',
    loadComponent: () => import('./editorHome/editorhome.page').then(m => m.EditorHomePage)
  },
  {
    path: 'Editor/:id',
    loadComponent: () => import('./editor/editor.page').then(m => m.EditorPage)
  },


];
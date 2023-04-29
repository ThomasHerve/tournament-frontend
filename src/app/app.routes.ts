import { GameGuard } from './game/game.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'editor',
    loadComponent: () => import('./editorHome/editorhome.page').then(m => m.EditorHomePage)
  },
  {
    path: 'editor/:id',
    loadComponent: () => import('./editor/editor.page').then(m => m.EditorPage)
  },
  {
    path: 'lobby',
    loadComponent: () => import('./lobby/lobby.page').then(m => m.LobbyPage)
  },
  {
    path: 'lobby/:id',
    loadComponent: () => import('./lobby/lobby.page').then(m => m.LobbyPage)
  }
  ,
  {
    path: 'game/:id',
    loadComponent: () => import('./game/game.page').then(m => m.GamePage),
    canActivate: [GameGuard]
  }


];

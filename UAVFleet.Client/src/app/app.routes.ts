// src/app/app.routes.ts

import { Route } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// Вече няма нужда да импортваш LoginComponent/HomeComponent тук,
// ако ги зареждаш с `loadComponent`. Но можеш и директно.

export const appRoutes: Route[] = [
  // публичен Login маршрут
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },

  // защитена част
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      // Home
      {
        path: 'home',
        loadComponent: () =>
          import('./components/home/home.component').then(m => m.HomeComponent)
      },

      // Drones
      {
        path: 'drones',
        loadComponent: () =>
          import('./components/drone-list/drone-list.component').then(m => m.DroneListComponent)
      },
      {
        path: 'drones/new',
        loadComponent: () =>
          import('./components/drone-form/drone-form.component').then(m => m.DroneFormComponent)
      },
      {
        path: 'drones/:id',
        loadComponent: () =>
          import('./components/drone-form/drone-form.component').then(m => m.DroneFormComponent)
      },

      // Operators
      {
        path: 'operators',
        loadComponent: () =>
          import('./components/operator-list/operator-list.component').then(m => m.OperatorListComponent)
      },
      {
        path: 'operators/new',
        loadComponent: () =>
          import('./components/operator-form/operator-form.component').then(m => m.OperatorFormComponent)
      },
      {
        path: 'operators/:id',
        loadComponent: () =>
          import('./components/operator-form/operator-form.component').then(m => m.OperatorFormComponent)
      },

      // Missions
      {
        path: 'missions',
        loadComponent: () =>
          import('./components/missions-list/missions-list.component').then(m => m.MissionListComponent)
      },
      {
        path: 'missions/new',
        loadComponent: () =>
          import('./components/missions-form/missions-form.component').then(m => m.MissionFormComponent)
      },
      {
        path: 'missions/:id',
        loadComponent: () =>
          import('./components/missions-form/missions-form.component').then(m => m.MissionFormComponent)
      },

      // по подразбиране -> home
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' }
    ]
  },

  // всичко друго -> login
  { path: '**', redirectTo: 'login' }
];

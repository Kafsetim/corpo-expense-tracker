import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'];

  const user = authService.currentUser();
  console.log('AuthGuard check:', { user, requiredRole });

  // 1. No user logged in
  if (!user) {
    console.log('Redirecting to login');
    return router.parseUrl('/login');
  }

  // 2. Check role if route requires it
  if (requiredRole && user.role !== requiredRole) {
    console.log('Access denied - wrong role');
    return router.parseUrl('/login');
  }

  return true;
};

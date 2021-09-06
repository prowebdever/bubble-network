import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, map } from 'rxjs/operators';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate() {
    const loggedIn = localStorage.getItem('bubble_user');
    if (loggedIn !== null) {
      return true;
    } else {
      this.router.navigate(['welcome']);
      return false;
    }
  }

}

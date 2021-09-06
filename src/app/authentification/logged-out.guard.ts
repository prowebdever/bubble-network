import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable()
export class LoggedOutGuard implements CanActivate {
  constructor(private nav: NavController) {}

  canActivate() {

      return true;
  }
}

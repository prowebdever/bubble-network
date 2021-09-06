import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  LoadingController
} from '@ionic/angular';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  loading;

  constructor(
    private nav: NavController,
    private authService: AuthService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ]
    });
  }

  ngOnInit() {}

  async login() {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      const loadingElement = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'crescent'
      });
      await loadingElement.present();

      this.authService
        .signin(this.loginForm.value.email, this.loginForm.value.password,
          authData => {
            this.nav.navigateForward(['main'], true);
            loadingElement.dismiss();
            this.loginForm.reset();
          },
          async err => {
            loadingElement.dismiss();
            const alert = await this.alertController.create({
              message: err,
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    alert.dismiss();
                  }
                }
              ]
            });
            await alert.present();
          }
        );
    }
  }

  public navigate(link: string) {
    this.nav.navigateForward(['welcome/' + link], true);
  }
}

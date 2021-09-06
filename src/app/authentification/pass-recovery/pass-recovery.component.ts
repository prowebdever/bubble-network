import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-pass-recovery',
  templateUrl: './pass-recovery.component.html',
  styleUrls: ['./pass-recovery.component.scss']
})
export class PassRecoveryComponent implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  ngOnInit() {}

  navigate(link: string) {
    this.resetPasswordForm.reset();
    this.navCtrl.navigateForward(['welcome/' + link], true);
  }

  async recovery() {
    if (!this.resetPasswordForm.valid) {
      console.log(this.resetPasswordForm.value);
    } else {
      const loadingElement = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'crescent'
      });
      await loadingElement.present();

      this.authService
        .resetPassword(
          this.resetPasswordForm.value.email,
          async authData => {
            loadingElement.dismiss();
            const alert = await this.alertController.create({
              message: 'We just sent you a reset link to your email',
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    alert.dismiss();
                    this.navCtrl.navigateForward(['welcome'], true);
                    this.resetPasswordForm.reset();
                  }
                }
              ]
            });
            await alert.present();
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
}

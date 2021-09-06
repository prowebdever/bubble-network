import { Component, Output } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { AuthService } from '../../authentification/auth.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onFooterNavigate = new Subject();

  constructor(
    private nav: NavController,
    private authservice: AuthService,
    public alertController: AlertController ) {}


  signOut() {
    this.authservice.signout(
      () => {
        this.nav.navigateRoot('/welcome');
      },
      async error => {
        const alert = await this.alertController.create({
          message: error,
          buttons: [
            {
              text: 'OK',
              role: 'cancel'
            }
          ]
        });
        await alert.present();
      }
    );
  }

  async confirmSignout() {
    const alert_pre = await this.alertController.create({
      header: 'Alert',
      message: 'Do you want to sign out really?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: () => {
            this.signOut();
          }
        }
      ]
    });
    await alert_pre.present();
  }

  public navigate(link: string) {

    this.nav.navigateForward([link], true);
    this.onFooterNavigate.next(link);
  }
}

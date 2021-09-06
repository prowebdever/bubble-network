import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../../authentification/auth.service';
import { BubblesService } from '../../services/bubbles.service';
import { ActivatedRoute } from "@angular/router";
import { UserProfile } from '../../models/user-profile.interface';
import {EmailComposer} from "@ionic-native/email-composer/ngx";

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage {
  public currentUser:UserProfile;
    subject:string = '';
    content:string = '';
  constructor(
    public toastController: ToastController,
    private nav: NavController,
    private authService: AuthService,
    private bubblesService: BubblesService,
    public route: ActivatedRoute,
    public alertController: AlertController,
    private emailComposer: EmailComposer
  ) {
    this.authService.getCurrentUser(data=>{
        this.currentUser = data;
    }, null);
  }

  public sendEmail() {
    if(!this.subject) {
        this.showToast('Please enter a subject');
        return;
    }
    if(!this.content) {
        this.showToast('Please enter a content');
        return;
    }
    this.presentAlertConfirm('Are you sure to want to send report?', data => {

        let email = {
          to: 'owner@bubbleflix.com',
          cc: '',
          bcc: [],
          attachments: [],
          subject: this.subject,
          body: this.content,
          isHtml: true
        }

        // Send a text message using default options
        this.emailComposer.open(email);
        this.showToast('Sent successfully');
    });
  }

  async presentAlertConfirm(msg, fnOk) {
      const alert = await this.alertController.create({
        header: 'Confirm!',
        message: msg,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {

            }
          }, {
            text: 'Okay',
            handler: () => {
              fnOk();
            }
          }
        ]
      });
      await alert.present();
  }

  async showToast(msg) {
    const toast_msg = await this.toastController.create({
      message: msg,
      showCloseButton: false,
      duration: 2000,
      position: 'bottom'
    });
    await toast_msg.present();
  }

}

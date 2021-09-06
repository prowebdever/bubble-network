import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { AdData } from '../../models/ad-data.interface';
import { BubbleData } from '../../models/bubble-data.interface';
import { BubblesService } from '../../services/bubbles.service';
import { AuthService } from '../../authentification/auth.service';
import { AdService } from '../../services/ad.service';
import { UserProfile } from '../../models/user-profile.interface';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-change-bubbles',
  templateUrl: './change-bubbles.page.html',
  styleUrls: ['./change-bubbles.page.scss']
})
export class ChangeBubblesPage implements OnInit {
  pop: PopoverController;
  bubbles: AdData[] = [];
  user: UserProfile;

  constructor(
    public navController: NavController,
    public actionSheetController: ActionSheetController,
    public bubblesService: BubblesService,
    public authService: AuthService,
    public adService: AdService,
    public alertController: AlertController,
    public toastController: ToastController
  ) {
    this.authService.getCurrentUser(
        data => {
          this.user = data;
          this.bubblesService.getBubblesByUser(this.user.uid)
             .subscribe(data1 => {
                this.bubbles = [];
                Utils.addAds(data1, this.bubbles, this.bubblesService, () => {
                });
             }
          );
        },
        async (error) => {
          this.showToast('Cannot retrieve your profile information.');
        }
    );
  }

  ngOnInit() {}

  async presentActionSheet(uid) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Edit Bubble',
          icon: 'brush',
          handler: () => {
            this.navController.navigateForward('edit-bubble/' + uid, true);
          }
        },
        {
          text: 'Remove Bubble',
          role: 'destructive',
          icon: 'remove-circle',
          handler: () => {
            this.presentAlertConfirm(() => {
                let index = this.bubbles.findIndex(item => item.uid == uid);
                let ad = this.bubbles[index];
                let data = null;
                if(ad.videoUrl && ad.video_filename) {
                    data = {path: 'videos', filename: ad.video_filename};
                } else if(ad.imageURL && ad.image_filename) {
                    data = {path: 'postImages', filename: ad.image_filename};
                }
                this.adService.deleteAd(uid, data, (err)=>{
                    if(err) {
                        this.showToast('Something went wrong. Try again');
                    } else {
                        this.bubbles = [];
                        this.showToast('Deleted successfully');
                    }
                });
            });
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentAlertConfirm(fnOk) {
     const alert = await this.alertController.create({
        header: 'Confirm!',
        message: 'Are you sure to want to delete bubble?',
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
      message: msg ,
      showCloseButton: false,
      duration: 2500,
      position: 'bottom'
    });
    toast_msg.present();
  }

  getFormattedDate(timestamp) {
    return Utils.getFormatDateTime(timestamp);
  }
}

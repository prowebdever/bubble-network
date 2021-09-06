import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {NavController, NavParams, ToastController,AlertController } from '@ionic/angular';
import { AuthService } from '../../authentification/auth.service';
import { UserProfile } from '../../models/user-profile.interface';
import { Utils } from '../../utils/utils';
import { ActivatedRoute } from "@angular/router";
import { BubbleData } from '../../models/bubble-data.interface';
import { BubblesService } from '../../services/bubbles.service';
import { BubblesContainerComponent } from '../../common/bubbles-container/bubbles-container.component';

@Component({
  selector: 'app-user-bubbles',
  templateUrl: './user-bubbles.page.html',
  styleUrls: ['./user-bubbles.page.scss']
})
export class UserBubblesPage implements OnInit {
    @ViewChild(BubblesContainerComponent) child:BubblesContainerComponent;
    public bubbles:BubbleData[] = [];
      private uid = '';
      public userData: UserProfile;
      private currentUser: UserProfile;
    constructor(
      private nav: NavController,
      public toastController: ToastController,
      public alertController: AlertController,
      private authService: AuthService,
      public route: ActivatedRoute,
      private bubblesService: BubblesService
    ) {
      //this.userData = navParams.get('userData');
      this.uid = this.route.snapshot.params.id;
      this.authService.getUser(this.uid)
        .subscribe(data => {
            const _doc:any = data.payload;
            this.userData = Utils.getUserProfile(_doc.data(), _doc.id);
        });
      this.authService.getCurrentUser(data=>this.currentUser = data, null);
    }

    ionViewWillEnter(){
        this.initBubbles();
    }
    initBubbles() {
        this.bubbles = [];
        this.bubblesService.getBubblesByUser(this.uid)
        .subscribe(
         data => {
             Utils.addBubbles(data, this.bubbles, this.authService, () => {
                 this.child.initAnimation();
             });
           }
        );
    }

    ngOnInit() {
    }

    public getUserLink(link: string) {
        if(link.indexOf('http')!=0) {
            link = 'http://' + link;
        }
        return link;
    }
    public navigate(link: string) {
        this.nav.navigateForward([link], true);
      }

    public unfollowing() {
        this.presentActionSheet(this.userData.uid);
    }

    public following() {
        this.authService.following(this.userData.uid);
    }

    public checkIsFollowing() {
        return Utils.checkIsFollowing(this.currentUser, this.uid);
    }

    async presentActionSheet(following_uid) {
        const alert = await this.alertController.create({
          message: 'Would you like to not follow this user?',
          buttons: [
            {
              text: 'Cancel',
              handler: () => {
                alert.dismiss();
              }
            },
            {
              text: 'Yes',
              handler: () => {
                alert.dismiss();
                this.authService.unfollowing(following_uid);
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

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {NavController, NavParams, ToastController } from '@ionic/angular';
import { AuthService } from '../../authentification/auth.service';
import { UserProfile } from '../../models/user-profile.interface';
import { Utils } from '../../utils/utils';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements OnInit {
      public uid = '';
      public userData: UserProfile;
      private currentUser: UserProfile;
    constructor(
      private nav: NavController,
      public toastController: ToastController,
      private authService: AuthService,
      public route: ActivatedRoute
    ) {
      //this.userData = navParams.get('userData');
      this.uid = this.route.snapshot.params.id;
      this.authService.getUser(this.uid)
        .subscribe(data => {
            const _doc = data.payload;
            this.userData = Utils.getUserProfile(_doc.data(), _doc.id);
        });
      this.authService.getCurrentUser(data=>this.currentUser = data, null);
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

    public following() {
      if(this.currentUser) {
          let followings = this.currentUser.following;
          let index = followings.findIndex(item => item == this.userData.uid);
          if(index == -1) {
              this.authService.following(this.userData.uid);
              this.showToast('Added as following user successfully');
          } else {
              this.showToast('Already added as following user');
          }
      }
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

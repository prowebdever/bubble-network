import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {NavController, NavParams, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../../authentification/auth.service';
import { UserProfile } from '../../models/user-profile.interface';
import { ActivatedRoute } from "@angular/router";
import { BubbleData } from '../../models/bubble-data.interface';
import { BubblesService } from '../../services/bubbles.service';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-user-following',
  templateUrl: './user-following.page.html',
  styleUrls: ['./user-following.page.scss']
})
export class UserFollowingPage implements OnInit {
    public friends = [];
      public uid = '';
      public userData: UserProfile;
      private currentUser: UserProfile;
      public followings = [];
      public followers = [];
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
            if(!this.userData.followers) {
                this.userData.followers = [];
            }
            if(!this.userData.following) {
                this.userData.following = [];
            }
            this.getFriends();
        });
      this.authService.getCurrentUser(data=>this.currentUser = data, null);
    }

    ionViewWillEnter(){
        //this.getFriends();
    }

    ngOnInit() {
    }

    public getFriends() {
        this.friends = [];
        this.followings = [];
        this.followers = [];
        if(this.userData) {
            this.authService.getUsersFromIDs(this.userData.following,
               user => {
                  let _new_user = Utils.getBubbleUserData(user);
                  if(_new_user) {
                    this.friends.push(_new_user);
                    this.followings.push(_new_user);
                  }
            });
            this.authService.getUsersFromIDs(this.userData.followers,
               user => {
                  let _new_user = Utils.getBubbleUserData(user);
                  if(_new_user) this.followers.push(_new_user);
            });
        }
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
          }
      }
    }

    public nofollowing() {
      if(this.currentUser) {
          let followings = this.currentUser.following;
          let index = followings.findIndex(item => item == this.userData.uid);
          if(index > -1) {
              this.presentActionSheet(this.userData.uid);
          }
      }
    }

    public checkIsFollowing() {
        if(this.currentUser) {
          let followings = this.currentUser.following;
          let index = followings.findIndex(item => item == this.userData.uid);
          return index;
        }
        return false;
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

    showFollowers() {
        this.friends = [];
        this.friends = this.followers;
    }

    showFollowings() {
        this.friends = [];
        this.friends = this.followings;
    }

}

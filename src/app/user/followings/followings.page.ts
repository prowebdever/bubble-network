import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member-data-interface';
import { AuthService } from '../../authentification/auth.service';
import { UserProfile } from '../../models/user-profile.interface';
import { ActionSheetController, NavController, AlertController } from '@ionic/angular';
import { Utils } from '../../utils/utils';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-followings',
  templateUrl: './followings.page.html',
  styleUrls: ['./followings.page.scss'],
})
export class FollowingsPage implements OnInit {
  followings: any = [];
  userData: UserProfile;
  currentUser: UserProfile;
  uid = '';

  constructor(
    private authService: AuthService,
    public actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private nav: NavController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
      this.uid = this.route.snapshot.params.id;
      this.authService.getUser(this.uid)
        .subscribe(data => {
            const _doc:any = data.payload;
            this.userData = Utils.getUserProfile(_doc.data(), _doc.id);
            this.authService.getUsersFromIDs(this.userData.following,
                following => {
                  for (let i = 0; i < this.followings.length; i++) {
                    if (this.followings[i].uid === following.uid) {
                      this.followings[i].uid = following.uid;
                      return;
                    }
                  }
                  if(!following.profileImage) following.profileImage = 'assets/empty-picture.png';
                  this.followings.push(following);
                },
            );
      });
      this.authService.getCurrentUser( user_data => this.currentUser = user_data, null);
  }

  public checkIsSelf() {
     return this.currentUser && this.uid == this.currentUser.uid;
  }

  public checkIsFollowing(user_id) {
     if(this.checkIsSelf()) {
       return Utils.checkIsFollowing(this.currentUser, user_id);
     }
     return false;
  }

  async unfollowing(user_id) {
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
            this.authService.unfollowing(user_id);
          }
        }
      ]
    });
    await alert.present();
  }
}

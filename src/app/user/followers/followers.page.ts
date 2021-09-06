import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member-data-interface';
import { AuthService } from '../../authentification/auth.service';
import { UserProfile } from '../../models/user-profile.interface';
import { ActionSheetController, NavController, AlertController } from '@ionic/angular';
import { Utils } from '../../utils/utils';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-followers',
  templateUrl: './followers.page.html',
  styleUrls: ['./followers.page.scss'],
})
export class FollowersPage implements OnInit {
  followers: any = [];
  currentUser: UserProfile;
    userData: UserProfile;
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
            this.authService.getUsersFromIDs(this.userData.followers,
                follower => {
                  for (let i = 0; i < this.followers.length; i++) {
                    if (this.followers[i].uid === follower.uid) {
                      this.followers[i].uid = follower.uid;
                      return;
                    }
                  }
                  if(!follower.profileImage) follower.profileImage = 'assets/empty-picture.png';
                  this.followers.push(follower);
                },
            );
      });
      this.authService.getCurrentUser( user_data => this.currentUser = user_data, null);
  }

  public checkIsSelf() {
    return this.currentUser && this.uid == this.currentUser.uid;
  }

  public checkIsFollowing(user_id) {
     return Utils.checkIsFollowing(this.currentUser, user_id);
  }

    async following(user_id) {
        const alert = await this.alertController.create({
          message: 'Are you sure to follow him/her?',
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
                this.authService.following(user_id);
              }
            }
          ]
        });
        await alert.present();
    }

}

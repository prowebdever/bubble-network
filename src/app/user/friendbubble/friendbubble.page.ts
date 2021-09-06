import { Component, OnInit, ViewChild } from '@angular/core';
import { BubbleData } from '../../models/bubble-data.interface';
import { BubblesService } from '../../services/bubbles.service';
import { AuthService } from '../../authentification/auth.service';
import { UserProfile } from '../../models/user-profile.interface';
import { Utils } from '../../utils/utils';
import { ToastController } from '@ionic/angular';
import { BubblesContainerComponent } from '../../common/bubbles-container/bubbles-container.component';

@Component({
  selector: 'app-friendbubble',
  templateUrl: './friendbubble.page.html',
  styleUrls: ['./friendbubble.page.scss'],
})
export class FriendbubblePage implements OnInit {
    @ViewChild(BubblesContainerComponent) child:BubblesContainerComponent;
  bubblesStopped = false;
  public user: UserProfile = new UserProfile;
  public bubbles:BubbleData[] = [];

  constructor(public toastCtrl: ToastController,
              private bubblesService: BubblesService,
              private authService: AuthService)
  {
    this.authService.getCurrentUser(
      data => {
        this.user = data;
        this.initBubbles();
      },
      async (error) => {
        const toast_msg = await this.toastCtrl.create({
          message: 'Cannot retrieve your profile information.',
          showCloseButton: false,
          duration: 2000,
          position: 'bottom'
        });
        toast_msg.present();
      }
    );
  }

  ngOnInit() {}

  ionViewWillEnter(){
        if(this.user.uid) {
          this.initBubbles();
        }
    }

  initBubbles() {
      this.bubbles = [];
      this.authService.getUsersFromIDs(this.user.following,
          user => {
            let new_ad = Utils.getBubbleUserData(user, 'friend');
            if(new_ad) this.bubbles.push(new_ad);
            if(this.bubbles.length == this.user.following.length) {
                this.child.initAnimation();
            }
      });
    }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { BubbleData } from '../../models/bubble-data.interface';
import { BubblesService } from '../../services/bubbles.service';
import { AuthService } from '../../authentification/auth.service';
import { UserProfile } from '../../models/user-profile.interface';
import { Utils } from '../../utils/utils';
import { ToastController } from '@ionic/angular';
import { BubblesContainerComponent } from '../../common/bubbles-container/bubbles-container.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
    @ViewChild(BubblesContainerComponent) child:BubblesContainerComponent;
    bubblesStopped = false;
    public user: UserProfile = new UserProfile;
    public bubbles:BubbleData[] = [];
    constructor(
        public toastCtrl: ToastController,
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
            await toast_msg.present();
          }
        );
    }

  ngOnInit(): void {
  }

  ionViewWillEnter(){
      if(this.user.uid) {
        this.initBubbles();
      }
  }

  initBubbles() {
    this.bubblesService.getBubblesByUser(this.user.uid)
       .subscribe(data => {
          this.bubbles = [];
          Utils.addBubbles(data, this.bubbles, this.bubblesService, () => {
             this.child.initAnimation();
          });
       }
    );
  }
}

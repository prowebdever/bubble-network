import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../authentification/auth.service';
import { CommonService } from '../../common/common.service';
import { UserProfile } from '../../models/user-profile.interface';
import { Utils } from '../../utils/utils';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { BubbleData } from '../../models/bubble-data.interface';
import { BubblesService } from '../../services/bubbles.service';
import { BubblesContainerComponent } from '../../common/bubbles-container/bubbles-container.component';
import { MainHeaderComponent } from '../../common/main-header/main-header.component';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.page.html',
  styleUrls: ['./main-container.page.scss']
})
export class MainContainerPage implements OnInit  {
    @ViewChild(MainHeaderComponent) header:MainHeaderComponent;
    @ViewChild(BubblesContainerComponent) child:BubblesContainerComponent;
  public user: UserProfile = new UserProfile;
    public bubbles:BubbleData[] = [];
  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    public toastCtrl: ToastController,
    private nav: NavController,
    private bubblesService: BubblesService
   ) {
  }

  ngOnInit(): void {
    this.bubbles = [];
  }

  ionViewWillEnter(){
    this.initBubbles();
  }

  initBubbles() {
    this.bubbles = [];
    this.bubblesService.getBubbles()
    .subscribe(data => {
        Utils.addBubbles(data, this.bubbles, this.authService, () => {
            this.child.initAnimation();
        });
      }
    );
  }

  public navigate(link: string) {
    console.log(link);

    this.nav.navigateForward([link], true);
  }

}

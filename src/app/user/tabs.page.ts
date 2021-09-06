import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../authentification/auth.service';
import { ToastController } from '@ionic/angular';
import { UserProfile } from '../models/user-profile.interface';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],

})
export class TabsPage implements OnInit {
  public user: UserProfile = new UserProfile;

  constructor(
    private authService: AuthService,
    public toastCtrl: ToastController,
    private elRef:ElementRef) {
  this.authService.getCurrentUser(
    data => {
      this.user = data;
      this.resetHeightTabBar();
    },
    async (error) => {
      const toast_msg = await this.toastCtrl.create({
        message: 'Cannot retrive your profile information.',
        showCloseButton: false,
        duration: 2000,
        position: 'bottom'
      });
      toast_msg.present();
    }
  );
}


  ngOnInit(): void {

  }

  resetHeightTabBar() {
    if(this.elRef) {
        let tabs = this.elRef.nativeElement.querySelector('ion-tabs');
        let tabbar = tabs.shadowRoot.querySelector('ion-tabbar');
        if(tabbar){
            tabbar.style.height = '40px';
            tabbar.style.marginBottom = '-15px';
        }else
            setTimeout(()=>{
                this.resetHeightTabBar();
            }, 100);
    } else {
        setTimeout(()=>{
            this.resetHeightTabBar();
        }, 100);
    }
  }

}

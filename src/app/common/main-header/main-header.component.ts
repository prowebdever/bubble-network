import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonService } from '../common.service';
import { AuthService } from '../../authentification/auth.service';
import { UserProfile } from '../../models/user-profile.interface';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {
    public user: UserProfile = new UserProfile;
  constructor(
    private nav: NavController,
    private commonService: CommonService,
    private authService: AuthService
    ) {
    this.authService.getCurrentUser(
      data => {
        this.user = data;
        if(!this.user.token) {
            this.commonService.getToken();
        }
      },
      error => {}
    );
  }

  ngOnInit() {

  }

  public navigate(link: string) {
    this.nav.navigateForward([link], true);
  }
}

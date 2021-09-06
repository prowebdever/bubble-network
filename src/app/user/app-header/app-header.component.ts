import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserProfile } from '../../models/user-profile.interface';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {
  @Input() userData: UserProfile = null;

  constructor(
    private nav: NavController) { }

  ngOnInit() {

  }

  public navigate(link: string) {
    this.nav.navigateForward([link], true);
  }

  public getUserLink(link: string) {
    if(link.indexOf('http')!=0) {
        link = 'http://' + link;
    }
    return link;
  }

}

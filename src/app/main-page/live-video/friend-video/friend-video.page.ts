import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../../../authentification/auth.service';
import { ToastController, ActionSheetController, NavParams, NavController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";
import { Utils } from '../../../utils/utils';
import { UserProfile } from '../../../models/user-profile.interface';
import { WebrtcService } from '../../../services/webrtc.service';

@Component({
  selector: 'app-friend-video',
  templateUrl: './friend-video.page.html',
  styleUrls: ['./friend-video.page.scss']
})
export class FriendVideoPage implements OnInit {
    private uid = '';
    public user: UserProfile = new UserProfile;
    public friend: UserProfile = new UserProfile;
    public error_msg = '';
    public myEl: HTMLMediaElement;
  constructor(
    public toastController: ToastController,
    public route: ActivatedRoute,
    private webrtcService: WebrtcService,
    private elRef: ElementRef,
    private authService: AuthService) {
        this.uid = this.route.snapshot.params.id;
        this.authService.getCurrentUser(
          data => {
            this.user = data;
            this.authService.getUser(this.uid)
              .subscribe(data => {
                  const _doc:any = data.payload;
                  this.friend = Utils.getUserProfile(_doc.data(), _doc.id);
                  this.startCall();
            });
          },
          error => {}
        );
    }

  ngOnInit() {
    this.myEl = this.elRef.nativeElement.querySelector('#my-video');
  }

  public startCall() {
    this.webrtcService.init(this.user, this.myEl, this.friend.peer_id, null);
  }

  public getError() {
    this.error_msg = this.webrtcService.getError();
    return this.error_msg != '';
  }

}

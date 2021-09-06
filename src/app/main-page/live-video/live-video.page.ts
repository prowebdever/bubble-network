import { Component, OnInit, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { Utils } from '../../utils/utils';
import { NavController, LoadingController } from '@ionic/angular';
import { CommonService } from '../../common/common.service';
import { WebrtcService } from '../../services/webrtc.service';
import { AuthService } from '../../authentification/auth.service';
import { UserProfile } from '../../models/user-profile.interface';
import { HttpClient } from "@angular/common/http";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-live-video',
  templateUrl: './live-video.page.html',
  styleUrls: ['./live-video.page.scss']
})
export class LiveVideoPage implements OnInit {
    public user: UserProfile = new UserProfile;
    public myEl: HTMLMediaElement;
    public stream_url = 'https://bubbleflix.herokuapp.com/live_stream/start_stream';
    public mainButton = 'radio-button-on';
    public is_recording = false;
    public error_msg = '';
    public loadingElement;

  constructor(
    private nav: NavController,
    private authService: AuthService,
    private commonService: CommonService,
    public webrtcService: WebrtcService,
    private http: HttpClient,
    private elRef: ElementRef,
    private loadingController: LoadingController,
    private zone: NgZone,
    private platform: Platform,
    private androidPermissions: AndroidPermissions
  ) {
    if(this.platform.is('android')) {
        this.requestPermissions();
    }
    this.authService.getCurrentUser(
      data => {
        this.user = data;
      },
      error => {}
    );
  }

  ngOnInit() {
    this.myEl = this.elRef.nativeElement.querySelector('#my-video');
  }

  ngOnDestroy() {
    this.stopRecording();
  }

  ionViewWillEnter(){
    this.webrtcService.clearError();
  }

  requestPermissions() {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      );

      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
    }

  async toggleRecording() {
    this.webrtcService.clearError();
    if(!this.is_recording) {
        this.loadingElement = await this.loadingController.create({
            message: 'Please wait...',
            spinner: 'crescent'
          });
        await this.loadingElement.present();
        this.webrtcService.init(this.user, this.myEl, '', (err) => {
            if(!err) {
                this.is_recording = true;
                this.mainButton = 'radio-button-off';
                console.log(this.mainButton);
                this.zone.run(()=>{});
                this.loadingElement.dismiss();
                this.commonService.registerLiveVideo(this.user.uid, this.user.following, error => {
                    if(!error) {
                        this.postPush(true);
                    } else {
                        this.error_msg = "Something went wrong. Try again later.";
                    }
                });
            } else {
                this.loadingElement.dismiss();
            }
        });
    } else {
        this.stopRecording();
    }
  }

  stopRecording() {
    this.is_recording = false;
    this.mainButton = 'radio-button-on';
    this.webrtcService.close(() => {
        this.commonService.deleteLiveVideo(this.user.uid, error => {
            if(!error) {
                this.postPush(false);
            }else {
                this.error_msg = "Something went wrong. Try again later.";
            }
        });
    });
  }

  postPush(is_start) {
      this.http.post(this.stream_url,
      {
          uid: this.user.uid,
          is_start: is_start
      });
  }

  public navigate(link: string) {
    this.nav.navigateForward([link], true);
  }

  public getError() {
    this.error_msg = this.webrtcService.getError();
    return this.error_msg != '';
  }
}

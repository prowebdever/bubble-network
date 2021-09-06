import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../authentification/auth.service';
import { CommonService } from '../../../common/common.service';
import { ToastController, NavController } from '@ionic/angular';
import { VideoDetail, VideoData } from '../../../models/video-data.interface';
//import { VideoService } from '../../../services/video.service';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { UserProfile } from '../../../models/user-profile.interface';
import { Utils } from '../../../utils/utils';
import { Broadcaster } from '@ionic-native/broadcaster/ngx';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.page.html',
  styleUrls: ['./video-list.page.scss']
})
export class VideoListPage implements OnInit {
    private user: UserProfile;
    public videos = [];
    private options: StreamingVideoOptions;

  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    public toastController: ToastController,
  //  private videoService: VideoService,
    private streamingMedia: StreamingMedia,
    private broadcaster: Broadcaster,
    private nav: NavController) {
        this.authService.getCurrentUser(
            data => {
                this.user = data;
                this.getLiveVideos();
            },
            async (error) => {
                this.presentToast('Cannot retrieve your profile information.');
            }
        );
        this.broadcaster.addEventListener(CommonService.BROADCAST_EVENT.LIVE_STREAM).subscribe((event) => {
            this.getLiveVideos();
        });
  }

  getLiveVideos() {
    this.commonService.getLiveVideos(this.user.uid).then(querySnapshot => {
        this.videos = [];
        querySnapshot.forEach(doc => {
            let data = doc.data();
            this.authService.getUser(data.userId).subscribe(_data => {
                const _doc:any = _data.payload;
                let userData = Utils.getUserProfile(_doc.data(), _doc.id);
                this.videos.push({
                    uid: _doc.id,
                    userData: userData
                })
            });
        });
    });
  }

  playVideo(uid) {
    this.navigate('friend-video/' + uid);
    //this.streamingMedia.playVideo(source, this.options);
  }

  ngOnInit(): void {
    this.videos = [];
  }

  public navigate(link: string) {
    this.nav.navigateForward([link], true);
  }

  async showError(e) {
    let msg = 'Cannot play this video.\n' + e;
    this.presentToast(msg);
  }

  async presentToast(text) {
     const toast = await this.toastController.create({
         message: text,
         position: 'bottom',
         duration: 3000
     });
     await toast.present();
  }

}

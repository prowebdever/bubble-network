import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../common.service';
import { Broadcaster } from '@ionic-native/broadcaster/ngx';
import { UserProfile } from '../../models/user-profile.interface';

@Component({
  selector: 'live-video-badge',
  templateUrl: './live-video-badge.component.html',
  styleUrls: ['./live-video-badge.component.scss'],
})
export class LiveVideoBadgeComponent implements OnInit {
    @Input() uid;
    public live_videos = 0;

  constructor(
    private broadcaster: Broadcaster,
    private commonService: CommonService
    ) {
    this.broadcaster.addEventListener(CommonService.BROADCAST_EVENT.LIVE_STREAM).subscribe((event) => {
        this.getLiveVideos();
    });
  }

  ngOnInit() {
    this.getLiveVideos();
  }

  getLiveVideos() {
    this.live_videos = 0;
    if(!this.uid) return;
    this.commonService.getLiveVideos(this.uid).then(querySnapshot => {
        querySnapshot.forEach(doc => {
            this.live_videos++;
        });
    });
  }
}

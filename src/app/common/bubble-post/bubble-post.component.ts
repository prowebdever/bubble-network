import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NavParams, PopoverController, ToastController,NavController } from '@ionic/angular';
import { Utils } from '../../utils/utils';
import { BubblesService } from '../../services/bubbles.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdData } from '../../models/ad-data.interface';
import { AuthService } from '../../authentification/auth.service';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import {UserProfile} from '../../models/user-profile.interface';

@Component({
  selector: 'app-bubble-post',
  templateUrl: './bubble-post.component.html',
  styleUrls: ['./bubble-post.component.scss']
})

export class BubblePostComponent implements OnInit {
  @ViewChild('commentArea') commentArea;

  sidebarOpen = false;
  fileLikedByMe = true;
  fileData: AdData;
  userData: UserProfile;
  uid = '';
  name = '';
  userId = '';
  newComment = '';
  pop: PopoverController;
  private options: StreamingVideoOptions;

  constructor(
    navParams: NavParams,
    private bubblesService: BubblesService,
    private authService: AuthService,
    private db: AngularFirestore,
    private streamingMedia: StreamingMedia,
    public toastController: ToastController,
    private nav: NavController
  ) {
    this.fileData = navParams.get('ad');
    //if(this.fileData.videoUrl) this.fileData.imageURL = 'assets/play_video.png';
    this.uid = navParams.get('uid');
    this.authService
      .getUser(this.fileData.userId)
      .subscribe(data => {
        this.userData = Utils.getUserProfile(data.payload.data(), data.payload.id);
        if(this.fileData.videoUrl && !this.fileData.imageURL) {
            if(this.userData.profileImage) {
                this.fileData.imageURL = this.userData.profileImage;
            } else {
                this.fileData.imageURL = '/assets/empty-picture.png';
            }
        }
        this.setName();
        this.checkLike();
      }
    );
/*
    this.fileData.imageURL = navParams.get('url');
    this.fileData.description = navParams.get('description');
    this.fileData.author = navParams.get('author');
    this.fileData.date = navParams.get('title');
    this.fileData.comments = navParams.get('comments');
  //  this.fileData.userRef = navParams.get('userRef');
    this.fileData.likes = numberWithSpaces(navParams.get('likes'));
  //  this.fileData.likesArray = navParams.get('likesArray');
 //   this.fileData.bubbleId = navParams.get('bubbleId');
*/
    this.pop = navParams.get('popoverController');
  }

  ngOnInit() { }

  setName() {
    if(this.userData) {
         this.name = this.userData.firstName + ' ' + this.userData.lastName;
         if(!this.name) this.name = this.userData.username;
    }
  }

  comment() {
    const docId = this.uid;
    const comment = {
      author: this.name,
      text: this.newComment,
      date: this.getDate()
    };
    this.fileData.comments.push(comment);
    const comments = this.fileData.comments;
    this.bubblesService.postComment(docId, comments);
    return (this.newComment = '');
  }

  checkLike() {
    const uid = this.authService.userData.uid;
    const likesArray = this.fileData.likes;
    return (this.fileLikedByMe = likesArray.includes(uid) ? true : false);
  }

  async like() {
    const uid: any = this.authService.userData.uid;
    const docId = this.uid;
    let likesArray = this.fileData.likes;
    let updatedArray;

    if (this.fileLikedByMe) {
      likesArray = likesArray.filter(el => el !== uid);
      updatedArray = likesArray;
      this.fileData.likes = updatedArray;
      await this.bubblesService.updateLike(docId, updatedArray);
      return (this.fileLikedByMe = !this.fileLikedByMe);
    } else {
      likesArray.push(uid);
      updatedArray = likesArray;
      await this.bubblesService.updateLike(docId, updatedArray);
      return (this.fileLikedByMe = !this.fileLikedByMe);
    }

  }

  getDate() {
    const now = new Date();
    let dd: any = now.getDate();
    let mm: any = now.getMonth() + 1;
    const yyyy = now.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    const today = dd + '/' + mm + '/' + yyyy;
    return today;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    setTimeout(() => {
      if (this.sidebarOpen) {
        this.commentArea.focus();
      }
    }, 1000);
  }

  close() {
    this.pop.dismiss();
  }

  playVideo() {
  console.log(this.fileData);
    if(this.fileData.videoUrl) {
        this.options = {
              successCallback: () => {
                console.log('Video played');
              },
              errorCallback: this.showError,
              orientation: 'portrait',
              shouldAutoClose: false,
              controls: true
          };
          this.streamingMedia.playVideo(this.fileData.videoUrl, this.options);
    }

  }
  async showError(e) {
        const toast_msg = await this.toastController.create({
          message: 'Cannot play this video.\n' + e ,
          showCloseButton: false,
          duration: 2500,
          position: 'bottom'
        });
        toast_msg.present();
    }

  async gotoProfile() {
    if(this.userId == this.fileData.userId) {
        this.pop.dismiss();
        this.nav.navigateForward('/user/(settings:settings)');
    } else {
        if(this.userData) {
            this.pop.dismiss();
            this.nav.navigateForward('/user-bubbles/' + this.userData.uid);
        }
    }
  }
}

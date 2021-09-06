import { Component, OnInit, ApplicationRef, ViewChild } from '@angular/core';
import { AuthService } from '../../authentification/auth.service';
import { ToastController, ActionSheetController, LoadingController, NavController } from '@ionic/angular';
import { UserProfile } from '../../models/user-profile.interface';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { MediaCapture,  MediaFile,  CaptureError,  CaptureVideoOptions} from '@ionic-native/media-capture/ngx';
import { UploadService } from '../../services/upload.service';
import { AdService } from '../../services/ad.service';
import { AdData } from '../../models/ad-data.interface';
import { Utils } from '../../utils/utils';
import { MainHeaderComponent } from '../../common/main-header/main-header.component';
declare var window: any;

@Component({
  selector: 'post-video',
  templateUrl: './post-video.page.html',
  styleUrls: ['./post-video.page.scss'],
})
export class PostVideoPage implements OnInit {
    @ViewChild(MainHeaderComponent) header:MainHeaderComponent;
    public user: UserProfile = new UserProfile;
    public adData: AdData = new AdData;
    private options: StreamingVideoOptions;
    public progress=0;
    public progress_percent = '0%';
    public is_uploading = false;
  constructor(
        private nav: NavController,
        private authService: AuthService,
        public toastController: ToastController,
        private adService: AdService,
        private camera: Camera,
        private actionSheetController: ActionSheetController,
        private uploadService: UploadService,
        public loadingController: LoadingController,
        private streamingMedia: StreamingMedia,
        private mediaCapture: MediaCapture,
        private applicationRef : ApplicationRef)
  {

  }

  ngOnInit() {
    
  }

  async selectVideo() {
      const actionSheet = await this.actionSheetController.create({
          header: "Select Video source",
          buttons: [{
                  text: 'Load from Library',
                  cssClass: "video_gallery_icon",
                  handler: () => {
                      this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                  }
              },
              {
                  text: 'Capture Video',
                  cssClass: "record_video_icon",
                  handler: () => {
                      this.captureVideo();
                  }
              },
              {
                  text: 'Cancel',
                  role: 'cancel'
              }
          ]
      });
      await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
       var options: CameraOptions = Utils.getCameraVideoOption(sourceType, this.camera.DestinationType.FILE_URI);

       this.camera.getPicture(options).then(videoData => {
             this.adData.videoUrl = videoData;
             this.applicationRef.tick();
       }, err=>{
            console.log(err);
       });
  }

  captureVideo() {
    let options: CaptureVideoOptions = Utils.getCaptureVideoOptions(1);
    this.mediaCapture
      .captureVideo(options)
      .then(
        (data: MediaFile[]) => {
            this.adData.videoUrl = data[0].fullPath;
            console.log(data);
        },
        (err: CaptureError) => {
            console.error(err);
        }
      );
  }

  async postVideo() {
      if(!this.header.user.uid) {
         this.presentToast('You should log in.');
         return;
      }
      if(this.adData.videoUrl != '') {
          const loadingElement = await this.loadingController.create({
            message: 'Please wait...',
            spinner: 'crescent'
          });
          await loadingElement.present();
          window.resolveLocalFileSystemURL('file://' + this.adData.videoUrl, (fileEntry) => {
             fileEntry.file( (file) => {
                const fileReader = new FileReader();
                fileReader.onloadend = (result: any) => {
                   let arrayBuffer = result.target.result;
                   let blob = new Blob([new Uint8Array(arrayBuffer)], {type: 'video/mp4'});
                   this.uploadService.uploadVideo(blob, '/videos', '', (progress) =>{
                        this.progress = progress;
                        this.progress_percent = progress + '%';
                        this.applicationRef.tick();
                        this.is_uploading = progress<100;
                   }, (filename, downloadUrl) => {
                         this.adData.videoUrl = downloadUrl;
                         this.adData.video_filename = filename;
                         this.adData.author = this.header.user.username;
                         this.adData.userId = this.header.user.uid;
                         this.adData.date = Date.now();
                         this.addNewData(loadingElement);
                   }, (error) =>{
                        loadingElement.dismiss();
                        this.presentToast(error);
                   });
                };
                fileReader.onerror = (error: any) => {
                    loadingElement.dismiss();
                    this.presentToast(error);
                };
                fileReader.readAsArrayBuffer(file);
             }, (error) => {
                 console.log('File Entry Error: ' + JSON.stringify(error));
                 loadingElement.dismiss();
                 this.presentToast(error);
             });
          }, (error) => {
             console.log('Error resolving file: ' + JSON.stringify(error));
             loadingElement.dismiss();
             this.presentToast(error);
          });
      }
  }

  addNewData(loadingElement) {
    this.adService.addNewAd(this.adData, value => {
         loadingElement.dismiss();
         this.presentToast('Posed Video Successfully');
         this.nav.navigateForward(['main'], true);
     }, err => {
         loadingElement.dismiss();
         this.presentToast(err);
     });
  }

  playVideo() {
    this.options = {
        successCallback: () => {
          console.log('Video played');
        },
        errorCallback: this.showError,
        orientation: 'portrait',
        shouldAutoClose: false,
        controls: true
    };
    this.streamingMedia.playVideo(this.adData.videoUrl, this.options);
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

  getFilename(url: string) {
    let filename = '';
    if(url) {
        let tmp = url.split('/');
        filename = tmp[tmp.length-1];
    }
    return filename;
  }

  async presentToast(text) {
      const toast = await this.toastController.create({
          message: text,
          position: 'bottom',
          duration: 3000
      });
      await toast.present();
  }

  public navigate(link: string) {
      console.log(link);

      this.nav.navigateForward([link], true);
    }

}

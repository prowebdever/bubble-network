import { Component, OnInit, ApplicationRef } from '@angular/core';
import { AuthService } from '../../authentification/auth.service';
import { ToastController, ActionSheetController, LoadingController, NavController } from '@ionic/angular';
import { UserProfile } from '../../models/user-profile.interface';
import { BubblesService } from '../../services/bubbles.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { MediaCapture,  MediaFile,  CaptureError,  CaptureVideoOptions} from '@ionic-native/media-capture/ngx';
import { UploadService } from '../../services/upload.service';
import { AdService } from '../../services/ad.service';
import { AdData } from '../../models/ad-data.interface';
import { Utils } from '../../utils/utils';
import { ActivatedRoute } from "@angular/router";
declare var window: any;

@Component({
  selector: 'edit-bubble',
  templateUrl: './edit-bubble.page.html',
  styleUrls: ['./edit-bubble.page.scss'],
})
export class EditBubblePage implements OnInit {
    public user: UserProfile = new UserProfile;
    public adData: AdData = new AdData;
    public uid = '';
    public bubbleType = '';
    private options: StreamingVideoOptions;
    public progress=0;
    public progress_percent = '0%';
    public is_uploading = false;
    public oriAdData = {
        imageURL: '',
        image_filename: '',
        videoUrl: '',
        video_filename: '',
        description: ''
    };

  constructor(
        private nav: NavController,
        private authService: AuthService,
        public toastController: ToastController,
        private bubblesService: BubblesService,
        private adService: AdService,
        private camera: Camera,
        private actionSheetController: ActionSheetController,
        private uploadService: UploadService,
        public loadingController: LoadingController,
        public route: ActivatedRoute,
        private streamingMedia: StreamingMedia,
        private mediaCapture: MediaCapture,
        private applicationRef : ApplicationRef)
  {
    this.uid = this.route.snapshot.params.id;
    this.authService.getCurrentUser(
        data => {
            this.user = data;
        },
        async (error) => {
            this.presentToast('Cannot retrieve your profile information.');
        }
    );
    this.adService.getAd(this.uid)
        .subscribe(data => {
            const _doc:any = data.payload;
            this.adData = {...(new AdData), ..._doc.data()};
            this.adData.uid = this.uid;
            if(this.adData.videoUrl) {
                this.bubbleType = 'Video';
            } else {
                this.bubbleType = 'Photo';
            }
            this.loadOriAdData();
        });
  }

  loadOriAdData() {
    this.oriAdData.imageURL = this.adData.imageURL;
    this.oriAdData.image_filename = this.adData.image_filename;
    this.oriAdData.videoUrl = this.adData.videoUrl;
    this.oriAdData.video_filename = this.adData.video_filename;
    this.oriAdData.description = this.adData.description;
  }

    async selectImage() {
        const actionSheet = await this.actionSheetController.create({
            header: "Select Image source",
            buttons: [{
                    text: 'Load from Library',
                    cssClass: "gallery_icon",
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    cssClass: "camera_icon",
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
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
         var options: CameraOptions = Utils.getCameraPictureOption(sourceType);

         this.camera.getPicture(options).then(imagePath => {
             let resPath = 'data:image/png;base64,' + imagePath;//this.pathForImage(imagePath);
               this.adData.imageURL = resPath;
               this.applicationRef.tick();
         });
    }

    async postImage() {
        if(this.adData.imageURL != this.oriAdData.imageURL) {
            const loadingElement = await this.loadingController.create({
              message: 'Please wait...',
              spinner: 'crescent'
            });
            await loadingElement.present();
            this.uploadService.uploadBase64(this.adData.imageURL, '/postImages', '', (filename, downloadUrl) => {
                this.adData.imageURL = downloadUrl;
                this.adData.thumbnailURL = downloadUrl;
                this.adData.image_filename = filename;
                this.updateAd(loadingElement);
            });
        } else if(this.adData.description != this.oriAdData.description) {
            const loadingElement = await this.loadingController.create({
              message: 'Please wait...',
              spinner: 'crescent'
            });
            await loadingElement.present();
            this.updateAd(loadingElement);
        }
    }

  async selectVideo() {
    const actionSheet = await this.actionSheetController.create({
        header: "Select Video source",
        buttons: [{
                text: 'Load from Library',
                cssClass: "video_gallery_icon",
                handler: () => {
                    this.takeVideo(this.camera.PictureSourceType.PHOTOLIBRARY);
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

    takeVideo(sourceType: PictureSourceType) {
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
        if(this.adData.videoUrl != this.oriAdData.videoUrl) {
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
                           this.updateAd(loadingElement);
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
        } else if(this.adData.description != this.oriAdData.description) {
             const loadingElement = await this.loadingController.create({
               message: 'Please wait...',
               spinner: 'crescent'
             });
             await loadingElement.present();
             this.updateAd(loadingElement);
         }
  }

  updateAd(loadingElement) {
    if(this.adData.image_filename != this.oriAdData.image_filename) {
        this.adService.deleteFile('/postImages', this.oriAdData.image_filename);
    }
    if(this.adData.video_filename != this.oriAdData.video_filename) {
        this.adService.deleteFile('/videos', this.oriAdData.video_filename);
    }
      this.adService.updateAd(this.adData, value => {
          loadingElement.dismiss();
          this.presentToast('Changed bubble Successfully');
          this.loadOriAdData();
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

  ngOnInit() {
  }

  onSelectChange() {
    this.adData.imageURL = this.oriAdData.imageURL;
    this.adData.image_filename = this.oriAdData.image_filename;
    this.adData.videoUrl = this.oriAdData.videoUrl;
    this.adData.video_filename = this.oriAdData.video_filename;
  }

  public navigate(link: string) {
      this.nav.navigateForward([link], true);
  }

}

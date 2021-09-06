import { Component, OnInit, ApplicationRef } from '@angular/core';
import { ToastController, PopoverController, ActionSheetController, LoadingController } from '@ionic/angular';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { AuthService } from '../../authentification/auth.service';
import { BubblesService } from '../../services/bubbles.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { MediaCapture,  MediaFile,  CaptureError,  CaptureVideoOptions} from '@ionic-native/media-capture/ngx';
import { UploadService } from '../../services/upload.service';
import { UserProfile } from '../../models/user-profile.interface';
import { AdService } from '../../services/ad.service';
import { AdData } from '../../models/ad-data.interface';
import { Utils } from '../../utils/utils';
declare var window: any;

@Component({
  selector: 'app-sponsor-ad',
  templateUrl: './sponsor-ad.page.html',
  styleUrls: ['./sponsor-ad.page.scss']
})
export class SponsorAdPage implements OnInit {
  public targetedAudience = [
    { val: 'Actor', isChecked: true },
    { val: 'Author', isChecked: false },
    { val: 'Cook', isChecked: false },
    { val: 'Designer', isChecked: false },
    { val: 'Doctor', isChecked: false },
    { val: 'Engineer', isChecked: false },
    { val: 'Farmer', isChecked: false },
    { val: 'Journalist', isChecked: false },
    { val: 'Lawyer', isChecked: false },
    { val: 'Photographer', isChecked: false },
    { val: 'Police Officer', isChecked: false },
    { val: 'Programmer', isChecked: false },
    { val: 'Sailor', isChecked: false },
    { val: 'Scientist', isChecked: false },
    { val: 'Singer', isChecked: false },
    { val: 'Soldier', isChecked: false },
    { val: 'Teacher', isChecked: false },
    { val: 'Writer', isChecked: false },
    { val: 'Other', isChecked: false },
    { val: 'All', isChecked: false }
  ];
  dummyOccupations =  ['All', 'Actor', 'Author', 'Cook', 'Designer', 'Director', 'Doctor', 'Engineer', 'Farmer', 'Journalist', 'Lawyer', 'Photographer',
                        'Police Officer', 'Programmer', 'Sailor', 'Scientist', 'Singer', 'Soldier', 'Teacher', 'Writer', 'Other'];
  dummyLocations = ['All', 'Locations 1', 'Locations 2', 'Locations 3'];
  packages = [
    'A: 1$ per week',
    'B: 10$ per week',
    'C: 20$ per week',
    'D: 50$ per week'
  ];
  packagesPrices = {
    'A: 1$ per week': 1,
    'B: 10$ per week': 10,
    'C: 20$ per week': 20,
    'D: 50$ per week': 50
  };
  selectedPackage = '';
  amountOfWeeks = 0;

  files = [
    {
      url: '../../assets/profile-picture.jpg',
      description: 'Panda Photo',
      author: 'Panda',
      likes: 1234555,
      date: '2018 AUG 10',
      animationDelay: 0,
      starsAnimation: true,
      price: 'A: 1$ per week'
    },
    {
      url: '../../assets/profile-picture.jpg',
      description: 'Panda Photo',
      author: 'Panda',
      likes: 1234555,
      date: '2018 AUG 10',
      animationDelay: 0,
      redBorderAnimation: true,
      price: 'B: 10$ per week'
    },
    {
      url: '../../assets/profile-picture.jpg',
      description: 'Panda Photo',
      author: 'Panda',
      likes: 1234555,
      date: '2018 AUG 10',
      animationDelay: 0,
      raysAnimation: true,
      price: 'C: 20$ per week'
    },
    {
      url: '../../assets/profile-picture.jpg',
      description: 'Panda Photo',
      author: 'Panda',
      likes: 1234555,
      date: '2018 AUG 10',
      animationDelay: 0,
      coloredLinesAnimation: true,
      price: 'D: 50$ per week'
    }
  ];

  dualValue2 = { lower: 18, upper: 60 };

  bubbleType = '';

    public adData: AdData = new AdData;
    public user: UserProfile = new UserProfile;
    private options: StreamingVideoOptions;
    public progress=0;
    public progress_percent = '0%';
    public is_uploading = false;

  constructor(
    private authService: AuthService,
    public popoverCtrl: PopoverController,
    public toastController: ToastController,
    private bubblesService: BubblesService,
    private adService: AdService,
    private camera: Camera,
    private streamingMedia: StreamingMedia,
    private mediaCapture: MediaCapture,
    private actionSheetController: ActionSheetController,
    private uploadService: UploadService,
    public loadingController: LoadingController,
    private applicationRef : ApplicationRef)
  {
    this.authService.getCurrentUser(
        data => {
            this.user = data;
        },
        async (error) => {
          this.showToast('Cannot retrieve your profile information.');
        }
      );
  }

  ngOnInit() {}

  onRangeChange() {
    console.log(this.dualValue2);
  }

  get finalPrice() {
    return this.packagesPrices[this.selectedPackage] * this.amountOfWeeks;
  }

  async openPayment() {
    if(this.bubbleType == '') {
        this.showToast('Please select a type of bubble to post');
        return;
    }
    if(this.adData.imageURL == '' && this.adData.videoUrl == '') {
        this.showToast('Please select a photo or video to post');
        return;
    }
    this.adData.package_price = this.packagesPrices[this.selectedPackage];
    this.adData.package_duration = this.amountOfWeeks;
    this.adData.package = this.selectedPackage;
    const popover = await this.popoverCtrl.create({
      component: PaymentFormComponent,
      componentProps: { price: this.finalPrice, popoverController: this.popoverCtrl},
      translucent: true
    });
    popover.onDidDismiss().then((result) => {
        if(result.data) {
            if(this.bubbleType == 'Photo') {
                this.postPhoto();
            } else if(this.bubbleType == 'Video') {
                this.postVideo();
            }
        }
    })
    return await popover.present();
  }

  onSelectChange(){
    this.adData.imageURL = '';
    this.adData.videoUrl = '';
  }

  async selectPhoto() {
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

  async postPhoto() {
      if(this.adData.imageURL != '') {
          const loadingElement = await this.loadingController.create({
            message: 'Please wait...',
            spinner: 'crescent'
          });
          await loadingElement.present();
          this.uploadService.uploadBase64(this.adData.imageURL, '/postImages', '', (filename, downloadUrl) => {
              this.adData.imageURL = downloadUrl;
              this.adData.thumbnailURL = downloadUrl;
              this.adData.image_filename = filename;
              this.adData.author = this.user.username;
              this.adData.userId = this.user.uid;
              this.adData.date = Date.now();
              this.adService.addNewAd(this.adData, value => {
                  loadingElement.dismiss();
                  this.showToast('Posed Image Successfully');
              }, err => {
                  loadingElement.dismiss();
                  this.showToast(err);
              });
          });
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
                           this.adData.author = this.user.username;
                           this.adData.userId = this.user.uid;
                           this.adData.date = Date.now();
                           this.addNewVideoData(loadingElement);
                     }, (error) =>{
                          loadingElement.dismiss();
                          this.showToast(error);
                     });
                  };
                  fileReader.onerror = (error: any) => {
                      loadingElement.dismiss();
                      this.showToast(error);
                  };
                  fileReader.readAsArrayBuffer(file);
               }, (error) => {
                   console.log('File Entry Error: ' + JSON.stringify(error));
                   loadingElement.dismiss();
                   this.showToast(error);
               });
            }, (error) => {
               console.log('Error resolving file: ' + JSON.stringify(error));
               loadingElement.dismiss();
               this.showToast(error);
            });
        }
    }
  
    addNewVideoData(loadingElement) {
      this.adService.addNewAd(this.adData, value => {
           loadingElement.dismiss();
           this.showToast('Posed Video Successfully');
       }, err => {
           loadingElement.dismiss();
           this.showToast(err);
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

  async showToast(message) {
    const toast_msg = await this.toastController.create({
        message: message,
        showCloseButton: false,
        duration: 2000,
        position: 'bottom'
    });
    toast_msg.present();
  }

}

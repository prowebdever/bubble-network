import { Component, OnInit, ApplicationRef} from '@angular/core';
import {
  NavController,
  PopoverController,
  ToastController,
  AlertController,
  LoadingController,
  ActionSheetController,
  Platform
} from '@ionic/angular';
import { ChangeBubblesPage } from '../change-bubbles/change-bubbles.page';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { AuthService } from '../../authentification/auth.service';
import { UserProfile } from '../../models/user-profile.interface';
import { TabsPage } from '../tabs.page';
import { UploadService } from '../../services/upload.service';

 declare var window;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
    user: UserProfile = new UserProfile;
    targetImage = 'profile';
    profileImage = '';
    banner = '';
    jobList =  ['All', 'Actor', 'Author', 'Cook', 'Designer', 'Director', 'Doctor', 'Engineer', 'Farmer', 'Journalist', 'Lawyer', 'Photographer',
                            'Police Officer', 'Programmer', 'Sailor', 'Scientist', 'Singer', 'Soldier', 'Teacher', 'Writer', 'Other'];

  constructor(
    private nav: NavController,
    public popoverCtrl: PopoverController,
    private camera: Camera,
    private authservice: AuthService,
    private uploadService: UploadService,
    public toastController: ToastController,
    private alertController: AlertController,
    public loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private platform: Platform,
    private tabsPage: TabsPage,
    private applicationRef : ApplicationRef
  ) { }

  ngOnInit() {
    this.authservice.getCurrentUser(
      data => {
        this.user = data;
      },
      async (error) => {
        this.presentToast('Cannot retrieve your profile information.');
      }
    );
  }

  async confirmSignout() {
    const alert_pre = await this.alertController.create({
      header: 'Alert',
      message: 'Do you want to sign out really?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: () => {
            this.signOut();
          }
        }
      ]
    });
    await alert_pre.present();
  }

  signOut() {
    this.authservice.signout(
      () => {
        this.nav.navigateRoot('/welcome');
      },
      async error => {
        const alert = await this.alertController.create({
          message: error,
          buttons: [
            {
              text: 'OK',
              role: 'cancel'
            }
          ]
        });
        await alert.present();
      }
    );
  }

  public openChangeBubbles() {
    this.nav.navigateForward('change-bubbles', true);
  }

  async selectImage(tgImage: string) {
      this.targetImage = tgImage;
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
      var options: CameraOptions = {
          quality: 100,
          sourceType: sourceType,
          destinationType: this.camera.DestinationType.DATA_URL, //FILE_URI
          encodingType: this.camera.EncodingType.PNG,
          mediaType: this.camera.MediaType.PICTURE,
          saveToPhotoAlbum: false,
          correctOrientation: true
      };

      this.camera.getPicture(options).then(imagePath => {
          let resPath = 'data:image/png;base64,' + imagePath;//this.pathForImage(imagePath);
            if(this.targetImage == 'profile') {
                this.tabsPage.user.profileImage = resPath;
                this.profileImage = resPath;
            } else {
                this.tabsPage.user.banner = resPath;
                this.banner = resPath;
            }
            this.applicationRef.tick();
      });
  }

  pathForImage(img) {
      if (img === null) {
        return '';
      } else {
        let converted = window.Ionic.WebView.convertFileSrc(img);
        return converted;
      }
  }

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 600,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        //this.imageURI = window.Ionic.WebView.convertFileSrc(imageData);
        // this.sanitize.bypassSecurityTrustUrl(imageData);
      },
      err => {
        console.log(err);
        alert(err);
      }
    );
  }

  async uploadProfileImage(loadingElement) {
    this.uploadService.uploadBase64(this.profileImage, '/profilePics', this.user.profileImage_filename, (filename, downloadUrl) => {
        this.user.profileImage = downloadUrl;
        this.user.profileImage_filename = filename;
        this.presentToast('Uploaded your avatar');
        if(this.banner != '') {
            this.uploadBanner(loadingElement);
        } else {
            this.uploadUserData(loadingElement);
        }
    });
  }

  async uploadBanner(loadingElement) {
    this.uploadService.uploadBase64(this.banner, '/bannerPics', this.user.banner_filename, (filename, downloadUrl) => {
        this.user.banner = downloadUrl;
        this.user.banner_filename = filename;
        this.presentToast('Uploaded your banner');
        this.uploadUserData(loadingElement);
    });
  }

  async uploadUserData(loadingElement) {
    this.authservice.saveUserData(this.user,
      async userData => {
        loadingElement.dismiss();
        this.presentToast('Updated your information');
        this.profileImage = '';
        this.banner = '';
      },
      async err => {
        loadingElement.dismiss();
        this.presentToast(err);
      }
    );
  }

  async saveUserData() {
    const loadingElement = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'crescent'
    });
    await loadingElement.present();
    if(this.profileImage != '') {
        this.uploadProfileImage(loadingElement);
    } else if(this.banner != '') {
        this.uploadBanner(loadingElement);
    } else {
        this.uploadUserData(loadingElement);
    }
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

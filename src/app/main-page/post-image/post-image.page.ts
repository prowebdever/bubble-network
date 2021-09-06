import { Component, OnInit, ApplicationRef, ViewChild } from '@angular/core';
import { AuthService } from '../../authentification/auth.service';
import { ToastController, ActionSheetController, LoadingController, NavController } from '@ionic/angular';
import { UserProfile } from '../../models/user-profile.interface';
import { BubblesService } from '../../services/bubbles.service';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { UploadService } from '../../services/upload.service';
import { AdService } from '../../services/ad.service';
import { AdData } from '../../models/ad-data.interface';
import { Utils } from '../../utils/utils';
import { MainHeaderComponent } from '../../common/main-header/main-header.component';

@Component({
  selector: 'post-image',
  templateUrl: './post-image.page.html',
  styleUrls: ['./post-image.page.scss'],
})
export class PostImagePage implements OnInit {
    @ViewChild(MainHeaderComponent) header:MainHeaderComponent;
    public user: UserProfile = new UserProfile;
    public adData: AdData = new AdData;

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
        private applicationRef : ApplicationRef)
  {

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
        if(!this.header.user.uid) {
            this.presentToast('You should log in.');
            return;
        }
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
                this.adData.author = this.header.user.username;
                this.adData.userId = this.header.user.uid;
                this.adData.date = Date.now();
                this.adService.addNewAd(this.adData, value => {
                    loadingElement.dismiss();
                    this.presentToast('Posed Image Successfully');
                    this.nav.navigateForward(['main'], true);
                }, err => {
                    loadingElement.dismiss();
                    this.presentToast(err);
                });
            });
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
  ngOnInit() {
    
  }

  public navigate(link: string) {
      console.log(link);

      this.nav.navigateForward([link], true);
    }

}

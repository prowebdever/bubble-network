import { Component, OnInit, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import {
  NavController,
  LoadingController,
  ToastController,
  AlertController,
  ActionSheetController
  // normalizeURL
} from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { Utils } from '../../utils/utils';
// import { File } from '@ionic-native/file/ngx';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserProfile } from '../../models/user-profile.interface';
import { ProfilePage } from '../../user/profile/profile.page';
import { UploadService } from '../../services/upload.service';

declare var window;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  step = 1;
  repeatPassword = '';
  signupData: UserProfile = new UserProfile;
  signinData = {email: '', password: ''};

  imageURI: any = 'assets/empty-picture.png';
  imageVerified = 'verified';
  jobList = ['Actor', 'Author', 'Cook', 'Designer', 'Director', 'Doctor', 'Engineer', 'Farmer', 'Journalist', 'Lawyer', 'Photographer',
   'Police Officer', 'Programmer', 'Sailor', 'Scientist', 'Singer', 'Soldier', 'Teacher', 'Writer', 'Other'];

  constructor(
    private nav: NavController,
    private camera: Camera,
    public loadingController: LoadingController,
    public toastCtrl: ToastController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private fb: FormBuilder,
    private authService: AuthService,
    private changeRef: ChangeDetectorRef,
    private uploadService: UploadService,
    private applicationRef : ApplicationRef
  ) {

    this.signupForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ]
    });
  }

  ngOnInit() {
    this.renewSignupForm();
  }

  change() {
    console.log(this.signupData);
  }

  public changeStep(step: number) {
    this.step = step;
  }

  public async register() {
    if (!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      const loadingElement = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'crescent'
      });
      await loadingElement.present();

      this.authService
      .signup(this.signupForm.value.email, this.signupForm.value.password,
        userData => {
          this.step = 2;
          loadingElement.dismiss();
          this.changeRef.detectChanges();
          this.signupData.email = this.signupForm.value.email;
          this.signupData.uid = userData.user.uid;
          this.signinData.email = this.signupForm.value.email;
          this.signinData.password = this.signupForm.value.password;
          this.signupForm.reset();
        },
        async err => {
          loadingElement.dismiss();
          const alert = await this.alertController.create({
            message: err,
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.step = 1;
                  alert.dismiss();
                  console.log(err, this.step);
                }
              }
            ]
          });
          await alert.present();
      });
    }
  }

  async registerUserData(loadingElement) {
    this.authService.saveUserData(this.signupData,
       userData => {
          //this.nav.navigateForward(['main'], true);
          this.signin(loadingElement);
          this.renewSignupForm();
          this.signupForm.reset();
          this.step = 1;
       },
       async err => {
          loadingElement.dismiss();
          const alert = await this.alertController.create({
             message: err,
             buttons: [
               {
                    text: 'Ok',
                    handler: () => {
                      this.step = 1;
                      alert.dismiss();
                    }
                }
              ]
          });
          await alert.present();
       }
    );
  }

  public async finishRegistration() {
    const loadingElement = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'crescent'
    });
    await loadingElement.present();
    if(this.imageURI != 'assets/empty-picture.png') {
        this.uploadService.uploadBase64(this.imageURI, '/profilePics', '', (filename, downloadUrl) => {
            this.signupData.profileImage = downloadUrl;
            this.signupData.profileImage_filename = filename;
            this.registerUserData(loadingElement);
        });
    } else {
        this.registerUserData(loadingElement);
    }
  }

  public signin(loadingElement) {
    this.authService
          .signin(this.signinData.email, this.signinData.password,
            authData => {
              this.nav.navigateForward(['main'], true);
              loadingElement.dismiss();
            },
            async err => {
              loadingElement.dismiss();
              const alert = await this.alertController.create({
                message: err,
                buttons: [
                  {
                    text: 'Ok',
                    handler: () => {
                      alert.dismiss();
                    }
                  }
                ]
              });
              await alert.present();
            }
          );
  }

  public navigate(link: string) {
    this.step = 1;
    this.renewSignupForm();
    this.nav.navigateForward(['welcome/' + link], true);
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
              this.imageURI = 'data:image/png;base64,' + imagePath;
              this.imageVerified = 'verified';
              this.applicationRef.tick();
        });
  }

  async acceptTerms() {
    if (this.imageVerified === 'unverified') {
      const alert_pre = await this.alertController.create({
        header: 'Alert',
        message: 'Must select your profile picture.',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          },
        ]
      });
      await alert_pre.present();
      return;
    }
    const message =
      // tslint:disable-next-line:max-line-length
      'I agree not to post any nude photos, harass, or bully anyone. We will not sell your information nor let in any 3rd party under any terms.';
    const alert = await this.alertController.create({
      header: 'Terms of Use',
      message,
      buttons: [
        {
          text: 'Decline',
        },
        {
          text: 'Accept',
          handler: () => {
            this.finishRegistration();
          }
        }
      ]
    });

    await alert.present();
  }

  renewSignupForm() {
    this.signupData = new UserProfile;
    this.repeatPassword = '';
  }
}

import { Component } from '@angular/core';
import { Platform, AlertController, ToastController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController } from '@ionic/angular';
import { AuthService } from './authentification/auth.service';
import { CommonService } from './common/common.service';
import { MenuController } from '@ionic/angular';
//import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
import { Broadcaster } from '@ionic-native/broadcaster/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nav: NavController,
    private authService: AuthService,
    public alertController: AlertController,
    public toastController: ToastController,
    private menu: MenuController,
    private fcm: FirebaseMessaging,
    private broadcaster: Broadcaster
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
        try{
            // ionic push notification example
            /*
            this.fcm.onNotification().subscribe(data => {
              console.log(data);
              if (data.wasTapped) {
                console.log('Received in background');
                if(data.event == 'live_stream'){
                    this.navigate('/friend-video/' + data.uid);
                }
                if(data.event == 'chat') {
                    this.navigate('/chat/chat/' + data.chat_id);
                }
              } else {
                console.log('Received in foreground');
                this.pushNotification(data);
              }
              this.fireBroadcasting();
            });
            // refresh the FCM token
            this.fcm.onTokenRefresh().subscribe(token => {
              console.log(token);
              this.authService.updateToken(token);
            });
            */
            this.fcm.onMessage().subscribe(payload => {
                console.log("New foreground FCM message: ", payload);
                this.pushNotification(payload);
            });

            this.fcm.onBackgroundMessage().subscribe(payload => {
                console.log("New foreground FCM message: ", payload);
                if(payload.event == 'live_stream'){
                    this.navigate('/friend-video/' + payload.uid);
                }
                if(payload.event == 'chat') {
                    this.navigate('/chat/chat/' + payload.chat_id);
                }
            });

            this.fcm.onTokenRefresh().subscribe(() => {
                console.log("Device token updated");
                this.fcm.getToken().then(token => {
                   console.log("Got device token: ", token);
                   this.authService.updateToken(token);
                });
            })

            // unsubscribe from a topic
            // this.fcm.unsubscribeFromTopic('offers');
        } catch(e) {

        }
    });
  }

  public fireBroadcasting() {
    // Send event to Native
    this.broadcaster.fireNativeEvent(CommonService.BROADCAST_EVENT.LIVE_STREAM, {}).then(() => console.log('success'));
  }

  public openUserSite() {
    window.open('http://example.com', '_system');
  }

  public report() {
    this.menu.close();
    this.navigate('report');
  }

  public addBlock() {
    this.menu.close();
    this.navigate('add-block');
  }
  public deleteAccount() {
    this.confirmAlert('Alert', 'Confirm you want to delete this account', ()=>{
        this.authService.deleteAccount(
            () => {
                this.nav.navigateRoot('/welcome');
            },
            async error => {
                this.alertError(error)
            }
        );
     })
  }

  public signout() {
    this.confirmAlert('Alert', 'Do you want to sign out really?', ()=>{
        this.authService.signout(
          () => {
            this.nav.navigateRoot('/welcome');
          },
          async error => {
            this.alertError(error)
          }
        );
    })
  }

  async confirmAlert(header, message, fnOk) {
      this.menu.close();
      const alert_pre = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'OK',
            handler: () => {
              fnOk()
            }
          }
        ]
      });
      await alert_pre.present();
    }

  async alertError(error) {
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

  public navigate(link: string) {
    this.nav.navigateForward([link], true);
  }

  async pushNotification(data) {
    let msg = '';
    if(data.event == 'live_stream') {
        msg = data.username + ' started live video stream.';
        if(!data.start) msg = data.username + ' stopped live video stream.';
    } else if(data.event == 'chat'){
        msg = data.username + '\n';
        msg += data.message;
    }
    const toast_push = await this.toastController.create({
        message: msg,
        showCloseButton: false,
        duration: 2000,
        position: 'top'
    });
    toast_push.present();
  }

}

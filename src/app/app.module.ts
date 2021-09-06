import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient} from '@angular/common/http';
//import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
import { Broadcaster } from '@ionic-native/broadcaster/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';

import { CommonComponentsModule } from './common/common.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainContainerPage } from './main-page/main-container/main-container.page';
import { UserProfilePage } from './main-page/user-profile/user-profile.page';
import { UserBubblesPage } from './main-page/user-bubbles/user-bubbles.page';
import { UserFollowingPage } from './main-page/user-following/user-following.page';
import { PostImagePage } from './main-page/post-image/post-image.page';
import { PostVideoPage } from './main-page/post-video/post-video.page';
import { LiveVideoPage } from './main-page/live-video/live-video.page';
import { FriendVideoPage } from './main-page/live-video/friend-video/friend-video.page';
import { VideoListPage } from './main-page/live-video/video-list/video-list.page';
import { ChatsPage } from './main-page/chats/chats.page';
import { ChatPage } from './main-page/chats/chat/chat.page';
import { AddGroupPage } from './main-page/chats/add-group/add-group.page';
import { AddFriendPage } from './main-page/chats/add-friend/add-friend.page';
import { GroupListPage } from './main-page/chats/group-list/group-list.page';
import { AddBlockPage } from './main-page/add-block/add-block.page';
import { ReportPage } from './main-page/report/report.page';
import { SigninComponent } from './authentification/signin/signin.component';
import { SignupComponent } from './authentification/signup/signup.component';
import { PassRecoveryComponent } from './authentification/pass-recovery/pass-recovery.component';
import { LoggedInGuard } from './authentification/loddeg-in.guard';
import { LoggedOutGuard } from './authentification/logged-out.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FollowersPage } from './user/followers/followers.page';
import { FollowingsPage } from './user/followings/followings.page';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AuthService } from './authentification/auth.service';
import { CommonService } from './common/common.service';
import { UploadService } from './services/upload.service';
import { WebrtcService } from './services/webrtc.service';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {EmailComposer} from "@ionic-native/email-composer/ngx";
import {Stripe} from "@ionic-native/stripe/ngx";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { IonicGestureConfig } from './utils/IonicGestureConfig';
import { LongPressModule } from 'ionic-long-press';

// AF2 Settings
const firebaseConfig = {
  apiKey: 'AIzaSyBILV0TU7teqen2fDH2qZoGpCGAB-FUFOM',
  authDomain: 'kittykat-f2c10.firebaseapp.com',
  databaseURL: 'https://kittykat-f2c10.firebaseio.com',
  projectId: 'kittykat-f2c10',
  storageBucket: 'kittykat-f2c10.appspot.com',
  messagingSenderId: '793790968316'
};

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    PassRecoveryComponent,
    MainContainerPage,
    VideoListPage,
    UserProfilePage,
    UserBubblesPage,
    UserFollowingPage,
    FollowersPage,
    FollowingsPage,
    PostImagePage,
    PostVideoPage,
    LiveVideoPage,
    FriendVideoPage,
    VideoListPage,
    ChatsPage,
    ChatPage,
    AddGroupPage,
    AddFriendPage,
    AddBlockPage,
    ReportPage,
    GroupListPage
  ],
  entryComponents: [AddGroupPage, AddFriendPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    HttpClientModule,
    LongPressModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LoggedInGuard,
    LoggedOutGuard,
    Camera,
    StreamingMedia,
    AuthService,
    CommonService,
    UploadService,
    WebrtcService,
    MediaCapture,
    EmailComposer,
    Stripe,
    HttpClient,
    //FCM,
    FirebaseMessaging,
    Broadcaster,
    AndroidPermissions,
    IonicGestureConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

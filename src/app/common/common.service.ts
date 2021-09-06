import { Injectable } from '@angular/core';
import { AuthService } from '../authentification/auth.service';
//import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
    static BROADCAST_EVENT={
        CURRENT_USER: 'current_user',
        LIVE_STREAM: 'live_stream'
    };
  constructor(
    public authService: AuthService,
    private fcm: FirebaseMessaging,
    private db: AngularFirestore
  ) { }

  getToken() {
    // get FCM token
    try{
        this.fcm.getToken().then(token => {
          console.log(token);
          this.authService.updateToken(token);
        });
    } catch(e) {

    }
  }

  public getLiveVideos(uid): Promise<firestore.QuerySnapshot> {
     return this.db.collection('live_streaming').ref
         .where('friends', 'array-contains', uid)
         .get();
  }

    public registerLiveVideo(uid, friends, callback) {
      this.db
          .collection('live_streaming')
          .doc(uid).set({
            userId: uid,
            friends: friends
          })
          .then(value => {
              if (callback != null) {
                callback(false);
              }
          })
          .catch(err => {
              if (callback != null) {
                callback(true);
              }
          });
    }

    public deleteLiveVideo(uid, callback) {
      this.db.collection("live_streaming").doc(uid).delete().then(function() {
          callback(false);
      }).catch(function(error) {
          console.error("Error removing document: ", error);
          callback(true);
      });
    }
}

import { Injectable } from '@angular/core';
import { firestore } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class AdService {
    private basePath = 'ads';

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
  ) {}

  getAds(): Observable<any> {
    return this.db.collection('ads').snapshotChanges();
  }

  getAd(docId) {
     return this.db.collection('ads').doc(docId).snapshotChanges();
  }

  public updateAd(data, funSuccess=null, funError=null) {
    this.db
      .collection(this.basePath)
      .doc<any>(data.uid)
        .set(Object.assign({}, data))
        .then(value => {
          console.log('Success Save user data on firestore!', value);
          if (funSuccess != null) {
            funSuccess(value);
          }
        })
        .catch(err => {
          console.log('Failed Save user data:', err.message);
          if (funError != null) {
            funError(err);
          }
        });
  }

  public addNewAd(data, funSuccess=null, funError=null) {
      this.db
        .collection(this.basePath)
        .add(Object.assign({}, data))
        .then(value => {
            console.log('Success Save user data on firestore!', value);
            if (funSuccess != null) {
              funSuccess(value);
            }
        })
        .catch(err => {
            console.log('Failed Save user data:', err.message);
            if (funError != null) {
              funError(err);
            }
        });
  }

  public deleteAd(uid, data, callback) {
    this.db.collection("ads").doc(uid).delete().then(function() {
        if(data) {
            const storageRef = firebase.storage().ref();
            storageRef.child(`${data.path}/${data.filename}`).delete();
        }
        callback(false);
    }).catch(function(error) {
        console.error("Error removing document: ", error);
        callback(true);
    });
  }

  public deleteFile(path, filename) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${path}/${filename}`).delete();
  }
}

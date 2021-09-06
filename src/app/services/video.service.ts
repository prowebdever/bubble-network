import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})

export class VideoService {

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
//    private stroageRef: AngularFireStorageReference,
//    private uploadMonitor: AngularFireUploadTask
    ) {}

  getVideos(): Observable<any> {
    return this.db.collection('videos').snapshotChanges();
  }

}

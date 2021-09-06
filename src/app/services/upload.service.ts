import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as firebase from 'firebase';
import { FileUpload } from '../models/file-upload-interface';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private basePath = '/uploads';

  constructor(private db: AngularFireDatabase) { }

  pushFileToStorage(fileUpload: FileUpload, progress: { percentage: number }) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${fileUpload.file.name}`).put(fileUpload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (error) => {
        // fail
        console.log(error);
      },
      () => {
        // success
        fileUpload.url = uploadTask.snapshot.downloadURL;
        fileUpload.name = fileUpload.file.name;
        this.saveFileData(fileUpload);
      }
    );
  }
  uploadBase64(imageData, path, old_filename, fnSuccess) {
      let storageRef = firebase.storage().ref();
      if(typeof old_filename != 'undefined' && old_filename) {
        const oldRef = storageRef.child(`${path}/${old_filename}`);
        oldRef.delete();
      }
      // Create a timestamp as filename
      const filename = Math.floor(Date.now() / 1000);

      // Create a reference to 'images/todays-date.jpg'
      const imageRef = storageRef.child(`${path}/${filename}.png`);

      imageRef.putString(imageData, firebase.storage.StringFormat.DATA_URL)
        .then((snapshot)=> {
          // Do something here when the data is succesfully uploaded!
          imageRef.getDownloadURL().then(url=>fnSuccess(imageRef.name, url));
      });
    }

    uploadVideo(videoData, path, old_filename, fnProgress, fnSuccess, fnError) {
      let storageRef = firebase.storage().ref();
      if(typeof old_filename != 'undefined' && old_filename) {
        const oldRef = storageRef.child(`${path}/${old_filename}`);
        oldRef.delete();
      }
      const filename = Math.floor(Date.now() / 1000) + 'video.mp4';
      const videoRef = storageRef.child(`${path}/${filename}`);
      let uploadTask = videoRef.put(videoData);
      //let uploadTask = storageRef.child(`${path}/${filename}`).putString(videoData, firebase.storage.StringFormat.DATA_URL, { contentType: 'video/mp4' });
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          // in progress
          const snap = snapshot as firebase.storage.UploadTaskSnapshot;
          fnProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        },
        (error) => {
          // fail
          fnError(error);
          console.log(error);
        },
        () => {
          // success
          videoRef.getDownloadURL().then(url=>fnSuccess(filename, url));
        }
      );

    }

  private saveFileData(fileUpload: FileUpload) {
    this.db.list(`${this.basePath}/`).push(fileUpload);
  }

  getFileUploads(numberItems): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, ref =>
      ref.limitToLast(numberItems));
  }

  deleteFileUpload(fileUpload: FileUpload) {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete();
  }
}

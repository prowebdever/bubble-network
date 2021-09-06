import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class BubblesService {
  private basePath = 'ads';

  constructor(private db: AngularFirestore) {}

  getBubbles(): Observable<any> {
    return this.db.collection(this.basePath).snapshotChanges();
  }

  getUser(docId) {
    return this.db.collection('users').doc(docId).snapshotChanges();
  }

  getProfiles(): Observable<any> {
    return this.db.collection('users')
        .snapshotChanges();
  }

  getActivity(): Observable<any> {
      return this.db
         .collection(this.basePath, ref => ref.where('likes_count', '>=', 1))
         .snapshotChanges();
    }

  updateLike(docId, updatedArray) {
    this.db
      .collection(this.basePath)
      .doc(docId)
      .update({ likes: updatedArray });
  }

  postComment(docId, newComment) {
    this.db
      .collection(this.basePath)
      .doc(docId)
      .update({
          comments: newComment
      });
  }

  getBubblesByUser(userId): Observable<any> {
    return this.db
      .collection(this.basePath, ref => ref.where('userId', '==', userId))
      .snapshotChanges();
  }
}

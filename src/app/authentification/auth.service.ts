import { Injectable } from '@angular/core';
import { firestore } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { UserProfile } from '../models/user-profile.interface';
import { Utils } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private userSubscription = null;
  private user: Observable<firebase.User>;

  public userData: UserProfile = new UserProfile;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    try {
      const stored_user = JSON.parse(localStorage.getItem('bubble_user'));
      this.userData.uid = stored_user.uid;
      this.userData.email = stored_user.email;
    } catch (e) {
      console.log('auth service constructor error:', e);
    }
  }

  getCurrentUser(funSuccess = null, funError = null) {
    this.afs.doc<any>('users/' + this.userData.uid)
      .valueChanges()
      .subscribe(
        data => {
          if (data !== null && typeof data != 'undefined') {
            data.email = this.userData.email;
            data.uid = this.userData.uid;
            this.userData = Utils.getUserProfile(data);
            if (funSuccess !== null) {
              funSuccess(this.userData);
              return;
            }
          }
          if (funError !== null) {
            funError({ code: 'empty_or_unformat', message: 'Empty data or Unknown formated data.' });
          }
        },
        error => {
          if (funError !== null) {
            funError(error);
          }
        }
      );
  }

  public signup(email: string, password: string, funSuccess = null, funError = null) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
        this.userData.uid = value.user.uid;
        this.userData.email = value.user.email;

        if (funSuccess != null) {
          funSuccess(value);
        }
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
        if (funError != null) {
          funError(err);
        }
      });
  }

  public resetPassword(email: string, funSuccess = null, funError = null) {
    this.afAuth.auth
      .sendPasswordResetEmail(email)
      .then(value => {
        console.log('Send request for reset password!', value);
        if (funSuccess != null) {
          funSuccess(value);
        }
      })
      .catch(err => {
        console.log('Cannot send request for reset password', err.message);
        if (funError != null) {
          funError(err);
        }
      });
  }

  public signout(funSuccess = null, funError = null) {
    this.afAuth.auth.signOut()
      .then(() => {
        this.userData.uid = '';
        this.userData.email = '';
        localStorage.removeItem('bubble_user');
        console.log('Sign out from app!');
        if (funSuccess != null) {
          funSuccess();
        }
      })
      .catch(err => {
        console.log('Failed to sing out:', err.message);
        if (funError != null) {
          funError(err);
        }
      });
  }

  public deleteAccount(funSuccess = null, funError = null) {
      this.afAuth.auth.signOut()
        .then(() => {
            this.afs.collection('users').doc<any>(this.userData.uid).delete();
            this.userData.uid = '';
            this.userData.email = '';
            localStorage.removeItem('bubble_user');
            if (funSuccess != null) {
                funSuccess();
            }
        })
        .catch(err => {
          console.log('Failed to sing out:', err.message);
          if (funError != null) {
            funError(err);
          }
        });
    }

  public signin(email: string, password: string, funSuccess = null, funError = null) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success Sign in!', value);
        this.userData.uid = value.user.uid;
        this.userData.email = value.user.email;
        localStorage.setItem('bubble_user', JSON.stringify(value.user));
        if (funSuccess != null) {
          funSuccess(value);
        }
      })
      .catch(err => {
        console.log('Failed to sing in:', err.message);
        if (funError != null) {
          funError(err);
        }
      });
  }

  public saveUserData(userData, funSuccess = null, funError = null) {
    if (this.userData.uid === '') {
      funError({ code: 'empty_uid', message: 'User ID is empty.' });
      return;
    }

    userData.email = this.userData.email;

    this.afs
      .collection('users')
      .doc<any>(this.userData.uid)
      .set(Object.assign({}, userData))
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

  public updateToken(token) {
    if(this.userData) {
        this.afs
         .collection('users')
         .doc(this.userData.uid)
         .update({
             token: token
         })
         .then(() => {
              this.userData.token = token;
         });
    }
  }

  public updatePeerId(peer_id) {
      if(this.userData) {
          this.afs
           .collection('users')
           .doc(this.userData.uid)
           .update({
               peer_id: peer_id
           })
           .then(() => {
                this.userData.peer_id = peer_id;
           });
      }
  }

  getUsersFromIDs(friendsId, funSuccess = null, funError = null) {
    if (friendsId === undefined || friendsId === null) {
      if (funError !== null) {
        funError({ code: 'invalid_friends_id', message: '' });
        return;
      }
    }

    for (let i = 0; i < friendsId.length; i++) {
      const uid = friendsId[i].replace(/^\s+|\s+$/g, '');
      this.afs
        .collection('users')
        .doc(uid)
        .snapshotChanges()
        .subscribe(doc => {
          try {
            const data: any = doc.payload.data();
            data.uid = doc.payload.id;
            if ( funSuccess) {
              funSuccess(data);
            }
          } catch (e) {
              if ( funError ) {
                funError(e);
              }
          }
        });
    }

  }

  following(following_uid) {
     let following = this.userData.following;
     if(!following) following = [];
     let index = following.findIndex(item => item == following_uid);
     if(index == -1) {
        following.push(following_uid);
     }
     this.afs
         .collection('users')
         .doc(this.userData.uid)
         .update({
             following: following
         })
         .then(() => {
              this.userData.following = following;
         });
    }

  unfollowing(following_uid) {
      let following = this.userData.following;
      if(following && following.length>0){
          let index = following.findIndex(item => item == following_uid);
          if(index > -1) {
              following.splice(index, 1);
          }
          this.afs
              .collection('users')
              .doc(this.userData.uid)
              .update({following: following})
              .then(()=>{
                  this.userData.following = following;
              });
      }
  }

  getFollowers(user_id): Promise<firestore.QuerySnapshot> {
    return this.afs.collection('users').ref
    .where('following', 'array-contains', user_id)
    .get();
  }

   getUser(docId) {
      return this.afs.collection('users').doc(docId).snapshotChanges();
   }

   addFriends(friend_ids) {
       let old_friends = this.userData.friends;
       if(!old_friends) old_friends = [];
       let tmp = old_friends.concat(friend_ids);
       var new_friends = tmp.filter((item, pos) => tmp.indexOf(item) === pos);
       this.afs
           .collection('users')
           .doc(this.userData.uid)
           .update({
               friends: new_friends
           })
           .then(() => {
                this.userData.friends = new_friends;
           });
   }

   removeFriend(friend_id) {
        let friends = this.userData.friends;
        if(friends && friends.length>0){
            let index = friends.findIndex(item => item == friend_id);
            if(index > -1) {
                friends.splice(index, 1);
            }
            this.afs
                .collection('users')
                .doc(this.userData.uid)
                .update({friends: friends})
                .then(()=>{
                    this.userData.friends = friends;
                });
        }
   }

   addBlocks(user_ids) {
      let old_blocks = this.userData.blocks;
      if(!old_blocks) old_blocks = [];
      let tmp = old_blocks.concat(user_ids);
      var new_blocks = tmp.filter((item, pos) => tmp.indexOf(item) === pos);
      this.afs
          .collection('users')
          .doc(this.userData.uid)
          .update({
              blocks: new_blocks
          })
          .then(() => {
               this.userData.blocks = new_blocks;
          });
   }

   unBlock(user_id) {
       let blocks = this.userData.blocks;
       if(blocks && blocks.length>0){
          let index = blocks.findIndex(item => item == user_id);
          if(index > -1) {
             blocks.splice(index, 1);
          }
          this.afs
             .collection('users')
             .doc(this.userData.uid)
             .update({blocks: blocks})
             .then(()=>{
                this.userData.blocks = blocks;
             });
       }
   }
}

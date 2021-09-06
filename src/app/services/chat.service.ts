import { Injectable } from '@angular/core';
import { firestore } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfile } from '../models/user-profile.interface';
import { AuthService } from '../authentification/auth.service';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChatData } from '../models/chat-data.interface';
import { MessageData } from '../models/message-data.interface';
import { Utils } from '../utils/utils';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class ChatService {
    public c = 0;
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private http: HttpClient
  ) {

  }

  addChat(chat: ChatData, callback) {
    this.getTimestamp(timestamp => {
        this.afs.collection('chats').add({
          users: chat.users,
          isGroup: chat.isGroup,
          name: chat.name,
          lastMessage: '',
          deleted: [],
          viewed: chat.viewed,
          createdAt: timestamp
        })
        .then(docRef => {
            this.afs.collection('chats').doc(docRef.id).update({uid: docRef.id});
            callback(docRef.id);
        });
    })
  }

  getChat(uid, userId, callback) {
    this.afs.collection('chats').doc(uid).get().subscribe(snapshot => {
        let doc:any = snapshot.data();
        let chat:ChatData = new ChatData;
        chat = {...doc};
        if(chat.isGroup) {
            chat.profileImage = 'assets/group_icon.png';
            callback(chat);
        } else {
            let other_id = (chat.users[0]==userId)?chat.users[1]:chat.users[0];
            chat.other = other_id;
            this.authService.getUser(other_id).subscribe(snapshot => {
                let user:any = snapshot.payload.data();
                chat.name = user.username;
                chat.profileImage = user.profileImage;
                if(!chat.profileImage) chat.profileImage = 'assets/empty-picture.png';
                callback(chat);
            });
        }
    });
  }

  getChats(uid, friends) {
    return this.getAllChats(uid).pipe(
        map(res => {
          let chats = []; let others = [];
          for (let c of res) {
            if(c.deleted.indexOf(uid) == -1) {
                if(c.isGroup) {
                    c.profileImage = 'assets/group_icon.png';
                } else {
                    let other_id = (c.users[0]==uid)?c.users[1]:c.users[0];
                    c.other = other_id;
                    this.authService.getUser(other_id).subscribe(snapshot => {
                        let user:any = snapshot.payload.data();
                        c.name = user.username;
                        c.profileImage = user.profileImage;
                        if(!c.profileImage) c.profileImage = 'assets/empty-picture.png';
                    });
                    others.push(other_id);
                }
                chats.push(c);
            }
          }
          // add friends
          for(let f of friends) {
            if(others.indexOf(f) == -1) {
                let c = new ChatData;
                c.other = f;
                c.users = c.viewed = [f, uid];
                this.authService.getUser(f).subscribe(snapshot => {
                    let user:any = snapshot.payload.data();
                    c.name = user.username;
                    c.profileImage = user.profileImage;
                    if(!c.profileImage) c.profileImage = 'assets/empty-picture.png';
                });
                chats.push(c);
            }
          }
          return chats;
        })
      )
  }

  getAllChats(uid) {
    return this.afs.collection('chats', ref => ref.where('users', 'array-contains', uid).orderBy('createdAt', 'desc'))
        .valueChanges() as Observable<ChatData[]>;
  }

  removeChat(id, uid) {
    this.afs.collection('chats').doc(id).get().subscribe(snapshot => {
        let chat:any = snapshot.data();
        if(chat.isGroup) {
            let index = chat.users.indexOf(uid);
            chat.users.splice(index, 1);
            index = chat.viewed.indexOf(uid);
            if(index > -1) chat.viewed.splice(index, 1);
            if(chat.users.length == 0) {
                this.afs.collection('chats').doc(id).delete();
            } else {
                this.afs.collection('chats').doc(id).update({users: chat.users, viewed: chat.viewed});
            }
        } else {
            if(chat.deleted.indexOf(uid) == -1) {
                chat.deleted.push(uid);
            }
            if(chat.deleted.length == chat.users.length) {
                this.afs.collection('chats').doc(id).delete();
            } else {
                this.afs.collection('chats').doc(id).update({deleted: chat.deleted});
            }
        }
    })
  }

  addMessage(chat_id, message: MessageData) {
    this.getTimestamp(timestamp => {
        let d = timestamp;
        this.afs.collection('chats').doc(chat_id).collection('messages').add({
          userId: message.userId,
          message: message.message,
          createdAt: d
        })
        .then(docRef => {
            this.afs.collection('chats').doc(chat_id).collection('messages').doc(docRef.id).update({uid: docRef.id});
            this.afs.collection('chats').doc(chat_id).update({
                viewed: [message.userId],
                lastMessage: message.message,
                createdAt: d
            });
        });
    });
  }

  updateViewed(chat_id, userId) {
    this.afs.collection('chats').doc(chat_id).get().subscribe(snapshot => {
        let chat = snapshot.data();
        let viewed = chat.viewed;
        if(viewed.indexOf(userId) == -1) {
            viewed.push(userId);
            this.afs.collection('chats').doc(chat_id).update({viewed: viewed});
        }
    })
  }

  getMessages(chat_id, userId, callback) {
    return this.getAllMessages(chat_id).pipe(
        map(res => {
          let messages = [];
          for (let m of res) {
            m.isMine = m.userId == userId;
            m.date = Utils.getChatTime(m.createdAt);
            messages.push(m);
          }
          callback(messages);
          return messages;
        })
     );
  }

  getAllMessages(chat_id) {
    return this.afs.collection('chats').doc(chat_id).collection('messages', ref => ref.orderBy('createdAt'))
            .valueChanges() as Observable<MessageData[]>;
  }

  removeMessage(chat_id, msg_id, uid) {
      this.afs.collection('chats').doc(chat_id).collection('messages').doc(msg_id).get().subscribe(snapshot => {
          let msg:any = snapshot.data();
          if(msg && msg.userId == uid) {
            this.afs.collection('chats').doc(chat_id).collection('messages').doc(msg_id).delete();
          }
      })
  }

  getTimestamp(callback) {
    this.http.post('https://bubbleflix.herokuapp.com/live_stream/get_timestamp', {})
    .subscribe(data => {
        let result:any = data;
        callback(result.timestamp);
    });
  }

}
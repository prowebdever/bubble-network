import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";
import { ChatData } from '../../../models/chat-data.interface';
import { MessageData } from '../../../models/message-data.interface';
import { UserProfile } from '../../../models/user-profile.interface';
import { AuthService } from '../../../authentification/auth.service';
import { ChatService } from '../../../services/chat.service';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
    @ViewChild('content') content: any;
    public chat_id = '';
    public other_uid = '';
    public newMsg = '';
    public allMessages:Observable<any[]>;
    public messages:MessageData[] = [];
    private currentUser: UserProfile;
    public chat:ChatData = new ChatData;
    public is_deleting = false;

  constructor(
    private nav: NavController,
    private authService: AuthService,
    private chatService: ChatService,
    public route: ActivatedRoute,
    private loadingController: LoadingController,
    private http: HttpClient,
    private alertController: AlertController
  ) {
    if(this.route.snapshot.params.mode == 'new') {
        this.other_uid = this.route.snapshot.params.id;
    } else {
        this.chat_id = this.route.snapshot.params.id;
    }
    this.authService.getCurrentUser(data=>{
        this.currentUser = data;
        if(this.chat_id) {
            this.getAllMessages();
        } else {
            this.authService.getUser(this.other_uid).subscribe(snapshot => {
                let user:any = snapshot.payload.data();
                this.chat.name = user.username;
                this.chat.profileImage = user.profileImage;
                if(!this.chat.profileImage) this.chat.profileImage = 'assets/empty-picture.png';
            })
        }
    });
  }

  ngOnInit() {
  }

  getAllMessages() {
    this.chatService.getChat(this.chat_id, this.currentUser.uid, chat => {
        this.chat = chat;
        this.other_uid = chat.other;
    });
    this.allMessages = this.chatService.getMessages(this.chat_id, this.currentUser.uid, (messages) => {
        for(let i=0;i<messages.length;i++) {
            if(this.messages.length-1<i) {
                this.messages.push(this.getNewMessage(messages[i]));
            } else {
                if(messages[i].uid != this.messages[i].uid) {
                    this.messages[i] = this.getNewMessage(messages[i]);
                }
            }
        }
        if(messages.length<this.messages.length) {
            this.messages = this.messages.slice(0, messages.length);
        }
        this.content.scrollToBottom();
        this.chatService.updateViewed(this.chat_id, this.currentUser.uid);
    });
    this.scrollToBottom();
  }

  getNewMessage(message) {
      let m = new MessageData;
      m = {...message};
      if(!m.isMine) {
          this.authService.getUser(m.userId).subscribe(snapshot => {
              let user:any = snapshot.payload.data();
              m.name = user.username;
              m.profileImage = user.profileImage;
              if(!m.profileImage) m.profileImage = 'assets/empty-picture.png';
          });
      }
      return m;
  }

  scrollToBottom() {
      setTimeout(() => {
          this.content.scrollToBottom();
      }, 1000);
  }

  async createChatAndMessage() {
    let chat = new ChatData;
    chat.users = [this.currentUser.uid, this.other_uid];
    const loadingElement = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'crescent'
    });
    await loadingElement.present();
    this.chatService.addChat(chat, (chat_id) => {
        loadingElement.dismiss();
        this.chat_id = chat_id;
        this.getAllMessages();
        this.sendMessage();
    });
  }

  sendMessage() {
    if(this.chat_id == '') {
        this.createChatAndMessage();
        return;
    }
    let msg:MessageData = new MessageData;
    msg.userId = this.currentUser.uid;
    msg.message = this.newMsg;
    this.chatService.addMessage(this.chat_id, msg);
    this.postPush(this.newMsg);
    this.newMsg = '';
  }

  postPush(message) {
    let users = [];
    for(let i=0;i<this.chat.users.length; i++) {
        if(this.chat.users[i]!=this.currentUser.uid) {
            users.push(this.currentUser.uid);
        }
    }
    this.http.post('https://bubbleflix.herokuapp.com/live_stream/send_message',
    {
        uid: this.currentUser.uid,
        chat_id: this.chat_id,
        users: users.join(','),
        message: message
    });
  }

  gotoUserProfile() {
    if(this.other_uid){
        this.nav.navigateForward(['/user-following', this.other_uid], true);
    } else {
        this.nav.navigateForward(['/group-list', this.chat_id], true);
    }
  }

  deleteMsg(uid) {
    if(this.is_deleting) return;
    this.is_deleting = true;
    this.confirmAlert('Are you sure to want to delete this message?', () => {
        this.chatService.removeMessage(this.chat_id, uid, this.currentUser.uid);
        this.is_deleting = false;
    });
  }

  async confirmAlert(msg, fnOk) {
      const alert = await this.alertController.create({
      header: 'Confirm!',
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Okay',
          handler: () => {
            fnOk();
          }
        }
      ]
    });
    await alert.present();
  }
}

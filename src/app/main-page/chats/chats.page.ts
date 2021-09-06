import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController, AlertController } from '@ionic/angular';
import { ChatData } from '../../models/chat-data.interface';
import { UserProfile } from '../../models/user-profile.interface';
import { AuthService } from '../../authentification/auth.service';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss']
})
export class ChatsPage implements OnInit {
  allChats:Observable<any[]>;
  searchString = '';
  others = [];
  private currentUser: UserProfile;

  constructor(
    public actionSheetController: ActionSheetController,
    private nav: NavController,
    private authService: AuthService,
    private chatService: ChatService,
    private alertController: AlertController
  ) {
    this.authService.getCurrentUser(data=>{
        this.currentUser = data;
        this.allChats = this.chatService.getChats(this.currentUser.uid, this.currentUser.friends);
    });
  }

  ngOnInit() {

  }

  isViewed(viewed) {
    return viewed.indexOf(this.currentUser.uid) > -1;
  }

  toDialog(chatId, uid) {
    if(chatId) {
        this.nav.navigateForward(['/chat', 'chat', chatId], true);
    } else {
        this.nav.navigateForward(['/chat', 'new', uid], true);
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Add Friend',
          icon: 'add-circle-outline',
          handler: () => {
            this.nav.navigateForward(['add-friend'], true);
          }
        },
        {
          text: 'Add Group',
          icon: 'add-circle-outline',
          handler: () => {
            this.nav.navigateForward(['add-group'], true);
          }
        }
      ]
    });
    await actionSheet.present();
  }

  removeChat(uid, isGroup) {
    let msg = 'Are you sure to want to delete chat logs?';
    if(isGroup) {
        msg = 'Are you sure to want to exit from group?';
    }
    this.confirmAlert(msg, () => {
        this.chatService.removeChat(uid, this.currentUser.uid);
    });
  }

  deleteFriend(uid) {
    let msg = 'Are you sure to want to remove friend?';
    this.confirmAlert(msg, () => {
        this.authService.removeFriend(uid);
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

  async presentChatActions(event) {
    event.stopPropagation();
    
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Pin Chat',
          icon: 'attach',
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Remove Chat',
          icon: 'remove-circle',
          handler: () => {
            console.log('Share clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }
}

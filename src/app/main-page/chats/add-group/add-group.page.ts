import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { UserProfile } from '../../../models/user-profile.interface';
import { AuthService } from '../../../authentification/auth.service';
import { ChatData } from '../../../models/chat-data.interface';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.page.html',
  styleUrls: ['./add-group.page.scss'],
})
export class AddGroupPage {
  friends = [];
  searchString = '';
  groupName = '';
  public currentUser:UserProfile;

  constructor(
    public actionSheetController: ActionSheetController,
    private nav: NavController,
    private authService: AuthService,
    private chatService: ChatService,
    private toastController: ToastController,
    private alertController: AlertController,
    public loadingController: LoadingController,
  ) {
    this.authService.getCurrentUser(data => {
        this.currentUser = data;
        this.friends = [];
        for(let i=0; i<data.friends.length; i++) {
            this.authService.getUser(data.friends[i]).subscribe(snapshot => {
                let user:any = snapshot.payload.data();
                let f = {
                    uid: snapshot.payload.id,
                    url: user.profileImage,
                    username: user.username,
                    isChecked: false
                }
                if(!f.url) f.url = 'assets/empty-picture.png';
                this.friends.push(f);
            })
        }
    })
  }

  async createGroup() {
    if(this.groupName=='') {
        this.showToast('Please enter group name.');
        return;
    }
    let friends = [];
    for(let i=0;i<this.friends.length;i++) {
        if(this.friends[i].isChecked) {
            friends.push(this.friends[i].uid);
        }
    }
    if(friends.length == 0) {
        this.showToast('Please select friends.');
        return;
    }
    let chat = new ChatData;
    friends.push(this.currentUser.uid);
    chat.users = friends;
    chat.viewed = friends;
    chat.isGroup = true;
    chat.name = this.groupName;
    const loadingElement = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'crescent'
    });
    await loadingElement.present();
    this.chatService.addChat(chat, () => {
        this.showToast('Added Group successfully!');
        loadingElement.dismiss();
        this.nav.navigateBack('/chats');
    });
  }

  async removeFriend(uid) {
    this.confirmAlert('Are you sure to want to remove friend?', () => {
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

  async showToast(msg) {
    const toast_msg = await this.toastController.create({
      message: msg,
      showCloseButton: false,
      duration: 2000,
      position: 'bottom'
    });
    toast_msg.present();
  }
}

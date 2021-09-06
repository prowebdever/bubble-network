import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from '@ionic/angular';
import { AuthService } from '../../../authentification/auth.service';
import { BubblesService } from '../../../services/bubbles.service';
import { ActivatedRoute } from "@angular/router";
import { UserProfile } from '../../../models/user-profile.interface';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.page.html',
  styleUrls: ['./add-friend.page.scss'],
})
export class AddFriendPage {
  friends = [];
  users = [];
  searchString = '';
  private pageIndex = 0;
  private perPage = 12;
  public currentUser:UserProfile;

  constructor(
    public actionSheetController: ActionSheetController,
    private nav: NavController,
    private authService: AuthService,
    private bubblesService: BubblesService,
    public route: ActivatedRoute,
    public alertController: AlertController,
  ) {
    this.authService.getCurrentUser(data=>{
        this.currentUser = data;
        this.bubblesService.getProfiles()
        .subscribe(
          data => {
            this.users = [];
            this.friends = [];
            data.forEach(
              (ad, index) => {
                  const _doc = ad.payload.doc;
                  const user = _doc.data();
                  if(_doc.id != this.currentUser.uid && this.currentUser.friends.indexOf(_doc.id)==-1) {
                    let url = user.profileImage;
                    if(!url) {
                        url = 'assets/empty-picture.png';
                    }
                    this.users.push({
                       uid: _doc.id,
                       url: url,
                       username: user.username,
                       isChecked: false
                    });
                    if(this.friends.length<this.perPage) {
                        this.friends.push({
                           uid: _doc.id,
                           url: url,
                           username: user.username,
                           isChecked: false
                        });
                    }
                  }
              });
              this.pageIndex = 1;
          }
        );
    }, null);
  }

  loadFriendsFromUsers() {
    let startIndex = this.pageIndex*this.perPage;
    let endIndex = startIndex + this.perPage;
    for(let i=startIndex;i<endIndex;i++) {
        if(i>=this.users.length) break;
        this.friends.push({
            uid: this.users[i].uid,
            url: this.users[i].url,
            username: this.users[i].username,
            isChecked: false
        });
    }
    ++this.pageIndex;
  }

  isLastPageReached() {
    return this.pageIndex*this.perPage>=this.users.length;
  }

  doInfinite(infiniteScroll:any) {
    console.log('Begin async operation', infiniteScroll);
    setTimeout(() => {
        if(this.searchString=='')
            this.loadFriendsFromUsers();
      console.log('Async operation has ended');
      infiniteScroll.target.complete();
    }, 500);
  }

  async presentActionSheet(chatId) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Message',
          icon: 'text',
          handler: () => {
            this.nav.navigateForward(['/chats', chatId], true);
          }
        },
        {
          text: 'Remove from Friends',
          role: 'destructive',
          icon: 'remove-circle',
          handler: () => {
            console.log('Delete clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  onSearch(keyword) {
    this.friends = [];
    this.pageIndex = 0;
    if(keyword == '') {
        this.loadFriendsFromUsers();
    } else {
        let result = this.users.filter(item => item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1);
        for(let i=0;i<result.length;i++) {
            this.friends.push(
              {uid:result[i].uid, username:result[i].username, url:result[i].url, isChecked:false}
            );
        }
    }
  }

  addFriends() {
    if(this.friends.length>0) {
        let new_friends = [];
        for(let i=0;i<this.friends.length;i++) {
            if(this.friends[i].isChecked) {
                new_friends.push(this.friends[i].uid);
            }
        }
        if(new_friends.length>0) {
            this.presentAlertConfirm(data => {
                this.authService.addFriends(new_friends);
                if(this.searchString != '')
                    this.searchString = '';
            });
        }
    }
  }

  async presentAlertConfirm(fnOk) {
      const alert = await this.alertController.create({
        header: 'Confirm!',
        message: 'Are you sure to want to add friends?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {

            }
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

import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, AlertController } from '@ionic/angular';
import { AuthService } from '../../authentification/auth.service';
import { BubblesService } from '../../services/bubbles.service';
import { ActivatedRoute } from "@angular/router";
import { UserProfile } from '../../models/user-profile.interface';

@Component({
  selector: 'app-add-block',
  templateUrl: './add-block.page.html',
  styleUrls: ['./add-block.page.scss'],
})
export class AddBlockPage {
  blocks = [];
  users = [];
  all_users = [];
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
            this.blocks = [];
            this.users = [];
            this.all_users = [];
            this.pageIndex = 0;
            data.forEach(
              (ad, index) => {
                  const _doc = ad.payload.doc;
                  const user = _doc.data();
                  if(_doc.id != this.currentUser.uid) {
                    let new_user = this.getUser(_doc.id, user);
                    if(new_user.isBlocked) {
                        this.blocks.push(new_user);
                        this.users.push(new_user);
                    } else {
                        this.all_users.push(new_user);
                    }
                  }
                  if(index == data.length-1) {
                    this.loadFriendsFromUsers();
                  }
              });

          }
        );
    }, null);
  }

  loadFriendsFromUsers() {
    let startIndex = this.pageIndex*this.perPage;
    let endIndex = startIndex + this.perPage;
    for(let i=startIndex;i<endIndex;i++) {
        if(i>=this.all_users.length) break;
        this.users.push(this.all_users[i]);
    }
    ++this.pageIndex;
  }

  isLastPageReached() {
    return this.pageIndex*this.perPage>=this.all_users.length;
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
    this.users = [];
    this.pageIndex = 0;
    if(keyword == '') {
        this.loadFriendsFromUsers();
    } else {
        let result = this.blocks.filter(item => item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1);
        for(let i=0;i<result.length;i++) {
            this.users.push(result[i]);
        }
        let result2 = this.all_users.filter(item => item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1);
        for(let i=0;i<result2.length;i++) {
            this.users.push(result2[i]);
        }
    }
  }

  addBlocks() {
    if(this.users.length>0) {
        let new_users = [];
        for(let i=0;i<this.users.length;i++) {
            if(this.users[i].isChecked) {
                new_users.push(this.users[i].uid);
            }
        }
        if(new_users.length>0) {
            this.presentAlertConfirm('Are you sure to want to block selected users?', data => {
                this.authService.addBlocks(new_users);
                if(this.searchString != '')
                    this.searchString = '';
            });
        }
    }
  }

  unBlock(user_id) {
    this.presentAlertConfirm('Are you sure to want to unblock this user?', data => {
        this.authService.unBlock(user_id);
        if(this.searchString != '')
            this.searchString = '';
    });
  }

  async presentAlertConfirm(msg, fnOk) {
      const alert = await this.alertController.create({
        header: 'Confirm!',
        message: msg,
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

  getUser(id, data) {
    let new_user = {
       uid: id,
       url: data.profileImage,
       username: data.username,
       isChecked: false,
       isBlocked: false
    };
    if(!new_user.url) new_user.url = 'assets/empty-picture.png';
    if(this.currentUser.blocks.indexOf(id)>-1) {
        new_user.isBlocked = true;
    }
    return {...new_user};
  }

}

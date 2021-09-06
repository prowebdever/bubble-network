import { Component } from '@angular/core';
import { ActionSheetController, NavController, AlertController } from '@ionic/angular';
import { UserProfile } from '../../models/user-profile.interface';
import { AuthService } from '../../authentification/auth.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss']
})
export class FriendsPage {
  friends = [];
  users = [];
  searchString = '';
  private pageIndex = 0;
  private perPage = 5;
  public currentUser:UserProfile;

  constructor(
    public actionSheetController: ActionSheetController,
    private nav: NavController,
    private authService: AuthService,
    public alertController: AlertController,
  ) {
    this.authService.getCurrentUser(data=>{
       this.currentUser = data;
       let friends = this.currentUser.friends;
       this.users = [];
       this.friends = [];
       for(let i=0;i<friends.length;i++) {
            this.authService.getUser(friends[i])
            .subscribe(
               data => {
                    const user: any = data.payload.data();
                    let url = user.profileImage;
                    if(!url) {
                        url = 'assets/empty-picture.png';
                    }
                    this.users.push({
                       uid: data.payload.id,
                       url: url,
                       username: user.username,
                    });
                    if(this.friends.length<this.perPage) {
                        this.friends.push({
                           uid: data.payload.id,
                           url: url,
                           username: user.username,
                        });
                    }
               }
            );
       }
       this.pageIndex = 1;
    });
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

    onSearch(keyword) {
        this.friends = [];
        this.pageIndex = 0;
        if(keyword == '') {
            this.loadFriendsFromUsers();
        } else {
            let result = this.users.filter(item => item.username.toLowerCase().indexOf(keyword.toLowerCase()) !== -1);
            for(let i=0;i<result.length;i++) {
                this.friends.push(
                  {uid:result[i].uid, username:result[i].username, url:result[i].url}
                );
            }
        }
      }

  async presentActionSheet(uid) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Message',
          icon: 'text',
          handler: () => {
            this.nav.navigateForward(['/chats', uid], true);
          }
        },
        {
          text: 'Remove from Friends',
          role: 'destructive',
          icon: 'remove-circle',
          handler: () => {
            this.presentAlertConfirm(() => {
                this.authService.removeFriend(uid);
                if(this.searchString != '')
                    this.searchString = '';
            });
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentAlertConfirm(fnOk) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure to want to remove friend?',
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

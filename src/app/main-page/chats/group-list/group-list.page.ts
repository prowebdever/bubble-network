import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserProfile } from '../../../models/user-profile.interface';
import { AuthService } from '../../../authentification/auth.service';
import { ChatData } from '../../../models/chat-data.interface';
import { ChatService } from '../../../services/chat.service';
import { ActivatedRoute } from "@angular/router";
import { Utils } from "../../../utils/utils";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.page.html',
  styleUrls: ['./group-list.page.scss'],
})
export class GroupListPage {
  users = [];
  chat: ChatData = new ChatData;
  public chat_id = '';
  private currentUser: UserProfile;

  constructor(
    private nav: NavController,
    private authService: AuthService,
    private chatService: ChatService,
    public route: ActivatedRoute,
  ) {
    this.chat_id = this.route.snapshot.params.id;
    this.authService.getCurrentUser(data=>{
        this.currentUser = data;
        this.chatService.getChat(this.chat_id, this.currentUser.uid, chat => {
            this.chat = chat;
            this.chat.users.forEach(uid=>{
                this.authService.getUser(uid).subscribe(snapshot => {
                    let doc:any = snapshot.payload.data();
                    let user = new UserProfile;
                    user = {...doc};
                    user.uid = snapshot.payload.id;
                    if(user.profileImage == '') user.profileImage = 'assets/empty-picture.png';
                    this.users.push(user);
                })
            })
        });
    });
  }

  ngOnInit(){ }

  gotoUserProfile(uid) {
    if(uid == this.currentUser.uid) {
        this.nav.navigateForward('/user/(profile:profile)');
    } else {
        this.nav.navigateForward(['/user-following', uid], true);
    }
  }
}

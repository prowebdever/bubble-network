import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInGuard } from './authentification/loddeg-in.guard';

import { MainContainerPage } from './main-page/main-container/main-container.page';
import { UserProfilePage } from './main-page/user-profile/user-profile.page';
import { UserBubblesPage } from './main-page/user-bubbles/user-bubbles.page';
import { UserFollowingPage } from './main-page/user-following/user-following.page';
import { PostImagePage } from './main-page/post-image/post-image.page';
import { PostVideoPage } from './main-page/post-video/post-video.page';
import { LiveVideoPage } from './main-page/live-video/live-video.page';
import { FriendVideoPage } from './main-page/live-video/friend-video/friend-video.page';
import { VideoListPage } from './main-page/live-video/video-list/video-list.page';
import { ChatsPage } from './main-page/chats/chats.page';
import { ChatPage } from './main-page/chats/chat/chat.page';
import { AddGroupPage } from './main-page/chats/add-group/add-group.page';
import { AddFriendPage } from './main-page/chats/add-friend/add-friend.page';
import { GroupListPage } from './main-page/chats/group-list/group-list.page';
import { AddBlockPage } from './main-page/add-block/add-block.page';
import { ReportPage } from './main-page/report/report.page';

import { SigninComponent } from './authentification/signin/signin.component';
import { SignupComponent } from './authentification/signup/signup.component';
import { PassRecoveryComponent } from './authentification/pass-recovery/pass-recovery.component';
import { LoggedOutGuard } from './authentification/logged-out.guard';
import { FollowersPage } from './user/followers/followers.page';
import { FollowingsPage } from './user/followings/followings.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainContainerPage,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'video-list',
    component: VideoListPage,
    canActivate: [LoggedInGuard]
  },
  {
      path: 'user-profile/:id',
      component: UserProfilePage,
      canActivate: [LoggedInGuard]
  },
  {
      path: 'user-bubbles/:id',
      component: UserBubblesPage,
      canActivate: [LoggedInGuard]
  },
  {
      path: 'user-following/:id',
      component: UserFollowingPage,
      canActivate: [LoggedInGuard]
  },
  {
     path: 'post-image',
     component: PostImagePage,
     canActivate: [LoggedInGuard]
  },
  {
     path: 'post-video',
     component: PostVideoPage,
     canActivate: [LoggedInGuard]
  },
  {
       path: 'live-video',
       component: LiveVideoPage,
       canActivate: [LoggedInGuard]
  },
  {
    path: 'followers/:id',
    component: FollowersPage,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'following/:id',
    component: FollowingsPage,
    canActivate: [LoggedInGuard]
  },
  {
    path: '',
    loadChildren: './user/tabs.module#TabsPageModule',
    canActivate: [LoggedInGuard]
  },
  {
    path: 'chats',
    component: ChatsPage,
    canActivate: [LoggedInGuard]
  },
  {
      path: 'chat/:mode/:id',
      component: ChatPage,
      canActivate: [LoggedInGuard]
  },
  {
      path: 'group-list/:id',
      component: GroupListPage,
      canActivate: [LoggedInGuard]
  },
  {
      path: 'friend-video/:id',
      component: FriendVideoPage,
      canActivate: [LoggedInGuard]
  },
  {
      path: 'video-list',
      component: VideoListPage,
      canActivate: [LoggedInGuard]
  },
  {
    path: 'welcome',
    children: [
      {
        path: '',
        component: SigninComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'recovery',
        component: PassRecoveryComponent
      }
    ],
    canActivate: [LoggedOutGuard]
  },
  { path: 'add-group', component: AddGroupPage, canActivate: [LoggedInGuard] },
  { path: 'add-friend', component: AddFriendPage, canActivate: [LoggedInGuard] },
  { path: 'add-block', component: AddBlockPage, canActivate: [LoggedInGuard] },
  { path: 'report', component: ReportPage, canActivate: [LoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { ProfilePage } from './profile/profile.page';
import { ActivityPage } from './activity/activity.page';
import { FriendsPage } from './friends/friends.page';
import { FriendbubblePage } from './friendbubble/friendbubble.page';
import { SettingsPage } from './settings/settings.page';
import { SponsorAdPage } from './sponsor-ad/sponsor-ad.page';
import { ChangeBubblesPage } from './change-bubbles/change-bubbles.page';
import { EditBubblePage } from './edit-bubble/edit-bubble.page';

const routes: Routes = [
  {
    path: 'user',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/user/(profile:profile)',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        outlet: 'profile',
        component: ProfilePage
      },
      {
        path: 'activity',
        outlet: 'activity',
        component: ActivityPage
      },
      {
        path: 'friends',
        outlet: 'friends',
        component: FriendsPage
      },
      {
        path: 'friendbubble',
        outlet: 'friendbubble',
        component: FriendbubblePage
      },
      {
        path: 'settings',
        outlet: 'settings',
        component: SettingsPage
      },
      {
        path: 'sponsor-ad',
        outlet: 'sponsor-ad',
        component: SponsorAdPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/user/(profile:profile)',
    pathMatch: 'full'
  },
  { path: 'user-friends', component: FriendsPage },
  { path: 'change-bubbles', component: ChangeBubblesPage },
  { path: 'edit-bubble/:id', component: EditBubblePage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

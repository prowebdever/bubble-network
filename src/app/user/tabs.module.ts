import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CommonComponentsModule } from '../common/common.module';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';

import { AppHeaderComponent } from './app-header/app-header.component';
import { ProfilePageModule } from './profile/profile.module';
import { ActivityPage } from './activity/activity.page';
import { FriendsPage } from './friends/friends.page';
import { FriendbubblePage } from './friendbubble/friendbubble.page';
import { SettingsPage } from './settings/settings.page';
import { SponsorAdPage } from './sponsor-ad/sponsor-ad.page';
import { ChangeBubblesPage } from './change-bubbles/change-bubbles.page';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { EditBubblePage } from './edit-bubble/edit-bubble.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ProfilePageModule,
    CommonComponentsModule,
  ],
  declarations: [
    ActivityPage,
    FriendsPage,
    FriendbubblePage,
    SettingsPage,
    SponsorAdPage,
    TabsPage,
    ChangeBubblesPage,
    AppHeaderComponent,
    PaymentFormComponent,
    EditBubblePage
  ],
  entryComponents: [ChangeBubblesPage, PaymentFormComponent, EditBubblePage]
})
export class TabsPageModule {}

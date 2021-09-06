import { IonicModule } from "@ionic/angular";

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MainHeaderComponent } from "./main-header/main-header.component";
import { FooterComponent } from "./footer/footer.component";
import { BubblePostComponent } from "./bubble-post/bubble-post.component";
import { BubblesContainerComponent } from "./bubbles-container/bubbles-container.component";
import { LiveVideoBadgeComponent } from "./live-video-badge/live-video-badge.component";
import { SearchFilterPipe } from './search-filter.pipe';
import { UploadService } from '../services/upload.service';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [
    FooterComponent,
    BubblePostComponent,
    BubblesContainerComponent,
    LiveVideoBadgeComponent,
    SearchFilterPipe,
    MainHeaderComponent
  ],
  providers: [
    UploadService
  ],
  entryComponents: [BubblePostComponent],
  exports: [FooterComponent, BubblePostComponent, BubblesContainerComponent, SearchFilterPipe, MainHeaderComponent, LiveVideoBadgeComponent]
})
export class CommonComponentsModule {}

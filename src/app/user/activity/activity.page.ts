import { Component, OnInit, ViewChild } from '@angular/core';
import { BubbleData } from '../../models/bubble-data.interface';
import { Utils } from '../../utils/utils';
import { BubblesService } from '../../services/bubbles.service';
import { BubblesContainerComponent } from '../../common/bubbles-container/bubbles-container.component';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage {
    @ViewChild(BubblesContainerComponent) child:BubblesContainerComponent;
    public bubbles:BubbleData[] = [];
  bubblesStopped = false;

  constructor(private bubblesService: BubblesService) { }

  ionViewWillEnter(){
    this.initBubbles();
  }

  initBubbles() {
    this.bubbles = [];
    this.bubblesService.getActivity()
    .subscribe(data => {
          Utils.addBubbles(data, this.bubbles, this.bubblesService, () => {
             this.child.initAnimation();
          });
       }
    );
  }
}

import { Component, OnInit, Input, Output, ElementRef, ViewChildren, QueryList, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../authentification/auth.service';
import { AdData } from '../../models/ad-data.interface';
import { PopoverController, ToastController, NavController } from '@ionic/angular';
import { BubblePostComponent } from '../bubble-post/bubble-post.component';
import { BubblesService } from '../../services/bubbles.service';
import { UserProfile } from '../../models/user-profile.interface';
import { Utils } from '../../utils/utils';
import { BubbleData } from '../../models/bubble-data.interface';
declare var $: any;

@Component({
  selector: 'app-bubbles-container',
  templateUrl: './bubbles-container.component.html',
  styleUrls: ['./bubbles-container.component.scss'],
  entryComponents: [BubblePostComponent]
})

export class BubblesContainerComponent implements OnInit {
    @Input() files;
    @Output() childEvent = new EventEmitter();
    @ViewChildren('beaker') bubbleElements: QueryList<ElementRef>;
    @ViewChildren('scene') sceneElement: QueryList<ElementRef>;

  currentUser: UserProfile;
  random = Math.random;
  toNumber = Number;
  showedStartToast = false;
  fileStorage: BubbleData[] = [];
  currentRoute = '';

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    public toastController: ToastController,
    private nav: NavController,
    public popoverCtrl: PopoverController,
    private bubblesService: BubblesService,
    private elementRef: ElementRef
  ) {
    this.currentRoute = this.activatedRoute.snapshot.url[0].path;
    this.authService.getCurrentUser(
      user_data => {
        this.currentUser = user_data;
      },
      null
    );
  }

  ngOnInit(): void {
  }

  initAnimation() {
    // Keyframes
    let balls = this.elementRef.nativeElement;
    let scene = this.sceneElement.toArray()[0];
    let parent = {
        width: scene.nativeElement.offsetWidth,
        height: scene.nativeElement.offsetHeight
    }
    $('.bubble-scene').hide();
    setTimeout(() =>{
        let balls = this.bubbleElements.toArray();
        balls.forEach((el, i, ra) => {
          let offset = {
            top: el.nativeElement.offsetTop,
            left:  el.nativeElement.offsetLeft
          };

          let to = {
            x: Math.random() * (i % 3 === 0 && offset.left > 11 ? -11 : 11),
            y: Math.random() * 100
          };
          let anim = el.nativeElement.animate(
            [
              { transform: "translate(0, 0)" },
              { transform: "translate(" + to.x + "rem, " + to.y + "vh" }
            ],
            {
              duration: (Math.random() + 2) * 2000, // random duration
              direction: "alternate",
              fill: "both",
              iterations: 'Infinity',
              easing: "ease-in-out"
            }
          );
        });
        $('.bubble-scene').delay(1000).fadeIn('slow');
    }, 300);
  }

  async onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 100) {
      const toast = await this.toastController.create({
        message: 'Yes, I see your good start!',
        showCloseButton: true,
        duration: 2000,
        position: 'top'
      });
      toast.present();
      this.showedStartToast = true;
    }
  }

  initBubbles() {
    console.log('current path:', this.currentRoute);
    if (this.currentRoute === 'activity') {
          this.bubblesService.getActivity()
            .subscribe(
             data => {
                 data.forEach(
                   ad => {
                     const _doc = ad.payload.doc;
                     let bubble = Utils.getBubbleData('ad', _doc.id, _doc.data());
                     if(bubble)this.addBubbleToScene(bubble);
                   });
               }
            );
        }
    else if (this.currentRoute === 'profile') {
      this.bubblesService.getProfiles()
        .subscribe(
          data => {
            data.forEach(
              ad => {
                  const _doc = ad.payload.doc;
                  const user = _doc.data();
                  if(user.uid != this.currentUser.uid) {
                    let _user = Utils.getBubbleUserData(user);
                    if(_user) this.addBubbleToScene(_user);
                  }
              });
          }
        );
    } else if (this.currentRoute === 'friendbubble') {
      this.authService.getUsersFromIDs(this.currentUser.friends,
        user => {
            let _user = Utils.getBubbleUserData(user);
            if(_user)this.addBubbleToScene(_user);
        });
    } else {
      this.bubblesService.getBubbles()
        .subscribe(
          data => {
            data.forEach(
              ad => {
                const _doc = ad.payload.doc;
                let bubble = Utils.getBubbleData('ad', _doc.id, _doc.data());
                if(bubble) this.addBubbleToScene(bubble);
              });
          }
        );
    }
  }

  addBubbleToScene(bubble: BubbleData) {
/*    const scene_tag = document.querySelector('#bubble-scene');        // console.log(scene_tag);
    const winWidth = scene_tag.clientWidth;
    const winHeight = scene_tag.clientHeight;
    bubble.xpos = Math.random() * (winWidth - 100);
    bubble.ypos = Math.random() * (winHeight - 100);
    //    bubble.zpos = Math.ceil(Math.random() * 24 + 1);
    bubble.direct = Math.random() * 6.2831853;
*/    this.files.push(bubble);
  }

  startAnimation() {
/*    return setInterval(
      () => {
        const scene_tag = document.querySelector('#bubble-scene');        // console.log(scene_tag);
        const winWidth = scene_tag.clientWidth;
        const winHeight = scene_tag.clientHeight;
        this.files.forEach(
          bubble => {
            const ac = (Math.max(Math.abs(bubble.xpos - 50), Math.abs(bubble.ypos - 50)) + 50) / 100;
            bubble.direct += (Math.random() * 0.02 - 0.01);
            bubble.xpos += ac * Math.cos(bubble.direct);
            bubble.ypos += ac * Math.sin(bubble.direct);
            if (bubble.xpos < 0) {
              bubble.xpos = 0;
              bubble.direct = 3.141592654 - bubble.direct;
            } else if (bubble.xpos > (winWidth - 100)) {
              bubble.xpos = winWidth - 100;
              bubble.direct = -(3.141592654 - bubble.direct);
            }
            if (bubble.ypos < 0) {
              bubble.ypos = 0;
              bubble.direct = -bubble.direct;
            } else if (bubble.ypos > (winHeight - 100)) {
              bubble.ypos = winHeight - 100;
              bubble.direct = -bubble.direct;
            }
            if (bubble.direct > 6.2831853) {
              bubble.direct -= 6.2831853;
            } else if (bubble.direct < 0) {
              bubble.direct += 6.2831853;
            }
          }
        );
      },
      100
    );
    */  }

  conserveBubbles() {
    this.fileStorage = this.files;
    this.files = [];
  }

  activateBubbles() {
    this.files = this.fileStorage;
    this.fileStorage = [];
  }

  async openBubble(file: BubbleData) {
    if(this.currentUser.blocks.indexOf(file.uid)>-1) {
        const toast_msg = await this.toastController.create({
          message: 'This user is blocked',
          showCloseButton: false,
          duration: 2000,
          position: 'top'
        });
        toast_msg.present();
        return;
    }
    if (file.type === 'ad') {
      this.conserveBubbles();
      const ad_data = file.adData;
      const ad_uid = file.uid;
      const popover = await this.popoverCtrl.create({
        component: BubblePostComponent,
        componentProps: { uid: file.uid, ad: file.adData, popoverController: this.popoverCtrl },
        translucent: true
      });
      popover.onDidDismiss().then(() => {
        this.childEvent.emit();
      });
      return await popover.present();
    } else if (file.type === 'profile' || file.type === 'friend') {
      const user_data = file.userData;
      if(user_data.uid == this.currentUser.uid) {
        this.navigate('/user/(settings:settings)');
      } else {
        this.navigate('/user-following/' + user_data.uid);
      }
    }
  }

  public navigate(link: string) {
    this.nav.navigateForward(link);
  }
}

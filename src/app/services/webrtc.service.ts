import { Injectable, NgZone } from '@angular/core';
import { UserProfile } from '../models/user-profile.interface';
import { AuthService } from '../authentification/auth.service';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root'
})

export class WebrtcService {
  constraints: MediaStreamConstraints = {video: true, audio: false};
  peer: Peer;
  user: UserProfile;
  myStream: MediaStream;
  myEl: HTMLMediaElement;
  partnerId = '';
  error_msg = '';
  callback = null;

  options: Peer.PeerJSOption;

  constructor(
    private zone: NgZone,
    private authService: AuthService
  ) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    this.options = {  // not used, by default it'll use peerjs server
      //key: 'cd1ft79ro8g833di',
      host: 'peerjs-server.herokuapp.com',
      port: 443,
      secure: true,
      debug: 3
    };
  }

  async init(user: UserProfile, myEl: HTMLMediaElement, partnerId: string, callback) {
    this.clearError();
    this.user = user;
    this.myEl = myEl;
    this.partnerId = partnerId;
    this.error_msg = '';
    this.callback = callback;
    try {
      this.getMedia();
      await this.createPeer();
    } catch (e) {
      this.handleError(e);
      this.callback(true);
    }
  }

  close(callback) {
    this.peer = null;
    this.authService.updatePeerId('');
    callback();
  }

  getMedia() {
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then( (stream) => {
            this.handleSuccess(stream);
        })
        .catch(error => {
            this.handleError(error);
            this.callback(true);
        });
  }

  async createPeer() {
    this.peer = new Peer(this.options);
    this.peer.on('open', () => {
       this.authService.updatePeerId(this.peer.id);
       if(this.partnerId == ''){
            if(this.callback != null) {
                this.callback(false);
                this.zone.run(()=>{});
            }
            this.wait();
       } else {
            this.call();
       }
    });
  }

  call() {
    const call = this.peer.call(this.partnerId, this.myStream);
    call.on('stream', (stream) => {
      this.myEl.srcObject = stream;
      this.zone.run(()=>{});
    });
  }

  wait() {
    this.peer.on('call', (call) => {
      call.answer(this.myStream);
    });
  }

  handleSuccess(stream: MediaStream) {
    this.myStream = stream;
    if(this.partnerId == '') {
        this.myEl.muted = true;
        this.myEl.volume = 0;
        this.myEl.srcObject = stream;
    }
  }

  handleError(error: any) {
    let msg = '';
    if (error.name === 'ConstraintNotSatisfiedError') {
      //const v = this.constraints.video;
     // this.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
      msg = `The resolution px is not supported by your device.`;
    } else if (error.name === 'PermissionDeniedError') {
      msg = 'Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.';
    }
    this.error_msg = msg + error.message;
    console.log(this.error_msg);
    this.zone.run(()=>{});
  }

  getError() {return this.error_msg}
  clearError(){
    this.error_msg = '';
    this.zone.run(()=>{});
  }
}
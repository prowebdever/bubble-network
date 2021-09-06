import * as firebase from 'firebase';
import { UserProfile } from '../models/user-profile.interface';
import { BubbleData } from '../models/bubble-data.interface';
import { AdData } from '../models/ad-data.interface';
import { CameraOptions, PictureSourceType, DestinationType,EncodingType, MediaType} from '@ionic-native/camera/ngx';

export class Utils {
    public static cameraAllowEdit = true;
    public static cameraTargetWidth = 300;
    public static cameraTargetHeight = 300;

    public static getCameraPictureOption(sourceType: PictureSourceType) {
        var options: CameraOptions = {
             quality: 100,
             sourceType: sourceType,
             destinationType: DestinationType.DATA_URL, //FILE_URI
             encodingType: EncodingType.PNG,
             mediaType: MediaType.PICTURE,
             saveToPhotoAlbum: false,
             correctOrientation: true,
             allowEdit : Utils.cameraAllowEdit
        };
        return options;
    }

    public static getCameraVideoOption(sourceType: PictureSourceType, destinationType: any) {
        var options: CameraOptions = {
            quality: 50,
            sourceType: sourceType,
            destinationType: destinationType,
            mediaType: MediaType.VIDEO,
            saveToPhotoAlbum: false,
            correctOrientation: true,
        };
        return options;
    }

    public static getCaptureVideoOptions(limit) {
        let options = {
            limit: limit,
            width: Utils.cameraTargetWidth,
            height: Utils.cameraTargetHeight
        }
        return options;
    }

    public static numberWithSpaces(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    public static getUserProfile(data:any, uid=null):UserProfile {
        let newUser = {...(new UserProfile), ...data};
        if(!newUser.uid && data.id) newUser.uid = data.id;
        if(!newUser.uid && uid) newUser.uid = uid;
        if (newUser.banner === undefined || newUser.banner === '') {
          newUser.banner = '/assets/def-banner.jpg';
        }
        if (newUser.profileImage === undefined || newUser.profileImage === '') {
          newUser.profileImage = '/assets/empty-picture.png';
        }
        return newUser;
    }

    public static getBubbleData(type, uid, data:any):BubbleData {
        if(typeof data.blocked !== 'undefined' && data.blocked) {
            return null;
        }
        let newData = {...(new BubbleData), ...data};
        //if(data.videoUrl) newData.imageURL = 'assets/play_video.png';
        newData.type = type;
        newData.uid = uid;
        if(typeof data.package_price !== 'undefined' && typeof data.package_duration !== 'undefined' && typeof data.date !== 'undefined') {
            let duration = data.package_duration;
            let date = data.date;
            let diff = this.timeDifference(Date.now(), date);
            if(diff.days <= duration*7) {
                if(data.package_price == 1) {
                    newData.starsAnimation = true;
                }
                if(data.package_price == 10) {
                    newData.redBorderAnimation = true;
                }
                if(data.package_price == 20) {
                    newData.raysAnimation = true;
                }
                if(data.package_price == 50) {
                    newData.coloredLinesAnimation = true;
                }
            }
        }
        newData.animationDelay = Math.random().toFixed(2) + 's';
        newData.adData = {...data};
        return newData;
    }

    public static getBubbleUserData(user, type='user'):BubbleData {
        if(typeof user.status !== 'undefined' && user.status == 'blocked') {
            return null;
        }
        let _user:any = {};
        _user.imageURL = user.profileImage;
        if(!_user.imageURL) _user.imageURL = '/assets/empty-picture.png';
        _user.description = user.firstName + ' ' + user.lastName;
        _user.userData = {...user};
        return this.getBubbleData(type, user.uid, _user);
    }

    public static checkIsFollowing(currentUser, user_id) {
        if(currentUser) {
          let followings = currentUser.following;
          let index = followings.findIndex(item => item == user_id);
          return index>-1;
        }
        return false;
    }

    public static timeDifference(date1, date2) {
        //var difference = date1.getTime() - date2.getTime();
        var difference = date1 - date2;
        var daysDifference = 0, hoursDifference = 0, minutesDifference = 0, secondsDifference = 0;

        if(difference > 0) {
            daysDifference = Math.floor(difference/1000/60/60/24);
            difference -= daysDifference*1000*60*60*24
            if(difference > 0) {
                hoursDifference = Math.floor(difference/1000/60/60);
                difference -= hoursDifference*1000*60*60

                if(difference > 0) {
                    minutesDifference = Math.floor(difference/1000/60);
                    difference -= minutesDifference*1000*60
                    if(difference > 0) {
                        secondsDifference = Math.floor(difference/1000);
                    }
                }
            }
        }
        return {
            days: daysDifference,
            hours: hoursDifference,
            minutes: minutesDifference,
            seconds: secondsDifference
        };
    }

    public static getFormatDateTime(unix_timestamp) {
        if(!unix_timestamp) return '';
         // Months array
         var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

         // Convert timestamp to milliseconds
         var date = new Date(unix_timestamp);

         // Year
         var year = date.getFullYear();

         // Month
         var month = months_arr[date.getMonth()];

         // Day
         var day = date.getDate();

         // Hours
         var hours = date.getHours();

         // Minutes
         var minutes = "0" + date.getMinutes();

         // Seconds
         var seconds = "0" + date.getSeconds();

         // Display date time in MM-dd-yyyy h:m:s format
         var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

         return convdataTime;
    }

    public static getDiffTimezone() {
        var d = new Date(1970, 0, 1, 0, 0, 0, 0);
        //var n = d.getTimezoneOffset();
        //return n * 60 * 1000;
        return d.getTime();
    }

    public static getTimestamp() {
        return Date.now();// + Utils.getDiffTimezone();
    }

    public static getChatTime(unix_timestamp) {
         if(!unix_timestamp) return '';
         var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
         //unix_timestamp -= Utils.getDiffTimezone();
         // Convert timestamp to milliseconds
         var date = new Date(unix_timestamp);
         // Year
         var year = date.getFullYear();
         // Month
         var month = months_arr[date.getMonth()];
         // Day
         var day = date.getDate();
         // Hours
         var hours = date.getHours();
         var a = 'AM';
         if(hours > 12) {
            hours -= 12;
            a = 'PM';
         }
         // Minutes
         var minutes = '0' + date.getMinutes();

         // Display date time in MM-dd-yyyy h:m:s format
         return day + ' ' + month + ' ' + year + ' '+ hours + ':' + minutes.substr(-2) + ' ' + a;
    }

    public static addBubbles(data, bubbles, authService, callback) {
        data.forEach((ad, index) => {
            const _doc = ad.payload.doc;
            let new_ad = Utils.getBubbleData('ad', _doc.id, _doc.data());
            if(new_ad) {
                if(!new_ad.imageURL && new_ad.videoUrl && new_ad.adData && new_ad.adData.userId) {
                    authService.getUser(new_ad.adData.userId).subscribe(
                        data1 => {
                            const user1: any = data1.payload.data();
                            if(user1.profileImage) {
                                new_ad.imageURL = user1.profileImage;
                            } else {
                                new_ad.imageURL = '/assets/empty-picture.png';
                            }
                            bubbles.push(new_ad);
                            if(index == data.length-1) {
                                callback();
                            }
                        }
                    );
                } else {
                    bubbles.push(new_ad);
                    if(index == data.length-1) {
                        callback();
                    }
                }
            }
        });
    }

    public static getAdData(uid, data:any):AdData {
        let newData = {...(new AdData), ...data};
        newData.uid = uid;
        if(typeof data.package_price !== 'undefined' && typeof data.package_duration !== 'undefined' && typeof data.date !== 'undefined') {
            let duration = data.package_duration;
            let date = data.date;
            let diff = this.timeDifference(Date.now(), date);
            if(diff.days <= duration*7) {
                if(data.package_price == 1) {
                    newData.starsAnimation = true;
                }
                if(data.package_price == 10) {
                    newData.redBorderAnimation = true;
                }
                if(data.package_price == 20) {
                    newData.raysAnimation = true;
                }
                if(data.package_price == 50) {
                    newData.coloredLinesAnimation = true;
                }
            }
        }
        newData.animationDelay = Math.random().toFixed(2) + 's';
        return newData;
    }

    public static addAds(data, bubbles, authService, callback) {
        data.forEach((ad, index) => {
            const _doc = ad.payload.doc;
            let new_ad = Utils.getAdData(_doc.id, _doc.data());
            if(new_ad) {
                if(!new_ad.imageURL && new_ad.videoUrl && new_ad.userId) {
                    authService.getUser(new_ad.userId).subscribe(
                        data1 => {
                            const user1: any = data1.payload.data();
                            if(user1.profileImage) {
                                new_ad.imageURL = user1.profileImage;
                            } else {
                                new_ad.imageURL = '/assets/empty-picture.png';
                            }
                            bubbles.push(new_ad);
                            if(index == data.length-1) {
                                callback();
                            }
                        }
                    );
                } else {
                    bubbles.push(new_ad);
                    if(index == data.length-1) {
                        callback();
                    }
                }
            }
        });
    }
}

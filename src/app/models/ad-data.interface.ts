export class AdData {
    uid = '';
  animationDelay = 0;
  author = '';    //
  comments: Comment[] = [];  // default = [{author:'',date:'',text:''}]
  date = 0;      // date:timestamp
  description = '';
  imageURL = '';
  image_filename = '';
  likes = [];   // string array, uid list of the users interested in this.
  likes_count = 0;
  thumbnailURL = '';
  userId = '';
  videoUrl = '';
  video_filename = '';
  package_price = 0;
  package_duration = 0;
  package = '';
}

export class Comment {
  author: string;
  text: string;
  date: string;
}

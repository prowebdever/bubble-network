export class BubbleData {
    type: string = '';   // user, ad
    uid: string = '';
    imageURL: string = '';
    videoUrl: string = '';
    description: string = ''; // full name, discription
    animationDelay = 0;
    redBorderAnimation = false;
    starsAnimation = false;
    raysAnimation = false;
    coloredLinesAnimation = false;

    adData: any = {};
    userData: any = {};

    likes:string[] = [];

//    xpos: number;
//    ypos: number;
//    zpos: number;
//    direct: number;
}

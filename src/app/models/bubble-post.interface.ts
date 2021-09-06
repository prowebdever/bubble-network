export interface BubblePost {
  author: string;
  date: string;
  likes: number;
  likesArray: [""];
  url: string;
  description: string;
  comments: Comment[];
  userRef: any;
  bubbleId: string
}
export interface Comment {
  author: string;
  text: string;
  date: string;
}
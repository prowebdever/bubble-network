export class UserProfile {
    uid = '';
    firstName = '';
    lastName = '';
    username = '';
    email = '';
    birthday: { day: '', month: '', year: ''};
    gender = 'Male';
    job = '';
    country = '';
    interest = '';
    isVerified = false;
    status = 'free'; // free, guest, member, master, admin
    websiteLink = '';
    profileImage = '';
    profileImage_filename = '';
    banner = '';
    banner_filename = '';
    sponsoredOnce = false;
    pinnedChat = '';
    followers: string[] = [];
    following: string[] = [];
    friends: string[] = [];
    blocks:string[] = [];
    token: '';
    peer_id: '';
}

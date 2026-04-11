export interface Message {
  id?: string;
  authorName: string;
  content: string;
  createdAt: any; // Timestamp
  authorPhoto?: string;
  authorUid: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
}

export interface Photo {
  id?: string;
  url: string;
  caption: string;
  year: string;
  createdAt: any;
  authorUid: string;
}

export interface Song {
  title: string;
  artist: string;
  url: string;
  cover: string;
}

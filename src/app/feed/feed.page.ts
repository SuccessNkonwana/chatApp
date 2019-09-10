import { Component, OnInit, ViewChild } from '@angular/core';
// import { Component, OnInit, } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Http } from '@angular/http';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  mainuser: AngularFirestoreDocument
	userPosts
	sub
  posts
  uid
	username: string
	profilePic: string
  text: any;
  chatRef;
  imageURL: string
	desc: string
  noFace: boolean = false
  busy: boolean = false

  postID: string
	effect: string = ''
	post
	postReference: AngularFirestoreDocument
  
  constructor(private afs: AngularFirestore,
    private afAuth: AngularFireAuth, 
    private user: UserService, 
    private socialSharing: SocialSharing,
    private router: Router) {
    this.uid=localStorage.getItem('userid');
    this.chatRef=this.afs.collection('chats',ref=>ref.orderBy('Timestamp')).valueChanges();
  
    this.mainuser = afs.doc(`users/${user.getUID()}`)
		this.sub = this.mainuser.valueChanges().subscribe(event => {
			this.posts = event.posts
			this.username = event.username
      this.profilePic = event.profilePic
     this.uid=this.user.getUID();
		})
	}

	ngOnDestroy() {
		this.sub.unsubscribe()
	}

	goTo(postID: string) {

		this.router.navigate(['/tabs/post/' + postID.split('/')[0]])
	}
  send(){
    
    if(this.text != ''){
      this.afs.collection('chats').add({
         Name:this.username,
        Message:this.text,
        UserID:this.afAuth.auth.currentUser.uid,
        Timestamp:firebase.firestore.FieldValue.serverTimestamp(),
      });
        this.text='';
        
       
    }
  
  }
  
    share(chat){
      this.socialSharing.share(chat.Message).then(() => {
       
      }).catch(() => {
        
      });
    }
  
	ngOnInit() {
   
	}
}

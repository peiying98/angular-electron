import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from 'angularfire2/firestore';
import { Query } from '@angular/core/src/metadata/di';
import { RouterModule, Router } from '@angular/router';
import {UserDataService} from '../../service/user-data.service'

@Injectable()
export class ChatService {
chatrooms: any;

  constructor(
    private afs: AngularFirestore,
    public router: Router,
    private userdatasvc: UserDataService,
  ) { 


    
  }

  // Initiating chat
  initiateChat( UserID, OtherUserID){
  this.afs.collection(`chatrooms`).add({ 
    user1 : UserID ,
    user2 : OtherUserID,
    timestamp: Math.floor(Date.now() / 1000) }).then( 
      chat => {
      this.afs.doc(`users/${UserID}/chatrooms/${chat.id}`).set({ 
        user1 : UserID , 
        user2 : OtherUserID, 
        timestamp: Math.floor(Date.now() / 1000), 
        chatroomID: chat.id})
  
      this.userdatasvc.getUserDocDirect(UserID).take(1).subscribe(
        data => {
          this.afs.doc(`users/${OtherUserID}/chatrooms/${chat.id}`).set({ 
            user1 : UserID , 
            user2 : OtherUserID, 
            timestamp: Math.floor(Date.now() / 1000),
            chatroomID: chat.id,
            chatwith: data.firstName })

    });
    this.router.navigate([`/inbox/${chat.id}`]);
  });
  }

  // return user chatroom list
  getUserChatrooms(user){
    // return this.afs.collection(`users/${user}/chatrooms`).valueChanges();
    return this.afs.collection(`users/${user}/chatrooms` , ref => {
      return ref.orderBy('isRead').orderBy('timestamp' , 'desc')}).valueChanges();
  }

  checkChatrooms(user, PitchID){
    // return this.afs.collection(`users/${user}/chatrooms`).valueChanges();
    return this.afs.collection(`users/${user}/chatrooms` , ref => {
      return ref.where('PitchID', '==', PitchID)}).valueChanges();
  }

  getGlobalChatrooms(chatroomID){
    return this.afs.doc(`chatrooms/${chatroomID}`).valueChanges();
  }

  getMessagesData(chatroomID){
    return this.afs.collection(`chatrooms/${chatroomID}/messages`).valueChanges();
  }

  getMessages(chatroomID){
    return this.afs.collection(`chatrooms/${chatroomID}/messages` , ref => {
      return ref.orderBy('timestamp' , 'desc').limit(15)});
  }


  sendMessage( content, senderID , senderName , senderPhoto  , chatroomID  , user1, user2 ){

    const timestamp = Date.now();
    // send messages and timpestamp to chatroom
    this.afs.doc(`chatrooms/${chatroomID}`).update({ 
      timestamp: timestamp, 
      LatestChat: content, 
      LatestPoster: senderName, 
      isRead: false });  

    this.afs.collection(`chatrooms/${chatroomID}/messages`).add({ 
      content : content, 
      senderName: senderName, 
      senderID : senderID, 
      senderPhoto: senderPhoto, 
      chatroomID: chatroomID, 
      timestamp: timestamp });
    
    // update chatroom data on both user sides   
    this.afs.doc(`users/${user2}/chatrooms/${chatroomID}`).update({ 
      timestamp: timestamp, 
      LatestChat: content , 
      LatestPoster: senderName, 
      isRead: true} );

    this.afs.doc(`users/${user1}/chatrooms/${chatroomID}`).update({ 
      timestamp: timestamp, 
      LatestChat: content, 
      LatestPoster: senderName, 
      isRead: true} );

    if (user1 === senderID)
    {
      this.afs.doc(`users/${user2}/chatrooms/${chatroomID}`).update({  
        isRead: false});

      this.userdatasvc.getUserDocDirect(user2).take(1).subscribe(
        data => {
          this.afs.doc(`users/${user2}`).update({
            Notification : data.Notification + 1 });
        });
    }

    if (user2 === senderID)
    {
      this.afs.doc(`users/${user1}/chatrooms/${chatroomID}`).update({
        isRead: false} );

      this.userdatasvc.getUserDocDirect(user1).take(1).subscribe(
        data => {
          this.afs.doc(`users/${user1}`).update({ 
            Notification : data.Notification + 1 });
        });
    }
  }

// checkNewMessages(user){
//   this.afs.collection(`users/${user}`)
// }

  clearNotification(user){
    this.afs.doc(`users/${user}`).update({ 
      Notification : 0 });
  }

  setisRead(chatroomID, user1 , user2 , currentuser){

    if (currentuser === user1) { 
      this.afs.doc(`users/${user1}/chatrooms/${chatroomID}`).update({ 
        isRead: true} );
    }else if(currentuser === user2){ 
      this.afs.doc(`users/${user2}/chatrooms/${chatroomID}`).update({ 
        isRead: true} );
      }
    }

}

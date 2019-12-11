import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from 'angularfire2/firestore';
import { RouterModule, Router } from '@angular/router';

@Injectable()
export class ChallengeService {
  currentUser: any;
  constructor(   
    private afs: AngularFirestore,
    private router: Router) { }

    PostChallenge( data){
      console.log("pitch submitted");
      {
      this.afs.collection(`challenges`).add(data).then( key =>
        {
          alert('success')
          this.afs.doc(`challenges/${key.id}`).set(data);
          this.router.navigate([`/challenge/view/${key.id}`]);

        })
      }
    }

    getChallenge(id){
      return this.afs.doc(`challenges/${id}`).valueChanges()
    }
    
    getChallengeSubmissions(id){
      return this.afs.collection(`challenges/${id}/submissions`).valueChanges()
    }

    saveInterest(challengeID, userID){
      this.afs.doc(`challenges/${challengeID}/interest/${userID}`).set({
        userID: userID
      }) 
    }

    getInterest(id){
      return this.afs.collection(`challenges/${id}/interest/`);
    }

    sendMessage(data,challengeID){
      this.afs.collection(`challenges/${challengeID}/messages/`).add(data) 
    }

    getMessages(challengeID){
      return this.afs.collection(`challenges/${challengeID}/messages/` , ref => {return ref.orderBy('TimeStamp' , 'desc')}).valueChanges()
    }
}

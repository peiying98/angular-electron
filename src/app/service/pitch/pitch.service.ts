import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from 'angularfire2/firestore';
import { RouterModule, Router } from '@angular/router';

@Injectable()
export class PitchService {
  currentUser: any;

  constructor(    
 
    private afs: AngularFirestore,
    private router: Router
    )
    {
     
      }

PostPitch(user, data){
  console.log("pitch submitted");
 this.afs.collection(`users/${user.uid}/pitches`).add(data).then( key =>
  {
    this.afs.doc(`pitches/${key.id}`).set(data);
    this.afs.doc(`pitches/${key.id}`).set({PitchID: key.id} , {merge: true});
    this.afs.doc(`users/${user.uid}/pitches/${key.id}`).set( {PitchID : key.id} , {merge:true})
    this.router.navigate([`/pitch/view/${key.id}`]);
  })
}

savePitchSubmissionToChallenges(challengeID,pitchID, userID){
  this.afs.collection(`challenges/${challengeID}/submissions/`).add({
    PitchID: pitchID
  })
  this.afs.collection(`users/${userID}/submissions/`).add( {PitchID : pitchID , ChallengeID:challengeID })
}

checkPitchSumbission(challengeID,pitchID){
  return this.afs.collection(`challenges/${challengeID}/submissions/` , ref => {return ref.where('PitchID', '==', pitchID)}).valueChanges();

}

getPitch(PitchID){
  return this.afs.doc(`pitches/${PitchID}`).valueChanges();
}

getUserPitches(user)
{
    return this.afs.collection(`users/${user}/pitches`).valueChanges(); 
}

saveInterest(PitchID, userID){
  this.afs.doc(`pitches/${PitchID}/interest/${userID}`).set({
    userID: userID
  })
}

getInterest(PitchID){
  return this.afs.collection(`pitches/${PitchID}/interest/`);
}

}

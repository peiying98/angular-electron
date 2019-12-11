import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from 'angularfire2/firestore';
import { RouterModule, Router } from '@angular/router';

@Injectable()
export class PaasService {

  constructor(   
    private afs: AngularFirestore,
    private router: Router) { }


initiatePAAS(user,eventName,data){
  this.afs.doc(`PAAS/${eventName}`).set({
    userID: user.uid
  }).then(
  ()=>{
    this.afs.doc(`PAAS/${eventName}`).set(data, { merge: true })
  }
  ) 
}

checkPAASname(eventname){
   return this.afs.doc(`PAAS/${eventname}`).valueChanges()
}

}

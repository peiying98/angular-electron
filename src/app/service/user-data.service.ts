import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../service/auth.service';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from 'angularfire2/firestore';
import { User } from 'firebase/app';

@Injectable()
export class UserDataService {
userDoc: AngularFirestoreDocument<User>;
userDoc$: any;

  
constructor(    
    private afs: AngularFirestore,  
    private auth: AuthService) 
    { 
    
    }

    getUserDoc(user){
      this.userDoc = this.afs.doc(`users/${user.uid}`);
      this.userDoc$  = this.userDoc.valueChanges();
     return  this.userDoc$;
    }

    getUserDocDirect(user){
      this.userDoc = this.afs.doc(`users/${user}`);
      this.userDoc$  = this.userDoc.valueChanges();
     return  this.userDoc$;
    }
    getViewProfileUserDoc(user){
        this.userDoc = this.afs.doc(`users/${user}`);
        this.userDoc$  = this.userDoc.valueChanges();
       return  this.userDoc$;
      }
    getViewProfileUserPitchCol(user){
       return this.afs.collection(`users/${user}/pitches`).valueChanges();
        
      }

      getPitchSumibttedtoChallenges(userID){
        return this.afs.collection(`users/${userID}/submissions/`).valueChanges();
      }
}

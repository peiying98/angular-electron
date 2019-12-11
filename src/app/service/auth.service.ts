import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { HttpClient } from '@angular/common/http';

// custom user interface
interface User {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  about?: string;
  interest?: string;
  school?: string;
  work?: string;
  pitch?: string;
  competition?: string;
  profileImg?: string;
  TimeStamp?: number;
  Notification?: number;
}
@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  currentUser: any = '';
  errormsg: string;
  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private http: HttpClient,
              ) {
          // Define the user observable
          this.user = this.afAuth.authState;
       }

  emailSignUp(email: string, password: string) {

   return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  
       // create initial user document
    }

  // .then(user => {

  //   user.sendEmailVerification().then( data => {
  //     console.log('Email verification data', data)
  // }).catch(error => {
  //   console.log("Email verification error", error)
  //   // An error happened.
  // });

  sendHardWelcome(firstName, email, userid) {

    this.afs.doc(`users/${userid}`)
    .set({ isVerified: true }, { merge: true })
    .then(()=>{
      const triggerUrl = 'https://us-central1-pitchspot-main.cloudfunctions.net/sendHardWelcome';
      this.http.post(triggerUrl,
          {
              userFirstName: firstName,
              userEmail: email
          }).subscribe();
    });
  }


  private handleError(error) {
    error = this.errormsg;

  }

   emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  googleLogin() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(data => {
      this.afs.doc(`users/${data.user.uid}`).valueChanges().pipe().subscribe(
        exist => {
          if (!exist) {
          console.log('User doc exist');
          this.afs.doc(`users/${data.user.uid}`).set(
            { uid: data.user.uid,
              firstName: data.user.displayName,
              email: data.user.email,
              profileImg : data.user.photoURL,
              TimeStamp : Date.now()}, {merge: true}
          );
          this.sendHardWelcome(data.user.displayName, data.user.email, data.user.uid);
        }else {
          this.afs.doc(`users/${data.user.uid}`).set({
              profileImg : data.user.photoURL}, {merge: true}
          );
        }
        }
      );

    }).catch(error => this.handleError(error) );
  }


  fbLogin() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    .then(data => {
      this.afs.doc(`users/${data.user.uid}`).valueChanges().take(1).subscribe(

        () => {

          if (data.additionalUserInfo.isNewUser) {
          console.log('User doc exist');
          this.afs.doc(`users/${data.user.uid}`).set(
            { uid: data.user.uid,
              firstName: data.user.displayName,
              email: data.user.email,
              profileImg : data.user.photoURL,
              TimeStamp : Date.now()}, {merge: true}
          );

          this.sendEmailVerification(data.user.displayName, data.user.email)

        }else {
          this.afs.doc(`users/${data.user.uid}`).set(
            {
              profileImg : data.user.photoURL}, {merge: true}
          );
        }
        });

    }).catch(function(error) {
      // An error happened.
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert('This email has been registered. Please login with your email.');
      }
    });
  }

  getUser() {
   return this.user;
    }

    // copied from userDataServices, to avoid circular dependency
    getUserDocDirectWithUid(user){
        const userDoc : AngularFirestoreDocument<User> = this.afs.doc(`users/${user}`);
        let userDoc$ = userDoc.valueChanges();
        return  userDoc$;
    }

  signOut() {
    this.afAuth.auth.signOut()
    .then( () =>
    // this.router.navigate(['/'])
    window.location.href = '/login'
  );
  }
   // Update properties on the user document
   updateUser(user: User, data: any) {
    return this.afs.doc(`users/${user.uid}`).update(data);
  }

   updatePAASUser(user: User, data: any) {
    return this.afs.doc(`PAASusers/${user.uid}`).update(data);
  }

  public setUserDoc(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email || null,
      school: '' ,
      work: '',
      pitch: '0',
      competition: '0',
    profileImg : '',
    TimeStamp: Date.now(),
    Notification: 0,
  };
    return userRef.set(data);
  }
// function used to capture all user email. Used to fix the email capturing bug. Will need to remove this in future.
  setEmail(user) {
    this.afs.doc(`users/${user.uid}`).set({
     email: user.email.toLowerCase(),
    uid: user.uid } , {merge: true});
    }

setUserName(user , value) {

this.afs.doc(`users/${user.uid}`).set({
  firstName: value || 'there',
  email: user.email.toLowerCase(),
  uid: user.uid,
  profileImg : user.photoURL || `${window.location.origin}/assets/images/navbar-logo-2.png`,
  TimeStamp: Date.now() } , {merge: true});
}

  public setUserDocPAAS(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`PAASusers/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email || null,
    TimeStamp: Date.now(),
    };
    this.afs.doc(`users/${user.uid}`).set(data);
    return userRef.set(data);
  }

  resetPassword(email: string) {
    var auth = firebase.auth();
    return auth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error));
  }

    getUserFromEmail(email){
        return this.afs.collection(`users`,ref => {
            return ref.where('email','==',`${email}`)
                }).valueChanges();
    }

  // email string unused
  forgetPassword(userEmail: string, userFirstName: string) {
      const triggerUrl = 'https://us-central1-pitchspot-main.cloudfunctions.net/sendForgotPasswordEmail';

      return new Promise((resolve, reject) => { this.http.post(triggerUrl,
          {
              userEmail: userEmail,
              userFirstName: userFirstName
          }).subscribe();
      alert('Email Sent! Please reset your password.');
      });
  }

  sendEmailVerification(firstName:string, email:string) {
      this.user.subscribe(user => {
          this.getUserDocDirectWithUid(user.uid).subscribe(
              data => {
                  if (data === undefined) {
                      setTimeout( () => { window.location.reload();}, 2000);
                  } else {
                      const triggerUrl = 'https://us-central1-pitchspot-main.cloudfunctions.net/sendVerificationEmailAndSoftWelcome';
                      return new Promise((resolve, reject) => {
                          this.http.post(triggerUrl,
                              {
                                  userFirstName: firstName,
                                  userEmail: email
                              }).subscribe();
                          resolve();
                      })
                  }
              }
          )}
      );
  }

  resendEmailVerification() {
      this.user.subscribe(user => {
          this.getUserDocDirectWithUid(user.uid).subscribe(
              data => {
                  if (data === undefined) {
                      setTimeout( () => { window.location.reload();}, 2000);
                  } else {
                      const triggerUrl = 'https://us-central1-pitchspot-main.cloudfunctions.net/resendVerificationEmailAndSoftWelcome';
                      this.http.post(triggerUrl,
                          {
                              userFirstName: data.firstName,
                              userEmail: data.email
                          }).subscribe();
                      alert('Verification Email Sent! Please verify your account.');
                  }
              }
          )}
      );
  }

  isVerified() {
    if(firebase.auth().currentUser){
      return firebase.auth().currentUser.emailVerified;
    }
   
  }

  isLoggedin(){
    return this.afAuth.authState;
  }
}

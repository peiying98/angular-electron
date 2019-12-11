import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from 'angularfire2/firestore';
import { AuthService } from '../../service/auth.service';
import {Upload} from './upload';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UploadService {
  constructor(
    private auth: AuthService, 
    private afs: AngularFirestore) { }


    private basePath:string = 'profileImg';
    uploads: Observable<Upload[]>;
    
    pushUpload(upload: Upload) 
    {
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100 // 
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        upload.url = uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        this.saveFileData(upload)
      }
    );
  }



  
  private saveFileData(upload: Upload) {
    this.auth.getUser().subscribe( user => 
    {
      this.afs.doc(`users/${user.uid}`).set({
        profileImg: upload.url 
    }, { merge: true });
    
    }
  )  }
}
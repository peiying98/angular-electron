import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from 'angularfire2/firestore';
import { HttpClient } from '@angular/common/http';
// import { Action } from 'rxjs/scheduler/Action';

@Injectable()
export class TrackerService {
publicIP: any;
tracker: any;
  constructor(
    private afs: AngularFirestore,
    private http: HttpClient) { }



  CheckExist(pitchID){
  return this.afs.doc(`tracker/${pitchID}`).valueChanges()
  }

  CheckData (path, PitchID, checkIP){
    // return this.afs.collection(`users/${user}/chatrooms`).valueChanges();
    return this.afs.doc(`${path}${checkIP}`).valueChanges()

  }

  UpdateData (path, pitchID , uid )
  {



    this.http.get('https://api.ipify.org?format=json').subscribe(data =>
    {
      this.CheckData(path, pitchID, data['ip']).subscribe(innerdata =>
      {
        if(innerdata==null)
           {
            this.http.get(`https://freegeoip.net/json/${data['ip']}`).subscribe(
              country=> {

            this.afs.collection(`${path}`).doc(`${ data['ip']}`).set({IP: data['ip'], userID:uid, country: country['country_name']})
    this.afs.doc(`tracker/${pitchID}`).set({test: 'test'})
  }
)
          }
          else if(innerdata['userID'] == 'Annoynomous' && uid != 'Annoynomous')
            {

              this.http.get(`https://freegeoip.net/json/${data['ip']}`).subscribe(
                country=> {

              this.afs.collection(`${path}`).doc(`${ data['ip']}`).set({IP: data['ip'], userID:uid, country: country['country_name']})
    this.afs.doc(`tracker/${pitchID}`).set({test: 'test'})
  })
            }
    })})
  }

  getTrackerData(){
   this.tracker = this.afs.collection("tracker").snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })
return this.tracker;

// return this.afs.collection('tracker').valueChanges();
}

getPitchVisitorData(id){
  return this.afs.collection(`tracker/${id}/visitors`).valueChanges()
}
getPitchDirectChatNotLoggedInData(id){
  return this.afs.collection(`tracker/${id}/DirectChatNotLoggedIn`).valueChanges()
}
getPitchJobChatData(id){
  return this.afs.collection(`tracker/${id}/JobChat`).valueChanges()
}
getPitchJobChatNotLoggedInData(id){
  return this.afs.collection(`tracker/${id}/JobChatNotLoggedIn`).valueChanges()
}
getPitchDirectChatData(id){
  return this.afs.collection(`tracker/${id}/DirectChat`).valueChanges()
}



}




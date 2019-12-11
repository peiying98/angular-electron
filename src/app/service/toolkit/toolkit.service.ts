import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from 'angularfire2/firestore';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { log } from 'util';
import { map } from 'rxjs/operators';

@Injectable()
export class ToolkitService {
  partID:any = [];
  constructor
  (
    private afs: AngularFirestore,
    private router: Router,
    private http: HttpClient,
  ) {}

  addCanvas(title, problemstatement, note, userID, displayName){
    this.afs.collection(`users/${userID}/canvas`).add({
      Title: title,
      ProblemStatement: problemstatement,


    }).then( key => {
        var CanvasID = key.id;
        this.afs.doc(`canvas/${key.id}`).set({
          Title: title,
          ProblemStatement: problemstatement,
          userID: userID,
          createdBy: displayName,
            participants: [],
            participantsID: []
        });

        this.afs.doc(`canvas/${key.id}`).set({CanvasID: key.id} , {merge: true});
        this.afs.doc(`users/${userID}/canvas/${key.id}`).set( {CanvasID : key.id, Admin: true} , {merge:true})
        this.afs.collection(`canvas/${key.id}/Notes`).add(
          {
            content : note,
            timeStamp: Date.now()
          }).then(
            (key)=>{
              this.afs.doc(`canvas/${CanvasID}/Notes/${key.id}`).set({
               ID: key.id
              }, {merge: true})
            }
          )
        this.router.navigate([`/canvas/edit/${key.id}`]);
      });
    }

    getCanvasData(CanvasID){
      return this.afs.doc(`canvas/${CanvasID}`).valueChanges()
    }

    editCanvasMetaData(CanvasID, userID, participants, data){
      this.afs.doc(`users/${userID}/canvas/${CanvasID}`).set(data,{merge: true});
      if(participants.length > 0){
        participants.forEach(ele=>{
          this.afs.doc(`users/${ele}/canvas/${CanvasID}`).set(data,{merge: true});
        })
      }
      
      return this.afs.doc(`canvas/${CanvasID}`).set(data,{merge: true});
    }

  // removeCanvas(){}


  addPGA(CanvasID, data , PGA){
    if (navigator.onLine){
    this.afs.collection(`canvas/${CanvasID}/${PGA}`).add(data).then(
      key=>{
        this.afs.doc(`canvas/${CanvasID}/${PGA}/${key.id}`).set({ID: key.id},{merge: true});
        if (!('score' in data)){
          this.getAnalysis(CanvasID, data['content'], key.id, PGA);
        }
      }
    );
  }
  }

  editPGA(CanvasID, data, id , PGA){
    if (navigator.onLine){
    this.afs.doc(`canvas/${CanvasID}/${PGA}/${id}`).set(data,{merge: true});
    if (data['content'] !== undefined){
      this.getAnalysis(CanvasID, data['content'], id, PGA);
    }

  }
}

  getGain(CanvasID){
    return this.afs.collection(`canvas/${CanvasID}/Gain`, ref => ref.orderBy('timeStamp', 'desc') ).valueChanges()
  }
  getInertia(CanvasID){
    return this.afs.collection(`canvas/${CanvasID}/Inertia` , ref => ref.orderBy('timeStamp', 'desc')).valueChanges()
  }
  getPain(CanvasID){
    return this.afs.collection(`canvas/${CanvasID}/Pain`, ref => ref.orderBy('timeStamp', 'desc')).valueChanges()
  }

  removeGain(CanvasID, ID){
  return this.afs.doc(`canvas/${CanvasID}/Gain/${ID}`).delete()
  }

  removePain(CanvasID, ID){
  return this.afs.doc(`canvas/${CanvasID}/Pain/${ID}`).delete()
  }

  removeInertia(CanvasID, ID){
  return this.afs.doc(`canvas/${CanvasID}/Inertia/${ID}`).delete()
  }

  getUserCanvases(user){
    // console.log(user)
    // this.afs.collection(`users/${user}/canvas`).valueChanges().subscribe(
    //   data=>{
    //  data.forEach(
    //    data=>{
    //      console.log(data['CanvasID'])
    //    }
    //  )

    //   }
    // )
    return this.afs.collection(`users/${user}/canvas`).valueChanges();
    // return this.afs.collection(`canvas` , ref => {return ref.where('userID', '==', user)}).valueChanges();
  }

  delDocinCol(arr, dir){

    arr.forEach(ele => {
      // remove all collections
      this.afs.collection(`${dir}/${ele}`).ref.get()
      .then(function(querySnapshot) {

      querySnapshot.forEach(function(doc) {
          // For each doc, add a delete operation to the batch
          doc.ref.delete();
      });
    });
  });

  }

  delCol(arr,dir){

      // remove all collections
      this.afs.collection(`${dir}`).ref.get()
      .then(querySnapshot=> {
        // console.log(querySnapshot.docs)

          querySnapshot.docs.forEach(ele=>{
            
            if(arr.length === 0 || querySnapshot.docs.length === 0){
              this.afs.doc(`${dir}/${ele.id}`).delete()
              // console.log(`(delete)${dir}/${ele.id}`)
            }else{
              arr.forEach(element => {
                // console.log(`${dir}/${ele.id}/${element}`)
                this.delCol([],`${dir}/${ele.id}/${element}`)
                this.delCol([],`${dir}`)
              });
            }

          })
        
    });

  }

  // checkCollectiontest(id){

  //   var varLst = ['Gain', 'Pain', 'Inertia', 'Notes', 'Competitor', 'KP', 'KA', 'KR', 'VP', 'CR', 'CH', 'CS', 'Cost', 'Rev', 'Evidences', 'Visitors', 'regVisitors'  ]

  //   varLst.forEach(ele => {
  //     // remove all collections
  //     this.afs.collection(`canvas/${id}/${ele}`).ref.get()
  //     .then(querySnapshot=> {

  //     querySnapshot.forEach(doc=> {
  //         // For each doc, add a delete operation to the batch
  //         this.afs.doc(`canvas/${id}/${ele}/${doc.id}`).ref.get()
  //         .then(query=>{
  //           console.log(query.ref)
  //         })
  //     });
  //   });
  // });

  // }

  deleteCanvas(id, userID, userEmail){

    var gprLst = ['Gain', 'Pain', 'Inertia', 'Notes', 'Competitor']
    var bmcLst = ['Evidences', 'KP', 'KA', 'KR', 'VP', 'CR', 'CH', 'CS', 'Cost', 'Rev' ]
    var valLst =  ['Disconfirming', 'Leaning Disconfirming', 'Neutral', 'Leaning Confirming', 'Confirming' ]
    this.afs.doc(`users/${userID}/canvas/${id}`).valueChanges().take(1).subscribe(canvasData =>{
      if (canvasData['Admin']){

        // remove canvas from participants/collaborators
        this.afs.doc(`canvas/${id}`).ref.get()
        .then(querySnapshot => {
          const lst = querySnapshot.data()['participantsID']

          lst.forEach(participantsid => {
              // For each doc, add a delete operation to the batch
              // alert(`users/${participantsid}/canvas/${id}`)
              this.afs.doc(`users/${participantsid}/canvas/${id}`).ref.delete();
          });
      }).then(()=>{

      // deleting GPR fields
      this.delDocinCol(gprLst, `canvas/${id}`);

      // deleting bmc and validation
      bmcLst.forEach(ele => {
        this.delCol(valLst, `canvas/${id}/${ele}`)
      });
       // deleting regVisitors and Visitors
       this.delCol(['Timestamps'],`canvas/${id}/Visitors`)
       this.delCol(['Timestamps'],`canvas/${id}/regVisitors`)

      }).then(()=>{
        this.afs.doc(`canvas/${id}`).delete();
    });
  
        
    
      }else{
        // remove own email from array, unsubscribe to the canvas
        this.afs.doc(`canvas/${id}`).valueChanges().take(1).subscribe(listData => {
        const lst = listData['participants'];
        const lstID = listData['participantsID'];
        if (lst.length <= 1){
          this.afs.doc(`canvas/${id}`).set({
            participants:  [],
          },{merge: true});
          this.afs.doc(`canvas/${id}`).set({
            participantsID:  [],
          },{merge: true});
        }else{
          this.afs.doc(`canvas/${id}`).set({
            participants: lst.filter(obj => obj !== userEmail),
                  },{merge: true});
          this.afs.doc(`canvas/${id}`).set({
            participantsID:  lstID.filter(obj => obj !== userID),
                  },{merge: true});
            

        }
        
    });

    
    
      }
      this.afs.doc(`users/${userID}/canvas/${id}`).delete();

    });
  }

  // defaultNewsfeed(userID){
  //   return this.afs.collection(`users/${userID}/newsfeed`).add({content: 'blockchain'}).then((key)=>{
  //     this.afs.doc(`users/${userID}/newsfeed/${key.id}`).set({ID:key.id},{merge:true})
  //   }); 
  // }


  getNewsfeed(userID){
    return this.afs.collection(`users/${userID}/newsfeed`).valueChanges();
  }

  addNewsfeed(userID, data){
    return this.afs.collection(`users/${userID}/newsfeed`).add(data)
    .then((key)=>{
      this.afs.doc(`users/${userID}/newsfeed/${key.id}`)
      .set({ID:key.id},{merge:true})
    });
  }

  // addNews(data){
  //   return this.afs.collection(`newsfeed`).add(data)
  //   .then((key)=>{
  //     this.afs.doc(`newsfeed/${key.id}`)
  //     .set(data, {merge:true})
  //   });
  // }


  checkNewsfeed(userID, item){
    return this.afs.collection(`users/${userID}/newsfeed` , ref => {return ref.where('content', '==', item)}).valueChanges();
  }
  
  unsubscribeNewsfeed(userID, itemID){
    return this.afs.doc(`users/${userID}/newsfeed/${itemID}`).delete();
  }

  getCompetitor(id){
    return  this.afs.collection(`canvas/${id}/Competitor`).valueChanges();
  }

  unsubscribeCompetitor(CanvasID, itemID){
    return this.afs.doc(`canvas/${CanvasID}/Competitor/${itemID}`).delete();
  }

  checkCompetitor(id, item){
    return this.afs.collection(`canvas/${id}/Competitor` , ref => {return ref.where('content', '==', item)}).valueChanges();
  }

  addCompetitor(id, data){
    return this.afs.collection(`canvas/${id}/Competitor`).add(data).then((key)=>{
      this.afs.doc(`canvas/${id}/Competitor/${key.id}`).set({ID:key.id},{merge:true})
    })
  }

  updateFocus(id,value){
    this.afs.doc(`users/${id}`).set({focus: value},{merge: true})
  }

  updateVerification(id){
    this.afs.doc(`users/${id}`).set({isVerified: true},{merge: true})
  }


  collaborateWith(CanvasID, inviteeEmail, inviterFirstName){
   this.afs.collection(`users` , ref=> { return ref.where('email' , '==' , inviteeEmail) })
   .valueChanges().take(1).subscribe(inviteeData=>{
         if (!inviteeData['0']) {
           this.sendCollabInvitationForNewUsers(inviteeEmail, inviterFirstName);
           alert('This user has yet to register an account with Pitchspot; An email has been sent to your collaborator. Please re-invite your collaborator after they have registered with Pitchspot.')
         }else{
          const id = inviteeData['0']['uid'];
          this.afs.collection(`canvas` , ref=> {return ref.where('CanvasID' , '==' , CanvasID)})
              .valueChanges().take(1)
              .subscribe(canvasData =>{
                   if(inviteeEmail.toString() !== canvasData['0']['createdBy']){
                     this.afs.doc(`users/${id}/canvas/${CanvasID}`).set({
                       ProblemStatement: canvasData['0']['ProblemStatement'],
                       Title:canvasData['0']['Title'],
                       CanvasID: CanvasID,
                       Admin: false
                   })
                   }
                });
                this.afs.doc(`canvas/${CanvasID}`).valueChanges().take(1)
                    .subscribe(dat=>{
                      if(dat['participants'] == undefined && dat['participantsID'] == undefined){
                        this.afs.doc(`canvas/${CanvasID}`)
                            .set({participants:  [inviteeEmail.toString()],
                                  participantsID: [id],},
                                {merge: true});
                      } else if (dat['participants'] !== undefined && dat['participantsID'] == undefined){
                        this.afs.doc(`canvas/${CanvasID}`)
                            .set({participantsID: [id],},
                                {merge: true});
                      } else if (dat['participants'] == undefined && dat['participantsID'] !== undefined){
                        this.afs.doc(`canvas/${CanvasID}`)
                            .set({participants:  [inviteeEmail.toString()],},
                                {merge: true});
                      } else {
                        const list =  dat['participants'].concat(inviteeEmail.toString());
                        const listID =  dat['participantsID'].concat(id);
                       //  console.log(list, listID, dat['participants'].indexOf(inviteeEmail.toString()))
                        if (dat['participants'].indexOf(inviteeEmail.toString()) >= 0 ) {
                          // to get invitee email must search the users db to find the existing user's firstName
                           alert('This user has been invited!');
                        } else if (inviteeEmail.toString() === dat['createdBy']){
                          alert('This user is the owner of this canvas!');
                        } else {
                         this.sendCollabInvitationForExistingUsers(inviteeEmail, inviteeData['0']['firstName'], inviterFirstName);
                          this.afs.doc(`canvas/${CanvasID}`)
                              .set({ participants: list,
                                    participantsID: listID},
                                  { merge: true});
                        }
                      }
                    });
                  }
    })
  }

  deleteCollab(id, userID, userEmail){
    // remove own email from array, unsubscribe to the canvas
    this.afs.doc(`canvas/${id}`).valueChanges().take(1).subscribe(listData => {
    const lst = listData['participants'];
    const lstID = listData['participantsID'];
    if (lst.length <= 1){
      this.afs.doc(`canvas/${id}`).set({
        participants:  [],
      },{merge: true});
      this.afs.doc(`canvas/${id}`).set({
        participantsID:  [],
      },{merge: true});
    }else{

      this.afs.doc(`canvas/${id}`).set({
        participants: lst.filter(obj => obj !== userEmail),
              },{merge: true});
      this.afs.doc(`canvas/${id}`).set({
        participantsID:  lstID.filter(obj => obj !== userID),
              },{merge: true});

    }
    
});

return this.afs.doc(`users/${userID}/canvas/${id}`).delete();

  }


  sendCollabInvitationForExistingUsers(email: String, inviteeFirstName: String, inviterFirstName: String) {
    // let triggerUrl = 'https://us-central1-pitchspot-testing-site.cloudfunctions.net/sendCollabInvitationForExistingUsers'
    let triggerUrl = 'https://us-central1-pitchspot-main.cloudfunctions.net/sendCollabInvitationForExistingUsers';
    this.http.post(triggerUrl, {
      inviterFirstName : inviterFirstName,
      inviteeFirstName : inviteeFirstName,
      inviteeEmail : email
    }).subscribe();
  }

  sendCollabInvitationForNewUsers(email: String, inviterFirstName: String) {
    let triggerUrl = 'https://us-central1-pitchspot-main.cloudfunctions.net/sendCollabInvitationForNewUsers';
    this.http.post(triggerUrl, {
      inviterFirstName : inviterFirstName,
      inviteeEmail : email
    }).subscribe();
  }

//   rmCollaborate(id, partuserID, userEmail){
//     this.afs.doc(`canvas/${id}`).valueChanges().take(1).subscribe(listData => {
//       const lst = listData['participants'];

//       if (lst.length <= 1){
//         this.afs.doc(`canvas/${id}`).set({
//           participants:  [],
//         },{merge: true});
//       }else{
//         this.afs.doc(`canvas/${id}`).set({
//           participants:  lst.splice( lst.indexOf(`${userEmail}`), 1 ),
//                 },{merge: true});
//               }
//             });
//       this.afs.doc(`users/${partuserID}/canvas/${id}`).delete();
// }

getuserID(email){
  this.afs.collection(`users`, ref => {return ref.where('email', '==', email)}).valueChanges().take(1).subscribe(data=>{

   this.partID = this.partID.concat(data[0]['uid'])
   console.log(data, data[0]['uid'], this.partID);
  
  })
}

CollabRecon(CanvasID, emailArray){

  // if there is no collaborator
  if(!emailArray){
    return this.afs.doc(`canvas/${CanvasID}`).set({ participants: [], participantsID:[]}, {merge: true})
  }

  let partID = [];
//  eliminate email duplicates
  let unique = emailArray.filter(function(elem, index, self) {
    return index === self.indexOf(elem);
})

this.afs.doc(`canvas/${CanvasID}`).set({ participants: unique, participantsID:[]}, {merge: true})

unique.forEach(ele => {

    this.afs.collection(`users`, ref => {return ref.where('email', '==', ele)}).valueChanges().pipe().take(1).subscribe(data=>{
      if ( data[0]){
        // if user found, add to partID list
        partID = partID.concat(data[0]['uid'])
      }else{
        // if user not found, remove from participants list and update firebase cloud
     
        let new_unique = unique.filter(function(value, index, arr){
          return value !== ele;
        });
        this.afs.doc(`canvas/${CanvasID}`).set({ participants: new_unique}, {merge: true})
      }

      // if the length of unique list is same as partID
      if(unique.length === partID.length){
        return this.afs.doc(`canvas/${CanvasID}`).set({ participantsID: partID}, {merge: true})
      }
    
    })

  });

}


  getCanvasParticipants(CanvasID){
   return this.afs.doc(`canvas/${CanvasID}`).valueChanges()
  }

  getAnalysis(CanvasID, input_text, id , PGA){
    this.http.get('https://us-central1-pitchspot-main.cloudfunctions.net/getAnalysis' , {
      params: {
        content: input_text,
      }}).subscribe(res=>{
        this.editPGA(CanvasID,{
          score: res['score'],
        }, id, PGA);
      });
  
  }

  // business model canvas

  getKP(CanvasID){
    return this.afs.collection(`canvas/${CanvasID}/KP`, ref => ref.orderBy('timeStamp', 'asc') ).valueChanges()
  }
  getKA(CanvasID){
    return this.afs.collection(`canvas/${CanvasID}/KA`, ref => ref.orderBy('timeStamp', 'asc') ).valueChanges()
  }
  getKR(CanvasID){
    return this.afs.collection(`canvas/${CanvasID}/KR`, ref => ref.orderBy('timeStamp', 'asc') ).valueChanges()
  }
  getVP(CanvasID){
    return this.afs.collection(`canvas/${CanvasID}/VP`, ref => ref.orderBy('timeStamp', 'asc') ).valueChanges()
  }
  getCR(CanvasID){
    return this.afs.collection(`canvas/${CanvasID}/CR`, ref => ref.orderBy('timeStamp', 'asc') ).valueChanges()
  }
  getCH(CanvasID){
    return this.afs.collection(`canvas/${CanvasID}/CH`, ref => ref.orderBy('timeStamp', 'asc') ).valueChanges()
  }
  getCS(CanvasID){
    return this.afs.collection(`canvas/${CanvasID}/CS`, ref => ref.orderBy('timeStamp', 'asc') ).valueChanges()
  }
  getCost(CanvasID){
    return this.afs.collection(`canvas/${CanvasID}/Cost`, ref => ref.orderBy('timeStamp', 'asc') ).valueChanges()
  }
  getRev(CanvasID){
    return this.afs.collection(`canvas/${CanvasID}/Rev`, ref => ref.orderBy('timeStamp', 'asc') ).valueChanges()
  }

  enterBMC(CanvasID, data , col){
    if (navigator.onLine){
    this.afs.collection(`canvas/${CanvasID}/${col}`).add(data).then(
      key=>{
        this.afs.doc(`canvas/${CanvasID}/${col}/${key.id}`).set({ID: key.id},{merge: true});
      }
    );
  }
  }

  editBMC(CanvasID, data, id , col){
    if (navigator.onLine){
    this.afs.doc(`canvas/${CanvasID}/${col}/${id}`).set(data,{merge: true});


  }
}

countVisitor(CanvasID, uid){
  let timestamp = Date.now(); 
  if(uid){
    this.afs.doc(`canvas/${CanvasID}/regVisitors/${uid}`)
  .set({
    uid: uid,
    timeStamp: timestamp},{merge: true})
  .then(()=>{
    this.afs.doc(`canvas/${CanvasID}/regVisitors/${uid}/Timestamps/${timestamp}`).set(
      {timeStamp: timestamp}, {merge:true}
    )
  })
}else{
  this.afs.collection(`canvas/${CanvasID}/anomVisitors`)
  .add({timeStamp: timestamp})
  .then(key=>{
    this.afs.doc(`canvas/${CanvasID}/anomVisitors/${key.id}`).set({uid: key.id},{merge: true});
  })

}
}

getRegVisitor(CanvasID){
  return this.afs.collection(`canvas/${CanvasID}/regVisitors`).valueChanges();
}

getAnomVisitor(CanvasID){
  return this.afs.collection(`canvas/${CanvasID}/anomVisitors`).valueChanges();
}

getIPaddress(CanvasID, uid){
  if(uid){
    this.http.get<{ip:string}>('http://ip-api.com/json')
    .subscribe( data => {
      this.getBMCVisitorIP(CanvasID, uid, data)
            })
  }else{
    this.http.get<{ip:string}>('http://ip-api.com/json')
    .subscribe( data => {
      this.getBMCVisitorIP(CanvasID, data['query'], data)
            })
  }

}

getBMCVisitorIP(CanvasID,ip,data){
  let timestamp = Date.now(); 
  return this.afs.doc(`canvas/${CanvasID}/Visitors/${ip}`)
  .set(data,{merge: true})
  .then(()=>{
    this.afs.doc(`canvas/${CanvasID}/Visitors/${ip}/Timestamps/${timestamp}`)
    .set(data,{merge:true})
    .then(()=>{
      this.afs.doc(`canvas/${CanvasID}/Visitors/${ip}/Timestamps/${timestamp}`).set(
        {timeStamp: timestamp}, {merge:true}
      )
    });
  });
}

deleteBMC(CanvasID, id , col){
  if (navigator.onLine){
    this.afs.doc(`canvas/${CanvasID}/${col}/${id}`).delete();


  }
}

addEvidence(CanvasID, data){
  return this.afs.collection(`canvas/${CanvasID}/Evidences`).add(data).then((key)=>{
    this.afs.doc(`canvas/${CanvasID}/Evidences/${key.id}`).set({EvidenceID:key.id},{merge:true})
  })
}

editEvidence(CanvasID, EvidenceID, data){
  return this.afs.doc(`canvas/${CanvasID}/Evidences/${EvidenceID}`).set(data,{merge:true})
}

delEvidence(CanvasID, EvidenceID){
  return this.afs.doc(`canvas/${CanvasID}/Evidences/${EvidenceID}`).delete();
}

addCardDesc(CanvasID, typeID, type, desc){
  return this.afs.doc(`canvas/${CanvasID}/${type}/${typeID}`).set({description: desc},{merge: true});
}

getCardData(CanvasID, typeID, type){
  return this.afs.doc(`canvas/${CanvasID}/${type}/${typeID}`).valueChanges();
}

getCardEvidence(CanvasID, typeID, type, validation){
  return this.afs.collection(`canvas/${CanvasID}/${type}/${typeID}/${validation}`, ref => ref.orderBy('timeStamp', 'desc')).valueChanges();
}

getAllEvidences(CanvasID){
  return this.afs.collection(`canvas/${CanvasID}/Evidences`, ref => ref.orderBy('timeStamp', 'desc')).valueChanges()
}

getEvidence(CanvasID, EvidenceID){
  return this.afs.doc(`canvas/${CanvasID}/Evidences/${EvidenceID}`).valueChanges()
}

getTypeEvidences(CanvasID, typeID, type){
  return this.afs.collection(`canvas/${CanvasID}/${type}/${typeID}/evidences`, ref => ref.orderBy('timeStamp', 'desc') ).valueChanges();
}

getAllValidation(CanvasID, Validation, EvidenceID){
  return this.afs.firestore.collection(`canvas/${CanvasID}/Evidences/${EvidenceID}/${Validation}`);
  // return this.afs.collection(`canvas/${CanvasID}/Evidences/${EvidenceID}/${Validation}`).valueChanges();
}

isNAN(value){
  if(value !== undefined && value !== NaN && value !== null){
    return value;
  }else{
    return 0;
  }
}

totalEvidences(CanvasID, contentID, contentType){

  const D = this.getCardEvidence(CanvasID, contentID, contentType, 'Disconfirming').pipe().subscribe(data=>{
    this.afs.doc(`canvas/${CanvasID}/${contentType}/${contentID}`)
    .set({'Disconfirming': data['length']},{merge: true}).then(()=>{
      D.unsubscribe();
    });
  })
  const LD =this.getCardEvidence(CanvasID, contentID, contentType, 'Leaning Disconfirming').pipe().subscribe(data=>{
    this.afs.doc(`canvas/${CanvasID}/${contentType}/${contentID}`)
    .set({'Leaning Disconfirming': data['length']},{merge: true}).then(()=>{
      LD.unsubscribe();
    });
  })
  const N = this.getCardEvidence(CanvasID, contentID, contentType, 'Neutral').pipe().subscribe(data=>{
    this.afs.doc(`canvas/${CanvasID}/${contentType}/${contentID}`)
    .set({'Neutral': data['length']},{merge: true}).then(()=>{
      N.unsubscribe();
    });
  })
  const LC =this.getCardEvidence(CanvasID, contentID, contentType, 'Leaning Confirming').pipe().subscribe(data=>{
    this.afs.doc(`canvas/${CanvasID}/${contentType}/${contentID}`)
    .set({'Leaning Confirming': data['length']},{merge: true}).then(()=>{
      LC.unsubscribe();
    });
  })
  const C = this.getCardEvidence(CanvasID, contentID, contentType, 'Confirming').pipe().subscribe(data=>{
    this.afs.doc(`canvas/${CanvasID}/${contentType}/${contentID}`)
    .set({'Confirming': data['length']},{merge: true}).then(()=>{
      C.unsubscribe();
    });
})

const zero =this.getCardData(CanvasID, contentID, contentType).pipe().subscribe(data=>{
    if(data !== undefined){
      var value = Array(this.isNAN(data['Disconfirming']), 
      this.isNAN(data['Leaning Disconfirming']), 
      this.isNAN(data['Neutral']), 
      this.isNAN(data['Leaning Confirming']), 
      this.isNAN(data['Confirming'])).reduce((a, b) => a + b, 0);
      this.afs.doc(`canvas/${CanvasID}/${contentType}/${contentID}`)
        .set({numEvidences: value},{merge: true}).then(()=>{
          zero.unsubscribe();
        });;
    }


  });

//   setTimeout(() => 
// {
//   [D, LD, N, LC, C, zero].forEach(ele=>{
//     ele.unsubscribe()
//   })
// },
// 2000);

 
}

isSelected(CanvasID, contentType, contentID, Validation, EvidenceID){
  return this.afs.collection(`canvas/${CanvasID}/${contentType}/${contentID}/${Validation}`).valueChanges();

}

linkEvidence(CanvasID, UserName, EvidenceID, contentID, contentType, Validation){

  const data={
    EvidenceID: EvidenceID,
    ContentID: contentID,
    ContentType: contentType,
    user: UserName,
    validation: Validation,
    timeStamp: Date.now()
  }

  this.afs.doc(`canvas/${CanvasID}/${contentType}/${contentID}/${Validation}/${EvidenceID}`).set(data,{merge:true});

  this.afs.doc(`canvas/${CanvasID}/Evidences/${EvidenceID}/${Validation}/${contentID}`).set(data,{merge:true});

  switch(Validation){
    case "Disconfirming":
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Leaning Disconfirming');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Neutral');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Leaning Confirming');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Confirming');
      break;
    case "Leaning Disconfirming":
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Disconfirming');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Neutral');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Leaning Confirming');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Confirming');
      break;
    case "Neutral":
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Disconfirming');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Leaning Disconfirming');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Leaning Confirming');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Confirming');
      break;
    case "Leaning Confirming":
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Disconfirming');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Leaning Disconfirming');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Neutral');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Confirming');
      break;
    case "Confirming":
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Disconfirming');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Leaning Disconfirming');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Neutral');
      this.delLink(CanvasID, EvidenceID, contentID, contentType, 'Leaning Confirming');
      break;
    default:
      break;


  }
  this.totalEvidences(CanvasID, contentID, contentType);
}

delLink(CanvasID, EvidenceID, contentID, contentType, Validation){
 
  this.afs.doc(`canvas/${CanvasID}/${contentType}/${contentID}/${Validation}/${EvidenceID}`).delete()
  return this.afs.doc(`canvas/${CanvasID}/Evidences/${EvidenceID}/${Validation}/${contentID}`).delete().then(()=>{
    this.totalEvidences(CanvasID, contentID, contentType);
  })
  
    
  


}

}

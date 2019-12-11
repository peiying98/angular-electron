import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from 'angularfire2/firestore';

@Injectable()
export class NotesService {

  constructor( 
     private afs: AngularFirestore,) { }


  addNote(id, data){
this.afs.collection(`canvas/${id}/Notes`).add(data).then((key)=>{
  this.afs.doc(`canvas/${id}/Notes/${key.id}`).set({
ID: key.id
  }, {merge: true})
});
  }

  getNotes(id){
  return  this.afs.collection(`canvas/${id}/Notes` , ref => ref.orderBy('timeStamp', 'desc') ).valueChanges()
  }

  deleteNotes(CanvasID, itemID){
    
this.afs.doc(`canvas/${CanvasID}/Notes/${itemID}`).delete();
  }
}

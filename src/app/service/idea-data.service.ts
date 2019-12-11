import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/switchMap";
import "rxjs/add/observable/zip";

@Injectable()
export class IdeaDataService {

  constructor(private db: AngularFireDatabase) {

    const ideasList = db.list('ideas');

   }
  getIdeas(
    start: BehaviorSubject<string>,
    end: BehaviorSubject<string>
    ): Observable<any[]> {
    return Observable.zip(start, end).switchMap(param => {
    return this.db
    .list("/ideas", ref =>
    ref
    .orderByChild("Title")
    .limitToFirst(10)
    .startAt(param[0])
    .endAt(param[1])
    )
    .snapshotChanges()
    .map(changes => {
    return changes.map(c => {
    return { key: c.payload.key, ...c.payload.val() };
    });
    });
    });
    }
}
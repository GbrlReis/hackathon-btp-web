import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LineupsService {
  private readonly firebaseDocumentName = 'lineups'

  constructor(private firestore: AngularFirestore) { }

  saveLineup(lineup){
    if(lineup.id){
      return this.firestore.doc(this.firebaseDocumentName + '/' + lineup.id).update(lineup);  
    }
    return this.firestore.collection(this.firebaseDocumentName).add(lineup);
  }

  deleteLineups(lineupId){
    this.firestore.doc(this.firebaseDocumentName + '/' + lineupId).delete();
  }

  getLineUps(){
    // return
    
    let data = this.firestore.collection(this.firebaseDocumentName)
      .snapshotChanges()
      .pipe(
        map(activities => activities.map(this.mapLineup))
      )


    return data;
  }
  
  getLineup(lineupId){
    return this.firestore
      .doc(this.firebaseDocumentName + '/' + lineupId)
      .snapshotChanges()
      .pipe(
        map(this.mapLineup)
      )
  }

  private mapLineup(lineup){
    lineup = lineup.payload.doc || lineup.payload;
    return {
      ...lineup.data(),
      id: lineup.id
    };
  }

}

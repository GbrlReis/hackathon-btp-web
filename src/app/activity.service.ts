import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly firebaseDocumentName = 'activity'

  constructor(private firestore: AngularFirestore) { }

  saveActivity(activity){
    if(activity.id){
      return this.firestore.doc(this.firebaseDocumentName + '/' + activity.id).update(activity);  
    }
    return this.firestore.collection(this.firebaseDocumentName).add(activity);
  }

  deleteActivity(activityId){
    this.firestore.doc(this.firebaseDocumentName + '/' + activityId).delete();
  }

  getActivities(){
    return this.firestore.collection(this.firebaseDocumentName)
      .snapshotChanges()
      .pipe(
        map(activities => activities.map(this.mapActivity))
      )
  }
  
  getActivity(activityId){
    return this.firestore
      .doc(this.firebaseDocumentName + '/' + activityId)
      .snapshotChanges()
      .pipe(
        map(this.mapActivity)
      )
  }

  private mapActivity(activity){
    activity = activity.payload.doc || activity.payload;
    console.log(activity)
    return {
      ...activity.data(),
      id: activity.id
    };
  }

}

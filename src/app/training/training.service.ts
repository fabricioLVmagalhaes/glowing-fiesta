import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  exercisesChanged = new Subject<Exercise[]>();
  exerciseChanged = new Subject<Exercise>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private fbSubs: Subscription[] = [];

  private availableExercises: Exercise[] = [];

  private runningExercise: Exercise;

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.fbSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) => {
            return docArray.map((doc) => {
              const obj: any = doc.payload.doc.data();
              return {
                id: doc.payload.doc.id,
                name: obj.name,
                duration: obj.duration,
                calories: obj.calories,
              };
            });
          })
        )
        .subscribe({
          next: (exercises: Exercise[]) => {
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
          },
        })
    );
    // .subscribe((exercises: Exercise[]) => {
    //   this.availableExercises = exercises;
    //   this.exercisesChanged.next([...this.availableExercises]);
    // }, error => {
    //   console.log(error);

    // });
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date().toISOString()})
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id == selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });

    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise(): Exercise {
    return { ...this.runningExercise };
  }

  fetchCompletedOuCancelledExercises() {
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe({
          next: ((exercises: Exercise[]) => {
            this.finishedExercisesChanged.next(exercises);
          }),
        })
    );
  }

  private addDataToDatabase(exercise: Exercise) {
    const temp = {
      ...exercise,
      date: exercise.date.toISOString(),
    };
    this.db.collection('finishedExercises').add(temp);
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => {
      sub.unsubscribe();
    })
  }
}

import { Observable } from 'rxjs';


import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Exercise } from './../exercise.model';
import { TrainingService } from './../training.service';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  exercises: Observable<any>;

  constructor(private trainingService: TrainingService, private db: Firestore) {}

  ngOnInit(): void {
    this.exercises = collectionData(collection(this.db, 'availableExercises'));
    // this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}

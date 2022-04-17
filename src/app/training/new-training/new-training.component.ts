import { UIService } from '../../shared/ui.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Exercise } from './../exercise.model';
import { TrainingService } from './../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  subscriptions: Subscription[] = [];
  loading = true;

  constructor(
    private trainingService: TrainingService,
    public uiService: UIService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.uiService.loadingStateChanged.subscribe((loading) => {
        this.loading = loading;
      })
    );
    this.subscriptions.push(
      this.trainingService.exercisesChanged.subscribe(
        (exercises) => (this.exercises = exercises)
      )
    );

    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}

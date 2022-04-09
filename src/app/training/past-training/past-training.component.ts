import { TrainingService } from './../training.service';
import { Exercise } from './../exercise.model';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css'],
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.dataSource.data = this.trainingService.getExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

import { Exercise } from './exercise.model';
import { , SET_AVAILABLE_TRAININGS, SET_FINISHED_TRAININGS, TrainingActions, STOP_TRAINING, START_TRAINING } from './training.actions';
import * as fromRoot from '../app.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null,
};

export function trainingReducer(state = initialState, action: TrainingActions): TrainingState {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        availableExercises: action.payload,
      };
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
        finishedExercises: action.payload,
      };
      case START_TRAINING:
        return {
          ...state,
          activeTraining: {...state.availableExercises.find(ex => ex.id === action.payload)},
        };
    case STOP_TRAINING:
      return {
        ...state,
        activeTraining: null,
      };
    default:
      return state;
  }
}


export const getTrainigState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainigState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainigState, (state: TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainigState, (state: TrainingState) => state.activeTraining);

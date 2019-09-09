import { StateResponse } from './../../models/response/state-response';
import { ClassesResponse } from './../../models/response/classes-response';
import { BoardResponse } from './../../models/response/board-response';

export const initialState = {
    isLoading: false,
    error: '',
    boardResponse: new BoardResponse(),
    classesResponse: new ClassesResponse(),
    stateResponse: new StateResponse(),
};
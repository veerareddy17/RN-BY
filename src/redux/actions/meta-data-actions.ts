import { LeadService } from './../../services/lead-service';
import { BoardResponse } from './../../models/response/board-response';
import { ClassesResponse } from './../../models/response/classes-response';
import { Dispatch } from 'redux';
import { StateResponse } from './../../models/response/state-response';
import { FETCH_BOARD, FETCH_CLASSES, FETCH_STATES, META_DATA_ERROR, FETCH_COMPLETE } from './action-types';

export const fetchActionComplete = () => {
    return {
        type: FETCH_COMPLETE,
    };
};

export const fetchBoardSuccessAction = (boardResponse: BoardResponse) => {
    return {
        type: FETCH_BOARD,
        payload: boardResponse,
    };
};

export const fetchClassesSuccessAction = (classesResponse: ClassesResponse) => {
    return {
        type: FETCH_CLASSES,
        payload: classesResponse,
    };
};

export const fetchStatesSuccessAction = (statesResponse: StateResponse) => {
    return {
        type: FETCH_STATES,
        payload: statesResponse,
    };
};

export const metaDataFailureAction = error => {
    return {
        type: META_DATA_ERROR,
        payload: error,
    };
};

export const fetchMetaData = () => async (dispatch: Dispatch) => {
    try {

        const boardResp = await LeadService.fetchBoards();
        console.log('boardResp', boardResp);
        dispatch(fetchBoardSuccessAction(boardResp));
        const classesResp = await LeadService.fetchClasses();
        console.log('classesResp', classesResp);
        dispatch(fetchClassesSuccessAction(classesResp));
        const stateResp = await LeadService.fetchStateByCountry(1);
        console.log('stateResp', stateResp);
        dispatch(fetchStatesSuccessAction(stateResp));
        dispatch(fetchActionComplete());
    } catch (error) {
        console.log(error);
        dispatch(metaDataFailureAction(error));
    }
};

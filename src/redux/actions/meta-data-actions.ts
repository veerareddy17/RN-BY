import { LeadService } from './../../services/lead-service';
import { BoardResponse } from './../../models/response/board-response';
import { ClassesResponse } from './../../models/response/classes-response';
import { Dispatch } from 'redux';
import { StateResponse } from './../../models/response/state-response';
import { FETCH_BOARD, FETCH_CLASSES, FETCH_STATES, META_DATA_ERROR } from './action-types';

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
    console.log('fetch meta data');
    try {
        const boardResp = await LeadService.fetchBoards();
        dispatch(fetchBoardSuccessAction(boardResp.data));
        const classesResp = await LeadService.fetchClasses();
        dispatch(fetchClassesSuccessAction(classesResp.data));
        const stateResp = await LeadService.fetchStateByCountry(1);
        dispatch(fetchStatesSuccessAction(stateResp.data));
    } catch (error) {
        console.log(error);
        dispatch(metaDataFailureAction(error));
    }
};


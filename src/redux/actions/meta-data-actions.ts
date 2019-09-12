import { ErrorResponse } from './../../models/response/error-response';
import { serverErrorCallAction, errorCallResetAction } from './error-actions';
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
    console.log('fetch meta data');
    dispatch(errorCallResetAction())
    try {
        const boardResp = await LeadService.fetchBoards();
        if (boardResp && boardResp.data) {
            dispatch(fetchBoardSuccessAction(boardResp.data));
        }
        const classesResp = await LeadService.fetchClasses();
        if (classesResp && classesResp.data) {
            dispatch(fetchClassesSuccessAction(classesResp.data));
        }
        const stateResp = await LeadService.fetchStateByCountry(1);
        if (stateResp && stateResp.data) {
            dispatch(fetchStatesSuccessAction(stateResp.data));
        }
        dispatch(fetchActionComplete());
    } catch (e) {
        console.log(e);
        let errors = Array<ErrorResponse>();
        errors.push(new ErrorResponse('Server', e.message))
        dispatch(serverErrorCallAction(errors));
        dispatch(metaDataFailureAction(e));
    }
};
